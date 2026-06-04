/* N2N Insurance Brokerage — JTOK-style B2B site JS */
(function () {
  // ---- Mobile GNB toggle ----
  const toggle = document.querySelector('.menu-toggle');
  const gnbList = document.querySelector('.gnb > ul');
  if (toggle && gnbList) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      gnbList.classList.toggle('open');
      toggle.classList.toggle('is-active');
    });
    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!gnbList.contains(e.target) && !toggle.contains(e.target)) {
        gnbList.classList.remove('open');
        toggle.classList.remove('is-active');
      }
    });
  }

  // ---- Active GNB highlight (match depth1) ----
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.gnb > ul > li').forEach(li => {
    const link = li.querySelector('a');
    if (!link) return;
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === path) li.classList.add('active');
    // also activate if any depth2 child matches
    li.querySelectorAll('.depth2 a').forEach(a2 => {
      const h2 = (a2.getAttribute('href') || '').toLowerCase();
      if (h2 === path || (path.startsWith('products') && h2.startsWith('products'))) {
        li.classList.add('active');
      }
    });
  });

  // ---- Right-quick To-Top ----
  const toTop = document.querySelector('.rq-totop');
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Form validation / placeholder guard ----
  const form = document.querySelector('#consultForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      const action = form.getAttribute('action') || '';
      if (action.includes('REPLACE_WITH_YOUR_FORMSPREE_ID') ||
          action.includes('YOUR_GOOGLE_FORM_URL')) {
        e.preventDefault();
        alert(
          '상담신청 접수 시스템 연결이 아직 완료되지 않았습니다.\n\n' +
          '아래 연락처로 직접 접수 부탁드립니다:\n' +
          '• 이메일: hanwook.seong@n2nib.com\n' +
          '• 전화:   010-5755-6465\n' +
          '• 플랫폼: cargoinsu.com'
        );
      }
    });
  }

  // ---- Mini inquiry form (index page) → redirect to consult.html with params ----
  const miniForm = document.querySelector('#miniInquiry');
  if (miniForm) {
    miniForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(miniForm);
      const params = new URLSearchParams();
      for (const [k, v] of data.entries()) if (v) params.append(k, v);
      location.href = 'consult.html?' + params.toString();
    });
  }

  // ---- consult.html: prefill from query string ----
  if (location.pathname.toLowerCase().endsWith('consult.html')) {
    const qs = new URLSearchParams(location.search);
    qs.forEach((v, k) => {
      const el = document.querySelector(`[name="${k}"]`);
      if (el && !el.value) el.value = v;
    });
  }

  // ---- Product detail page: tab switching ----
  const tabBtns = document.querySelectorAll('.pd-tab-btn');
  const tabPanes = document.querySelectorAll('.pd-tab-pane');
  if (tabBtns.length && tabPanes.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = document.getElementById(target);
        if (pane) pane.classList.add('active');
        // update URL hash without jumping
        if (history.replaceState) history.replaceState(null, '', '#' + target);
      });
    });
    // restore from hash
    const hash = (location.hash || '').replace('#', '');
    if (hash) {
      const btn = document.querySelector(`.pd-tab-btn[data-tab="${hash}"]`);
      if (btn) btn.click();
    }
  }

  // =====================================================
  // Quick Win 1 — 푸터 신뢰 블록 자동 주입 (모든 페이지)
  // =====================================================
  function injectFooterTrust() {
    const footer = document.querySelector('footer.site-footer');
    if (!footer) return;
    if (footer.querySelector('.footer-trust')) return; // 이미 주입됨
    const bottom = footer.querySelector('.footer-bottom');
    const trust = document.createElement('div');
    trust.className = 'footer-trust';
    trust.style.cssText = 'border-top:1px solid rgba(244,240,232,.15);margin-top:1.5rem;padding-top:1rem;font-size:.78rem;line-height:1.6;color:rgba(244,240,232,.7)';
    trust.innerHTML = '\n  <div class="container">\n    <strong style="color:rgba(244,240,232,.85)">예금자보호</strong> 본 사이트의 모든 손해보험 상품은 예금자보호법에 따라 1인당 최고 <strong>1억원</strong>까지 보호됩니다.<br>\n    <strong style="color:rgba(244,240,232,.85)">보험사기 신고</strong> 금융감독원 ☎1332 · 보험사기방지센터 <a href="https://www.fss.or.kr/insec" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">www.fss.or.kr/insec</a><br>\n    <strong style="color:rgba(244,240,232,.85)">분쟁조정</strong> 금융분쟁조정위원회 ☎1332 · 한국소비자원 ☎1372<br>\n    <span style="opacity:.75">본 광고는 보험상품 안내자료이며, 계약내용은 약관·증권이 우선합니다. 광고는 자율준수 원칙에 따라 게재되었습니다.</span>\n  </div>\n';
    if (bottom && bottom.parentNode === footer) {
      footer.insertBefore(trust, bottom);
    } else if (bottom) {
      // bottom이 container 안에 있는 경우: bottom 직전에 삽입
      bottom.parentNode.insertBefore(trust, bottom);
    } else {
      footer.appendChild(trust);
    }
  }
  injectFooterTrust();

  // =====================================================
  // Quick Win 6 — 상품 페이지 통일 CTA 자동 주입
  // =====================================================
  function injectProductCTA() {
    const path = location.pathname.toLowerCase();
    if (!path.includes('/products/')) return;
    // 이미 통일 CTA가 존재하면 스킵
    if (document.querySelector('.pd-cta-final')) return;
    const existing = document.querySelector('.pd-cta-bar');
    if (!existing) return;
    // 기존 CTA에서 상품명 추출
    let productName = '';
    const link = existing.querySelector('a[href*="consult.html"]');
    if (link) {
      const href = link.getAttribute('href') || '';
      const m = href.match(/[?&]product=([^&]+)/);
      if (m) {
        try { productName = decodeURIComponent(m[1]); } catch(e) { productName = m[1]; }
      }
    }
    if (!productName) {
      const h1 = document.querySelector('h1');
      if (h1) productName = (h1.textContent || '').trim();
    }
    const encoded = encodeURIComponent(productName || '');
    const final = document.createElement('section');
    final.className = 'pd-cta-final';
    final.style.cssText = 'margin:24px 0;padding:20px;background:linear-gradient(135deg,#0B2818,#1a4a35);color:#F4F0E8;border-radius:8px;text-align:center';
    final.innerHTML =
      '<h3 style="margin:0 0 8px;color:#F4F0E8">이 상품으로 견적받기</h3>' +
      '<p style="margin:0 0 16px;opacity:.85;font-size:.9rem">엔투엔보험중개의 ACIU 기업보험심사역이 AM Best A++~A 등급 6개 보험회사 약관을 비교 분석합니다.</p>' +
      '<a href="../consult.html?product=' + encoded + '" style="display:inline-block;padding:10px 24px;background:#F4F0E8;color:#0B2818;text-decoration:none;border-radius:6px;font-weight:700">무료 상담신청 →</a>' +
      '<a href="tel:010-5755-6465" style="display:inline-block;margin-left:8px;padding:10px 24px;background:transparent;color:#F4F0E8;text-decoration:none;border-radius:6px;font-weight:700;border:1px solid rgba(244,240,232,.4)">☎ 010-5755-6465</a>';
    existing.parentNode.insertBefore(final, existing.nextSibling);
  }
  // ★ 비활성화 — 사용자 요청: CTA 3중 중복 제거 (HTML pd-cta-bar + 푸터 클러스터로 충분)
  // injectProductCTA();

  // =====================================================
  // 모바일 상단 sticky 헤더 자동 주입 (모든 페이지, 모바일 전용)
  // 햄버거(기존 GNB 토글로 위임) + 로고 + 상담신청 CTA
  // =====================================================
  function injectMobileStickyHeader() {
    if (document.querySelector('.mobile-sticky-header')) return;
    var path = location.pathname.toLowerCase();
    var isInProducts = path.indexOf('/products/') !== -1;
    var homeHref = isInProducts ? '../index.html' : 'index.html';
    var consultHref = isInProducts ? '../consult.html' : 'consult.html';
    /* ★ 새 로고 적용: logo-horizontal.svg (라이트배경용, 텍스트 다크그린)
       — 모바일 sticky 헤더는 흰색 배경이므로 라이트 변형 사용 */
    var logoSrc = isInProducts ? '../assets/logo-horizontal.svg' : 'assets/logo-horizontal.svg';
    var header = document.createElement('header');
    header.className = 'mobile-sticky-header';
    header.setAttribute('role', 'banner');
    header.innerHTML =
      '<button type="button" class="msh-menu" aria-label="메뉴 열기"><span></span></button>' +
      '<a class="msh-logo" href="' + homeHref + '" aria-label="엔투엔보험중개 홈">' +
        '<img src="' + logoSrc + '" alt="N2N Insurance Brokerage">' +
      '</a>' +
      '<a class="msh-cta" href="' + consultHref + '">상담신청</a>';
    document.body.insertBefore(header, document.body.firstChild);
    // 햄버거 클릭 → GNB 메뉴 직접 토글 (document outside-click 핸들러 우회)
    var newMenuBtn = header.querySelector('.msh-menu');
    if (newMenuBtn) {
      newMenuBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        var gnbList = document.querySelector('.gnb > ul');
        var origToggle = document.querySelector('.menu-toggle');
        var isOpen = gnbList && gnbList.classList.contains('open');
        if (gnbList) gnbList.classList.toggle('open');
        if (origToggle) origToggle.classList.toggle('is-active');
        // 햄버거 ↔ X 토글 + 본문 스크롤 락 (오픈 시 body 고정)
        document.body.classList.toggle('mobile-menu-open', !isOpen);
        newMenuBtn.classList.toggle('is-open', !isOpen);
        newMenuBtn.setAttribute('aria-label', !isOpen ? '메뉴 닫기' : '메뉴 열기');
        if (!isOpen) window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
  injectMobileStickyHeader();

  // 모바일 GNB 펼침 시 하단에 전화·카톡 버튼 자동 주입 (모바일 전용)
  // ★ FIX: 데스크톱(≥781px)에서는 절대 주입하지 않음 — 메인 메뉴에 위젯처럼 보이는 버그 차단
  function injectMobileMenuFooterCTAs() {
    if (window.matchMedia && window.matchMedia('(min-width: 781px)').matches) return;
    var gnbList = document.querySelector('.gnb > ul');
    if (!gnbList || gnbList.querySelector('.mmf-cta')) return;
    var li = document.createElement('li');
    li.className = 'mmf-cta';
    li.style.cssText = 'list-style:none;padding:14px 20px 18px;display:flex;flex-direction:column;gap:10px;border-top:1px solid rgba(244,240,232,0.18);margin-top:8px';
    li.innerHTML =
      '<a href="tel:010-5755-6465" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:transparent;border:1px solid rgba(244,240,232,0.6);border-radius:6px;color:#F4F0E8;text-decoration:none;font-weight:700">☎ 전화상담 010-5755-6465</a>' +
      '<a href="https://pf.kakao.com/_xlxkxdTX/chat" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:#FEE500;color:#3C1E1E;border-radius:6px;text-decoration:none;font-weight:700">💬 카카오톡 1:1 상담</a>';
    gnbList.appendChild(li);
  }
  injectMobileMenuFooterCTAs();

  // =====================================================
  // 데스크톱 sticky 헤더 — 로고 영역을 .gnb 좌측에 주입
  // (≥781px 전용; CSS @media에서 스타일 제어)
  // =====================================================
  function injectDesktopHeaderLogo() {
    var gnb = document.querySelector('.gnb');
    if (!gnb) return;
    if (gnb.querySelector('.gnb-logo')) return;
    var path = location.pathname.toLowerCase();
    var isInProducts = path.indexOf('/products/') !== -1;
    var homeHref = isInProducts ? '../index.html' : 'index.html';
    /* ★ 새 로고 — 데스크톱 헤더는 다크그린 배경이므로 dark 변형 사용 */
    var logoSrc = isInProducts ? '../assets/logo-horizontal-dark.svg' : 'assets/logo-horizontal-dark.svg';
    var logoAnchor = document.createElement('a');
    logoAnchor.className = 'gnb-logo';
    logoAnchor.href = homeHref;
    logoAnchor.setAttribute('aria-label', '엔투엔보험중개 홈');
    logoAnchor.innerHTML =
      '<img src="' + logoSrc + '" alt="N2N Insurance Brokerage">';
    gnb.insertBefore(logoAnchor, gnb.firstChild);
  }
  injectDesktopHeaderLogo();

  // =====================================================
  // 푸터 CTA 클러스터 자동 주입 — 상담신청 + 전화 + 카톡
  // (모든 페이지 공통, 기존 .site-footer 직전에 삽입)
  // =====================================================
  function injectFooterCTACluster() {
    var footer = document.querySelector('footer.site-footer');
    if (!footer) return;
    if (document.querySelector('.footer-cta-cluster')) return;
    var path = location.pathname.toLowerCase();
    var isInProducts = path.indexOf('/products/') !== -1;
    var consultHref = isInProducts ? '../consult.html' : 'consult.html';
    var section = document.createElement('section');
    section.className = 'footer-cta-cluster';
    section.setAttribute('aria-label', '빠른 상담 안내');
    section.innerHTML =
      '<div class="fcc-inner">' +
        '<h3>전문 보험중개사가 직접 상담합니다</h3>' +
        '<p class="fcc-sub">ACIU 기업보험심사역 · AM Best A++~A 등급 6개 보험회사 약관 비교<br>평균 1영업일 회신</p>' +
        '<div class="fcc-buttons">' +
          '<a class="fcc-primary" href="' + consultHref + '">✎ 상담신청</a>' +
          '<a class="fcc-phone" href="tel:010-5755-6465">☎ 010-5755-6465</a>' +
          '<a class="fcc-kakao" href="https://pf.kakao.com/_xlxkxdTX/chat" target="_blank" rel="noopener">💬 카톡상담</a>' +
        '</div>' +
      '</div>';
    footer.parentNode.insertBefore(section, footer);
  }
  injectFooterCTACluster();

  // =====================================================
  // 모바일 하단 sticky CTA 바 자동 주입 (모든 페이지, 모바일 전용)
  // =====================================================
  function injectMobileCTABar() {
    if (document.querySelector('.mobile-cta-bar')) return; // 이미 주입됨
    var path = location.pathname.toLowerCase();
    // 상담페이지 본인에서는 "상담신청" 버튼 강조 색을 바꿈 (이미 폼에 있음)
    var isConsult = path.endsWith('consult.html') || path.endsWith('/consult');
    var consultHref = isConsult ? '#consultForm' : (path.includes('/products/') ? '../consult.html' : 'consult.html');
    var bar = document.createElement('nav');
    bar.className = 'mobile-cta-bar';
    bar.setAttribute('aria-label', '빠른 연락');
    bar.innerHTML =
      '<a href="tel:010-5755-6465" aria-label="전화상담"><span class="ico">☎</span><span>전화</span></a>' +
      '<a class="cta-kakao" href="https://pf.kakao.com/_xlxkxdTX/chat" target="_blank" rel="noopener" aria-label="카카오톡 상담"><span class="ico">💬</span><span>카톡</span></a>' +
      '<a class="cta-primary" href="' + consultHref + '" aria-label="상담신청"><span class="ico">✎</span><span>상담신청</span></a>';
    document.body.appendChild(bar);
    document.body.classList.add('has-mobile-cta');
  }
  // 하단 CTA 바 비활성화 — 벤치마크(Squaremouth/Policygenius)는 모두 하단 바 없음.
  // injectMobileCTABar();

  // =====================================================
  // products.html 검색 + 카테고리 필터 (입력란/칩이 있을 때만 동작)
  // =====================================================
  function initProductsPageFilter() {
    var input = document.getElementById('prodFilterInput');
    var chips = document.querySelectorAll('.prod-chip[data-filter-cat]');
    var cards = document.querySelectorAll('.prod-card[data-cat]');
    var countEl = document.getElementById('prodFilterCount');
    var blocks = document.querySelectorAll('.cat-block');
    if (!input || cards.length === 0) return;

    var activeCat = 'all';
    var query = '';

    function applyFilter() {
      var visible = 0;
      cards.forEach(function(card){
        var cat = card.getAttribute('data-cat') || '';
        var text = (card.textContent || '').toLowerCase();
        var matchCat = activeCat === 'all' || cat === activeCat;
        var matchQuery = !query || text.indexOf(query) !== -1;
        var show = matchCat && matchQuery;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      // 카테고리 블록 자체도 필터에 따라 숨김 (해당 카테고리에 보이는 카드 없으면 헤더도 숨김)
      blocks.forEach(function(block){
        var anyVisible = block.querySelectorAll('.prod-card:not([style*="display: none"])').length > 0;
        block.style.display = anyVisible ? '' : 'none';
      });
      if (countEl) countEl.textContent = visible + '종 표시 중';
    }

    input.addEventListener('input', function(e){
      query = (e.target.value || '').toLowerCase().trim();
      applyFilter();
    });

    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        activeCat = chip.getAttribute('data-filter-cat');
        chips.forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
        applyFilter();
      });
    });

    applyFilter();
  }
  initProductsPageFilter();

})();

