/* ============================================================
   N2N保険仲立人 — 商品検索（JA）
   クライアントサイド検索 — タイトル・キーワード・分野・概要を対象
   使用箇所：GNB検索入力（全JAページ）+ /ja/search.html
   ============================================================ */
(function () {
  'use strict';
  function urlPrefix() {
    var p = window.location.pathname;
    if (p.indexOf('/ja/products/') > -1) return '../';
    return '';
  }
  var INDEX = null, indexPromise = null;
  function loadIndex() {
    if (indexPromise) return indexPromise;
    if (window.PRODUCTS_INDEX_JA && window.PRODUCTS_INDEX_JA.products) {
      INDEX = window.PRODUCTS_INDEX_JA.products;
      indexPromise = Promise.resolve(INDEX);
      return indexPromise;
    }
    indexPromise = Promise.resolve((INDEX = []));
    return indexPromise;
  }
  function normalize(s){return (s||'').toLowerCase().replace(/[\s\-_·,()&・（）「」／・]/g,'');}
  function tokenize(s){return (s||'').toLowerCase().split(/[\s\-_·,()・（）／]+/).filter(function(x){return x.length>0;});}
  function score(product, query) {
    if (!query) return 0;
    var qNorm = normalize(query), qTokens = tokenize(query);
    if (!qNorm) return 0;
    var s = 0;
    var titleN = normalize(product.title), enN = normalize(product.en_code||''),
        catN = normalize(product.category_label||''), leadN = normalize(product.lead||''),
        metaN = normalize(product.meta_desc||''), kwN = (product.keywords||[]).map(normalize);
    if (titleN === qNorm) s += 100;
    else if (titleN.indexOf(qNorm) > -1) s += 50;
    if (enN.indexOf(qNorm) > -1) s += 25;
    if (catN.indexOf(qNorm) > -1) s += 8;
    if (leadN.indexOf(qNorm) > -1) s += 5;
    if (metaN.indexOf(qNorm) > -1) s += 4;
    for (var i=0;i<kwN.length;i++){
      if (kwN[i]===qNorm){s+=18;}
      else if ((kwN[i].indexOf(qNorm)>-1||qNorm.indexOf(kwN[i])>-1)&&kwN[i].length>1){s+=10;}
    }
    if (qTokens.length > 1) {
      var allText = titleN+' '+enN+' '+catN+' '+leadN+' '+kwN.join(' ');
      var allMatch = qTokens.every(function(t){return allText.indexOf(normalize(t))>-1;});
      if (allMatch) s += 20;
      else {
        var matched = qTokens.filter(function(t){return allText.indexOf(normalize(t))>-1;}).length;
        s = s * (matched/qTokens.length);
      }
    }
    return s;
  }
  function search(query, limit){
    if (!INDEX||!query||!query.trim()) return [];
    limit = limit||50;
    return INDEX.map(function(p){return {product:p,score:score(p,query)};})
      .filter(function(r){return r.score>0;})
      .sort(function(a,b){return b.score-a.score;}).slice(0,limit);
  }
  function escapeHtml(s){return (s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function escapeRegex(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
  function highlight(text, query){
    if (!query||!text) return escapeHtml(text);
    var out = escapeHtml(text);
    tokenize(query).filter(function(t){return t.length>1;}).forEach(function(t){
      out = out.replace(new RegExp('('+escapeRegex(t)+')','gi'),'<mark>$1</mark>');
    });
    return out;
  }
  function renderResultItem(r, query, prefix){
    var p = r.product;
    var title = highlight(p.title, query);
    var lead = p.lead ? highlight(p.lead.substring(0,140)+(p.lead.length>140?'…':''), query) : '';
    var cat = p.category_label ? '<span class="search-result-cat">'+escapeHtml(p.category_label)+'</span>' : '';
    return '<a class="search-result-item" href="'+prefix+escapeHtml(p.url)+'">'+
      '<div class="search-result-meta">'+cat+'</div>'+
      '<div class="search-result-title">'+title+'</div>'+
      (lead?'<p class="search-result-lead">'+lead+'</p>':'')+'</a>';
  }
  function initGnbSearch(){
    var input = document.getElementById('gnbSearchInput');
    var dropdown = document.getElementById('gnbSearchDropdown');
    if (!input||!dropdown) return;
    var debounceT;
    function run(){
      clearTimeout(debounceT);
      debounceT = setTimeout(function(){
        var q = input.value.trim();
        if (!q){dropdown.classList.remove('open');dropdown.innerHTML='';return;}
        var results = search(q,8);
        if (results.length===0){
          dropdown.innerHTML = '<div class="search-empty">該当する商品が見つかりませんでした — <a href="'+urlPrefix()+'consult.html?ref=search-empty&product='+encodeURIComponent(q)+'">ご相談フォーム</a>からお問い合わせください。</div>';
        } else {
          dropdown.innerHTML = results.map(function(r){return renderResultItem(r,q,urlPrefix());}).join('')+
            '<a class="search-more" href="'+urlPrefix()+'search.html?q='+encodeURIComponent(q)+'">すべての結果を見る →</a>';
        }
        dropdown.classList.add('open');
      },150);
    }
    input.addEventListener('input', function(){loadIndex().then(run);});
    input.addEventListener('focus', function(){loadIndex().then(function(){if(input.value.trim())run();});});
    input.addEventListener('keydown', function(e){
      if (e.key==='Enter'){e.preventDefault();var q=input.value.trim();if(q)window.location.href=urlPrefix()+'search.html?q='+encodeURIComponent(q);}
      else if (e.key==='Escape'){dropdown.classList.remove('open');input.blur();}
    });
    document.addEventListener('click', function(e){if(!dropdown.contains(e.target)&&e.target!==input)dropdown.classList.remove('open');});
  }
  function initSearchPage(){
    var input = document.getElementById('searchPageInput');
    var resultsEl = document.getElementById('searchPageResults');
    var statsEl = document.getElementById('searchPageStats');
    var catFilter = document.getElementById('searchCatFilter');
    if (!input||!resultsEl) return;
    function run(){
      var q = input.value.trim();
      var cat = catFilter ? catFilter.value : '';
      var results = q ? search(q,200) : INDEX.map(function(p){return {product:p,score:1};});
      if (cat) results = results.filter(function(r){return r.product.category===cat;});
      if (statsEl){
        statsEl.textContent = (q||cat) ? (results.length+'件'+(q?' · 「'+q+'」':'')) : ('全'+results.length+'件の商品');
      }
      if (results.length===0){
        resultsEl.innerHTML = '<div class="search-empty-page"><h3>該当する商品が見つかりませんでした</h3>'+
          '<p>別のキーワードでお試しいただくか、分野の絞り込みを解除してください。</p>'+
          '<p>お探しの種目が掲載されていない場合は、<a href="consult.html?ref=search-empty&product='+encodeURIComponent(q)+'">ご相談フォーム</a>からお問い合わせください。</p></div>';
      } else {
        resultsEl.innerHTML = '<div class="search-result-list">'+results.map(function(r){return renderResultItem(r,q,'');}).join('')+'</div>';
      }
      if (q){var url=new URL(window.location);url.searchParams.set('q',q);window.history.replaceState({},'',url);}
    }
    var debT;
    input.addEventListener('input', function(){clearTimeout(debT);debT=setTimeout(function(){loadIndex().then(run);},150);});
    if (catFilter) catFilter.addEventListener('change', function(){loadIndex().then(run);});
    var params = new URLSearchParams(window.location.search);
    var initialQ = params.get('q');
    if (initialQ) input.value = initialQ;
    loadIndex().then(run);
  }
  document.addEventListener('DOMContentLoaded', function(){initGnbSearch();initSearchPage();});
  window.N2NSearchJA = {load:loadIndex, search:function(q,l){return loadIndex().then(function(){return search(q,l);});}};
})();
