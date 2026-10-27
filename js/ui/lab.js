// Interactive protection lab: pick a breaker, a load and a leakage, see what trips and when.
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});
  if (typeof document === 'undefined') return;
  const P = () => EB.protection;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const X = (s) => EB.regions.expand(s);

  const W = 560, H = 250, L = 56, B = 30, T = 14, Rm = 12;
  const mMin = 1, mMax = 100, tMin = 0.005, tMax = 20000;
  const lx = (m) => L + ((Math.log10(m) - Math.log10(mMin)) / (Math.log10(mMax) - Math.log10(mMin))) * (W - L - Rm);
  const ly = (t) => T + (1 - (Math.log10(t) - Math.log10(tMin)) / (Math.log10(tMax) - Math.log10(tMin))) * (H - T - B);

  function create(host, opts = {}) {
    const r = EB.regions.current;
    const state = { rating: r.defaultRating, curve: r.defaultCurve, loadA: opts.loadA || r.defaultRating * 0.8, leakMa: opts.leakMa || 0 };
    host.className = 'lab';
    host.innerHTML = `
      <div class="lab-controls">
        <label>Breaker rating <select data-k="rating">${r.ratings.map((v) => `<option ${v === state.rating ? 'selected' : ''}>${v}</option>`).join('')}</select> A</label>
        ${r.curves.length > 1 ? `<label>Curve <select data-k="curve">${r.curves.map((c) => `<option ${c === state.curve ? 'selected' : ''}>${c}</option>`).join('')}</select></label>` : ''}
      </div>
      <label class="lab-row">Load current <input type="range" data-k="load" min="0" max="100" value="0" aria-label="Load current"> <output data-o="load"></output></label>
      <div class="lab-presets" aria-label="Presets"></div>
      <label class="lab-row">Leakage to earth <input type="range" data-k="leak" min="0" max="100" value="0" aria-label="Leakage current to earth"> <output data-o="leak"></output></label>
      <svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Time-current chart for the breaker" class="labchart"></svg>
      <div class="lab-out" aria-live="polite"></div>`;
    const el = (s) => host.querySelector(s);
    const loadFromSlider = (v) => Math.pow(10, -0.5 + (v / 100) * 3.5); // 0.3 A .. 1000 A (log)
    const sliderFromLoad = (a) => ((Math.log10(Math.max(a, 0.3)) + 0.5) / 3.5) * 100;
    const leakFromSlider = (v) => Math.round((v * v) / 10) / 10; // 0 .. 100 mA, finer at the low end
    const sliderFromLeak = (mA) => Math.sqrt(Math.max(0, mA) / 100) * 100;
    el('[data-k=load]').value = sliderFromLoad(state.loadA);
    el('[data-k=leak]').value = sliderFromLeak(state.leakMa);

    const presets = [
      ['Normal load', () => ({ loadA: r.defaultRating * 0.6, leakMa: 0 })],
      ['1.5× overload', () => ({ loadA: r.defaultRating * 1.5, leakMa: 0 })],
      ['Short circuit', () => ({ loadA: r.defaultRating * 30, leakMa: 0 })],
      ['Person touches live', () => ({ loadA: r.defaultRating * 0.3, leakMa: Math.round((r.V / 2000) * 1000) })],
    ];
    el('.lab-presets').innerHTML = presets.map(([n], i) => `<button type="button" class="small" data-p="${i}">${n}</button>`).join('');

    function draw() {
      const ev = P().evaluate({ rating: state.rating, curve: state.curve, rcdMa: r.rcdMa, rcdTimes: r.rcdTimes, loadA: state.loadA, leakMa: state.leakMa });
      const m = Math.min(mMax, Math.max(mMin, state.loadA / state.rating));
      const pts = [];
      for (let i = 0; i <= 120; i++) {
        const mm = mMin * Math.pow(mMax / mMin, i / 120);
        const t = P().breakerTime(state.rating, state.curve, mm * state.rating);
        if (Number.isFinite(t) && t <= tMax) pts.push(`${lx(mm).toFixed(1)},${ly(Math.max(t, tMin)).toFixed(1)}`);
      }
      const gx = [1, 10, 100].map((v) => `<line x1="${lx(v)}" y1="${T}" x2="${lx(v)}" y2="${H - B}" class="lgrid"/><text x="${lx(v)}" y="${H - 10}" class="lt" text-anchor="middle">${v}×</text>`).join('');
      const gy = [0.01, 1, 100, 10000].map((v) => `<line x1="${L}" y1="${ly(v)}" x2="${W - Rm}" y2="${ly(v)}" class="lgrid"/><text x="${L - 6}" y="${ly(v) + 4}" class="lt" text-anchor="end">${v >= 1 ? v + ' s' : v * 1000 + ' ms'}</text>`).join('');
      const mt = Number.isFinite(ev.mcbT) ? Math.min(Math.max(ev.mcbT, tMin), tMax) : null;
      el('.labchart').innerHTML = `${gx}${gy}<polyline points="${pts.join(' ')}" class="lcurve"/>
        <line x1="${lx(m)}" y1="${T}" x2="${lx(m)}" y2="${H - B}" class="lmark"/>${mt ? `<circle cx="${lx(m)}" cy="${ly(mt)}" r="5" class="ldot"/>` : ''}
        <text x="${W - Rm}" y="${T + 10}" class="lt" text-anchor="end">breaker tripping time vs current (× rating)</text>`;
      el('[data-o=load]').textContent = `${+state.loadA.toFixed(1)} A (${+(state.loadA / state.rating).toFixed(2)}× rating)`;
      el('[data-o=leak]').textContent = `${state.leakMa} mA`;
      const verdict = { none: 'Nothing trips. The circuit keeps running.', mcb: 'The breaker trips.', rcd: `The ${r.rcd} trips.` }[ev.first];
      const body = state.leakMa ? `${esc(P().bodyBand(state.leakMa))}` : '';
      el('.lab-out').innerHTML = `<p><strong>${esc(verdict)}</strong></p>
        <ul><li>Breaker (${state.rating} A${r.curves.length > 1 ? `, curve ${state.curve}` : ''}): ${esc(Number.isFinite(ev.mcbT) ? P().fmtTime(ev.mcbT) : 'does not trip at this current')}</li>
        <li>${esc(r.rcd)} (${r.rcdMa} mA): ${esc(Number.isFinite(ev.rcdT) ? 'trips in about ' + P().fmtTime(ev.rcdT) + ' (a limit, devices are often faster)' : state.leakMa ? 'leakage is below its trip threshold' : 'no leakage')}</li>
        ${body ? `<li>${state.leakMa} mA through a body: ${body}</li>` : ''}</ul>
        <p class="muted">Teaching model: real devices vary within their standards.</p>`;
    }
    host.addEventListener('input', (e) => {
      const k = e.target.dataset.k;
      if (k === 'rating') state.rating = +e.target.value;
      else if (k === 'curve') state.curve = e.target.value;
      else if (k === 'load') state.loadA = loadFromSlider(+e.target.value);
      else if (k === 'leak') state.leakMa = leakFromSlider(+e.target.value);
      draw();
    });
    host.addEventListener('click', (e) => {
      const b = e.target.closest('[data-p]');
      if (!b) return;
      Object.assign(state, presets[+b.dataset.p][1]());
      el('[data-k=load]').value = sliderFromLoad(state.loadA);
      el('[data-k=leak]').value = sliderFromLeak(state.leakMa);
      draw();
    });
    draw();
    void X;
  }
  EB.ui = EB.ui || {};
  EB.ui.lab = create;
})();