// =====================================================
// Quick Win 7 — GTM dataLayer 이벤트 자동 트래킹
// =====================================================
window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', function() {
  // 1. 전화 클릭
  document.querySelectorAll('a[href^="tel:"]').forEach(function(el){
    el.addEventListener('click', function(){
      window.dataLayer.push({event:'phone_click', phone_number:el.href.replace('tel:','')});
    });
  });
  // 2. 이메일 클릭 — GTM 이벤트 + 클립보드 복사 폴백 (PC 메일앱 미설정 대응)
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(el){
    el.addEventListener('click', function(e){
      var email = el.href.replace('mailto:','').split('?')[0];
      window.dataLayer.push({event:'email_click', email:email});
      // 클립보드 자동 복사 (mailto: 동작과 병행 — 메일앱 없는 PC 사용자도 주소 확보)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function(){
          showToast('이메일 주소를 복사했습니다: ' + email);
        }).catch(function(){});
      }
    });
  });
  // ---- 토스트 알림 (3초간 표시) ----
  function showToast(msg){
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;left:50%;bottom:32px;transform:translateX(-50%);background:#0B2818;color:#F4F0E8;padding:12px 20px;border-radius:8px;font-size:.9rem;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.25);z-index:99999;opacity:0;transition:opacity .3s';
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.style.opacity='1'; });
    setTimeout(function(){
      t.style.opacity='0';
      setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 2700);
  }
  // 3. 카카오 클릭
  document.querySelectorAll('a[href*="pf.kakao.com"]').forEach(function(el){
    el.addEventListener('click', function(){
      window.dataLayer.push({event:'kakao_click'});
    });
  });
  // 4. 폼 제출 (consult/quote)
  document.querySelectorAll('form').forEach(function(f){
    f.addEventListener('submit', function(){
      window.dataLayer.push({event:'form_submit', form_id:f.id||f.name||'unknown'});
    });
  });
  // 5. 자동견적 사용 (cargoinsu only)
  document.querySelectorAll('[data-calculator], #calcSubmit').forEach(function(el){
    el.addEventListener('click', function(){
      window.dataLayer.push({event:'calculator_use'});
    });
  });
});
