// Region profiles. Everything that differs between countries lives here, never in lesson text.
// IMPORTANT: these values are widely published conventions used for TEACHING. They have NOT yet been
// reviewed by a licensed electrician (reviewed: null). The app shows a banner saying so.
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});

  const profiles = {
    'iec-230': {
      id: 'iec-230', name: '230 V / 50 Hz', long: '230 V, 50 Hz (UK, EU and much of Africa, Asia and Oceania)',
      V: 230, Hz: 50,
      supply: 'Most homes have a single-phase supply of {{V}} V between live and neutral. Some homes have a three-phase supply, which has three live conductors that are 400 V apart from each other.',
      live: 'brown (older installations may use red)', neutral: 'blue (older installations may use black)', earth: 'green and yellow stripes',
      rcd: 'RCD', rcdLong: 'residual-current device (RCD)', rcdMa: 30, rcdTimes: [0.3, 0.15, 0.04],
      breaker: 'MCB (miniature circuit breaker)', panel: 'consumer unit',
      ratings: [6, 10, 16, 20, 32, 40], curves: ['B', 'C', 'D'], defaultCurve: 'B', defaultRating: 16,
      source: 'Widely published conventions (IEC 60446 colour identification, IEC 61008/61009 RCD behaviour, IEC 60898 breaker curves)', reviewed: null,
    },
    'na-120': {
      id: 'na-120', name: '120/240 V / 60 Hz', long: '120/240 V, 60 Hz (USA, Canada and a few other places)',
      V: 120, Hz: 60,
      supply: 'Homes have a split-phase supply: two {{V}} V lines that are opposite in polarity, so each is {{V}} V to neutral and 240 V between the two lines. Large appliances such as ovens and dryers use the 240 V.',
      live: 'black (red for the second line)', neutral: 'white or grey', earth: 'green, or bare copper',
      rcd: 'GFCI', rcdLong: 'ground-fault circuit interrupter (GFCI)', rcdMa: 5, rcdTimes: [0.03, 0.03, 0.03],
      breaker: 'circuit breaker', panel: 'breaker panel',
      ratings: [15, 20, 30], curves: ['std'], defaultCurve: 'std', defaultRating: 20,
      source: 'Widely published conventions (NEC colour practice, UL 943 GFCI behaviour)', reviewed: null,
    },
  };

  const KEY = 'he-region-v1';
  let current = 'iec-230';
  try { const saved = localStorage.getItem(KEY); if (saved && profiles[saved]) current = saved; } catch (_) { /* no storage */ }

  // {{TOKEN}} -> value from the active (or given) region
  function tokens(r) {
    return {
      V: String(r.V), HZ: String(r.Hz), SUPPLY: null, LIVE: r.live, NEUTRAL: r.neutral, EARTH: r.earth,
      RCD: r.rcd, RCDLONG: r.rcdLong, RCDMA: String(r.rcdMa), BREAKER: r.breaker, PANEL: r.panel,
      RATING: String(r.defaultRating), EMERGENCY: 'your local emergency number',
    };
  }
  function expand(str, r = profiles[current]) {
    const t = tokens(r);
    t.SUPPLY = r.supply.replace(/\{\{V\}\}/g, t.V);
    return String(str).replace(/\{\{([A-Z]+)\}\}/g, (m, k) => (t[k] !== undefined ? t[k] : m));
  }

  EB.regions = {
    all: profiles,
    get current() { return profiles[current]; },
    set(id) { if (!profiles[id]) return; current = id; try { localStorage.setItem(KEY, id); } catch (_) { /* ignore */ } },
    expand, tokens,
  };
})();
