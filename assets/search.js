/* ============================================================
   N2N Insurance Brokerage — Product Search Engine
   클라이언트 사이드 검색 — 제목·키워드·원수사·카테고리·요약 매칭
   사용처:
     1) GNB 검색 인풋 (모든 페이지)
     2) search.html 전용 검색 페이지
   ============================================================ */
(function () {
  'use strict';

  // ─── 인덱스 로딩 ─────────────────────────────────
  // 페이지 위치별 상대경로 처리
  function indexUrl() {
    var p = window.location.pathname;
    if (p.indexOf('/products/') > -1) return '../assets/products-index.json';
    return 'assets/products-index.json';
  }
  function urlPrefix() {
    var p = window.location.pathname;
    if (p.indexOf('/products/') > -1) return '../';
    return '';
  }

  var INDEX = null;
  var indexPromise = null;
  function loadIndex() {
    if (indexPromise) return indexPromise;
    // 1) window.PRODUCTS_INDEX (products-index.js로 미리 로드된 글로벌) 우선 사용
    //    — file:// 프로토콜에서도 동작하도록
    if (window.PRODUCTS_INDEX && window.PRODUCTS_INDEX.products) {
      INDEX = window.PRODUCTS_INDEX.products;
      indexPromise = Promise.resolve(INDEX);
      return indexPromise;
    }
    // 2) 폴백: HTTP 환경에서는 JSON fetch
    indexPromise = fetch(indexUrl())
      .then(function (r) { return r.json(); })
      .then(function (data) { INDEX = data.products || []; return INDEX; })
      .catch(function () { INDEX = []; return INDEX; });
    return indexPromise;
  }

  // ─── 검색 알고리즘 ─────────────────────────────
  function normalize(s) {
    return (s || '').toLowerCase().replace(/[\s\-_·,()&]/g, '');
  }
  function tokenize(s) {
    return (s || '').toLowerCase().split(/[\s\-_·,()]+/).filter(function (x) { return x.length > 0; });
  }

  /**
   * 검색: query에 대해 각 product를 점수화
   *   - 제목 정확 매치: +50
   *   - 제목 부분 매치: +30
   *   - 영문 코드 매치: +25
   *   - 키워드 매치: +15 (정확) / +10 (부분)
   *   - 원수사 매치: +12
   *   - 카테고리 매치: +8
   *   - 요약/설명 매치: +5
   *   - 멀티 토큰: 모든 토큰이 어딘가에 있어야 함
   */
  function score(product, query) {
    if (!query) return 0;
    var qNorm = normalize(query);
    var qTokens = tokenize(query);
    if (!qNorm) return 0;

    var s = 0;
    var titleN = normalize(product.title);
    var enN = normalize(product.en_code || '');
    var insN = normalize(product.insurer || '');
    var catN = normalize(product.category_label || '');
    var leadN = normalize(product.lead || '');
    var metaN = normalize(product.meta_desc || '');
    var kwN = (product.keywords || []).map(normalize);

    // 단일 쿼리 매칭
    if (titleN === qNorm) s += 100;
    else if (titleN.indexOf(qNorm) > -1) s += 50;
    if (enN.indexOf(qNorm) > -1) s += 25;
    if (insN.indexOf(qNorm) > -1) s += 12;
    if (catN.indexOf(qNorm) > -1) s += 8;
    if (leadN.indexOf(qNorm) > -1) s += 5;
    if (metaN.indexOf(qNorm) > -1) s += 4;

    var kwHit = false;
    for (var i = 0; i < kwN.length; i++) {
      if (kwN[i] === qNorm) { s += 18; kwHit = true; }
      else if (kwN[i].indexOf(qNorm) > -1 || qNorm.indexOf(kwN[i]) > -1) {
        if (kwN[i].length > 1) { s += 10; kwHit = true; }
      }
    }

    // 멀티 토큰 — 모든 토큰이 어딘가에 매치돼야 추가 점수
    if (qTokens.length > 1) {
      var allText = titleN + ' ' + enN + ' ' + insN + ' ' + catN + ' ' + leadN + ' ' + kwN.join(' ');
      var allMatch = qTokens.every(function (t) {
        var tn = normalize(t);
        return allText.indexOf(tn) > -1;
      });
      if (allMatch) s += 20;
      else if (qTokens.length >= 2) {
        // 일부만 매치되면 점수 감소
        var matched = qTokens.filter(function (t) { return allText.indexOf(normalize(t)) > -1; }).length;
        s = s * (matched / qTokens.length);
      }
    }

    return s;
  }

  function search(query, limit) {
    if (!INDEX) return [];
    if (!query || query.trim().length === 0) return [];
    limit = limit || 50;
    var results = INDEX.map(function (p) {
      return { product: p, score: score(p, query) };
    }).filter(function (r) { return r.score > 0; });
    results.sort(function (a, b) { return b.score - a.score; });
    return results.slice(0, limit);
  }

  // ─── HTML 렌더링 ────────────────────────────────
  function highlight(text, query) {
    if (!query || !text) return escapeHtml(text);
    var qTokens = tokenize(query).filter(function (t) { return t.length > 1; });
    var out = escapeHtml(text);
    qTokens.forEach(function (t) {
      var re = new RegExp('(' + escapeRegex(t) + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }
  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function renderResultItem(r, query, prefix) {
    var p = r.product;
    // 원수사는 검색 결과에 노출하지 않음 — 보험중개사는 특정 회사를 대리하지 않음
    var title = highlight(p.title, query);
    var lead = p.lead ? highlight(p.lead.substring(0, 140) + (p.lead.length > 140 ? '…' : ''), query) : '';
    var cat = p.category_label ? '<span class="search-result-cat">' + escapeHtml(p.category_label) + '</span>' : '';

    return '<a class="search-result-item" href="' + prefix + escapeHtml(p.url) + '">' +
      '<div class="search-result-meta">' + cat + '</div>' +
      '<div class="search-result-title">' + title + '</div>' +
      (lead ? '<p class="search-result-lead">' + lead + '</p>' : '') +
    '</a>';
  }

  // ─── GNB 검색 인풋 ───────────────────────────────
  function initGnbSearch() {
    var input = document.getElementById('gnbSearchInput');
    var dropdown = document.getElementById('gnbSearchDropdown');
    if (!input || !dropdown) return;

    var debounceT;
    function run() {
      clearTimeout(debounceT);
      debounceT = setTimeout(function () {
        var q = input.value.trim();
        if (!q) {
          dropdown.classList.remove('open');
          dropdown.innerHTML = '';
          return;
        }
        var results = search(q, 8);
        if (results.length === 0) {
          dropdown.innerHTML = '<div class="search-empty">매칭되는 상품이 없습니다 — <a href="' + urlPrefix() + 'consult.html?ref=search-empty&product=' + encodeURIComponent(q) + '">상담신청</a>하면 맞춤 안내드립니다.</div>';
        } else {
          var html = results.map(function (r) { return renderResultItem(r, q, urlPrefix()); }).join('');
          html += '<a class="search-more" href="' + urlPrefix() + 'search.html?q=' + encodeURIComponent(q) + '">전체 결과 보기 →</a>';
          dropdown.innerHTML = html;
        }
        dropdown.classList.add('open');
      }, 150);
    }

    input.addEventListener('input', function () {
      loadIndex().then(run);
    });
    input.addEventListener('focus', function () {
      loadIndex().then(function () { if (input.value.trim()) run(); });
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var q = input.value.trim();
        if (q) window.location.href = urlPrefix() + 'search.html?q=' + encodeURIComponent(q);
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        input.blur();
      }
    });
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target) && e.target !== input) {
        dropdown.classList.remove('open');
      }
    });
  }

  // ─── search.html 전용 페이지 ────────────────────
  function initSearchPage() {
    var input = document.getElementById('searchPageInput');
    var resultsEl = document.getElementById('searchPageResults');
    var statsEl = document.getElementById('searchPageStats');
    var catFilter = document.getElementById('searchCatFilter');
    var insFilter = document.getElementById('searchInsFilter');
    if (!input || !resultsEl) return;

    function run() {
      var q = input.value.trim();
      var cat = catFilter ? catFilter.value : '';
      var ins = insFilter ? insFilter.value : '';
      var results = q ? search(q, 200) : INDEX.map(function (p) { return { product: p, score: 1 }; });

      // 필터링
      if (cat) results = results.filter(function (r) { return r.product.category === cat; });
      if (ins) results = results.filter(function (r) {
        var pi = r.product.insurer || '';
        if (ins === 'DB') return pi.indexOf('DB') > -1;
        if (ins === 'Chubb') return pi.indexOf('Chubb') > -1;
        if (ins === '현대해상') return pi.indexOf('현대') > -1;
        if (ins === 'KB') return pi.indexOf('KB') > -1;
        return true;
      });

      // 결과 렌더
      if (statsEl) {
        if (q || cat || ins) {
          statsEl.textContent = '검색결과 ' + results.length + '건' + (q ? ' · 검색어 "' + q + '"' : '');
        } else {
          statsEl.textContent = '전체 상품 ' + results.length + '종';
        }
      }
      if (results.length === 0) {
        resultsEl.innerHTML = '<div class="search-empty-page">' +
          '<h3>검색결과가 없습니다</h3>' +
          '<p>키워드를 다른 단어로 바꾸거나, 카테고리·원수사 필터를 해제해 보세요.</p>' +
          '<p>원하시는 보험상품이 검색되지 않을 경우 <a href="consult.html?ref=search-empty&product=' + encodeURIComponent(q) + '">상담신청</a>해 주시면 맞춤 안내드립니다.</p>' +
          '</div>';
      } else {
        resultsEl.innerHTML = '<div class="search-result-list">' +
          results.map(function (r) { return renderResultItem(r, q, ''); }).join('') +
          '</div>';
      }

      // URL 업데이트 (q만)
      if (q) {
        var url = new URL(window.location);
        url.searchParams.set('q', q);
        window.history.replaceState({}, '', url);
      }
    }

    var debT;
    input.addEventListener('input', function () {
      clearTimeout(debT);
      debT = setTimeout(function () { loadIndex().then(run); }, 150);
    });
    if (catFilter) catFilter.addEventListener('change', function () { loadIndex().then(run); });
    if (insFilter) insFilter.addEventListener('change', function () { loadIndex().then(run); });

    // 초기 로드 — URL의 q 파라미터 적용
    var params = new URLSearchParams(window.location.search);
    var initialQ = params.get('q');
    if (initialQ) input.value = initialQ;
    loadIndex().then(run);
  }

  // ─── 부팅 ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initGnbSearch();
    initSearchPage();
  });

  // 외부 노출 (디버그·확장용)
  window.N2NSearch = {
    load: loadIndex,
    search: function (q, limit) { return loadIndex().then(function () { return search(q, limit); }); },
  };
})();
