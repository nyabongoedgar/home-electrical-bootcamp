// Teaching models of protective devices. They illustrate behaviour; they are NOT design tools.
// Real devices are specified by standards and manufacturer data and vary within allowed bands.
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});

  const CONVENTIONAL_S = 3600; // "conventional tripping time" for breakers: 1 hour
  const INSTANT_S = 0.01;
  // typical instantaneous (magnetic) threshold, as a multiple of rating (B: 3-5x, C: 5-10x, D: 10-20x)
  const MAGNETIC = { B: 4, C: 7.5, D: 15, std: 7.5 };

  // Seconds until a breaker trips at `amps`; Infinity if it never will.
  // Thermal region: t = 3600 * (1.1025 / (m^2 - 1))^3, so t(1.45x) = 1 hour and it falls steeply above that.
  function breakerTime(rating, curve, amps) {
    const m = amps / rating;
    if (m >= (MAGNETIC[curve] || MAGNETIC.std)) return INSTANT_S;
    if (m < 1.13) return Infinity; // must not trip below 1.13x within an hour
    return CONVENTIONAL_S * Math.pow(1.1025 / (m * m - 1), 3);
  }

  // Cartridge-fuse style: slower at small overloads, I²t-like melt at large ones.
  function fuseTime(rating, amps) {
    const m = amps / rating;
    if (m < 1.6) return Infinity;
    return Math.max(INSTANT_S, CONVENTIONAL_S * Math.pow(1.56 / (m * m - 1), 2));
  }

  // Residual-current device: trips at or above its rating; time falls with larger leakage.
  function rcdTime(ratingMa, leakMa, times = [0.3, 0.15, 0.04]) {
    const m = leakMa / ratingMa;
    if (m < 1) return Infinity;
    return m < 2 ? times[0] : m < 5 ? times[1] : times[2];
  }

  // Which device acts first for this situation? -> { first, mcbT, rcdT, category }
  function evaluate({ rating, curve, rcdMa, rcdTimes, loadA, leakMa }) {
    const mcbT = breakerTime(rating, curve, loadA);
    const rcdT = rcdTime(rcdMa, leakMa || 0, rcdTimes);
    const mcbActs = mcbT <= CONVENTIONAL_S;
    const rcdActs = Number.isFinite(rcdT);
    let first = 'none';
    if (mcbActs && rcdActs) first = rcdT <= mcbT ? 'rcd' : 'mcb';
    else if (mcbActs) first = 'mcb';
    else if (rcdActs) first = 'rcd';
    const t = first === 'mcb' ? mcbT : first === 'rcd' ? rcdT : Infinity;
    const category = first === 'none' ? 'none' : first === 'rcd' ? 'rcd' : t <= 0.1 ? 'instant' : 'slow';
    return { first, mcbT, rcdT, category };
  }

  // Rough effect of current through the body (IEC 60479-style bands, for teaching).
  function bodyBand(mA) {
    if (mA < 1) return 'usually not felt';
    if (mA < 10) return 'felt as a tingle or pain; you can usually let go';
    if (mA < 30) return 'muscles may lock so you cannot let go; breathing can be affected';
    return 'serious risk of a dangerous heart rhythm (ventricular fibrillation) and death';
  }
  const bodyCurrentMa = (volts, ohms) => (volts / ohms) * 1000;

  function fmtTime(t) {
    if (!Number.isFinite(t)) return 'never';
    if (t <= INSTANT_S * 1.01) return 'instantly (about 10 ms)';
    if (t < 1) return `${Math.round(t * 1000)} ms`;
    if (t < 120) return `${t.toFixed(1)} s`;
    if (t <= CONVENTIONAL_S) return `${Math.round(t / 60)} min`;
    return 'not within an hour';
  }

  EB.protection = { breakerTime, fuseTime, rcdTime, evaluate, bodyBand, bodyCurrentMa, fmtTime, MAGNETIC, CONVENTIONAL_S, INSTANT_S };
})();
