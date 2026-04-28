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
})();
