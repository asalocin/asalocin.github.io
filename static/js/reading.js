(function () {
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const search = q('#searchInput');
  const segs = qa('.segmented .seg');
  const buckets = qa('.bucket');
  let active = 'all';

  function matches(card, term) {
    if (!term) return true;
    const t = (card.getAttribute('data-title') || '').toLowerCase();
    const a = (card.getAttribute('data-author') || '').toLowerCase();
    return t.includes(term) || a.includes(term);
  }

  function statusOk(card) {
    if (active === 'all') return true;
    return (card.getAttribute('data-status') || '') === active;
  }

  function render() {
    const term = (search.value || '').trim().toLowerCase();
    qa('.read-card').forEach(c => {
      const show = matches(c, term) && statusOk(c);
      c.style.display = show ? '' : 'none';
    });

    // Oculta el bucket entero si todas sus cards están ocultas
    buckets.forEach(b => {
      const anyVisible = qa('.read-card', b).some(c => c.style.display !== 'none');
      b.style.display = anyVisible ? '' : 'none';
    });
  }

  if (search) search.addEventListener('input', render);

  segs.forEach(btn => {
    btn.addEventListener('click', () => {
      segs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      active = btn.getAttribute('data-seg');
      render();
      // si el filtro es específico, baja al primer bucket visible
      if (active !== 'all') {
        const first = buckets.find(b => b.style.display !== 'none');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Activar desde los quick-cards de la cabecera
  qa('.qcard').forEach(card => {
    card.addEventListener('click', (e) => {
      const seg = card.getAttribute('data-filter');
      const btn = q(`.seg[data-seg="${seg}"]`);
      if (btn) btn.click();
      // deja que el ancla haga scroll, pero sincronizado con filtro
    });
  });

  render();
})();
