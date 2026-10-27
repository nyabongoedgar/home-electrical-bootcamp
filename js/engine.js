// Answer checking and exercise helpers.
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});
  const { parse } = EB.units;

  // ans: { value (base units), unit (null = plain number), tol, bare (multiplier for unit-less input), abs }
  function checkAnswer(ans, input) {
    const p = parse(input);
    if (!p) return { pass: false, msg: 'I couldn’t read that. Type a number and a unit, like 8.7 A or 3.2 kWh.' };
    let val = ans.abs ? Math.abs(p.value) : p.value;
    if (ans.unit == null) { if (p.unit !== null) return { pass: false, msg: 'This one is a plain number, with no unit.' }; }
    else if (p.unit === null) val *= ans.bare || 1;
    else if (p.unit !== ans.unit) return { pass: false, msg: `That is a value in ${p.unit}, but the question asks for ${ans.unit}.` };
    const tol = ans.tol == null ? 0.02 : ans.tol;
    return Math.abs(val - ans.value) <= tol * Math.abs(ans.value) ? { pass: true } : { pass: false, msg: 'Not quite. Check your arithmetic and prefixes (m, k, M).' };
  }

  // Exercise adjusted for a region: ex.region(r) may override prompt/answer/options/scenario for that region.
  function forRegion(ex, r) {
    return ex.region ? { ...ex, ...ex.region(r) } : ex;
  }

  // Hazard cards: all unsafe cards selected and no safe ones.
  function gradeHazard(items, picked) {
    const missed = items.filter((c) => c.hazard && !picked.has(c.id));
    const wrong = items.filter((c) => !c.hazard && picked.has(c.id));
    return { pass: !missed.length && !wrong.length, missed, wrong };
  }
  // Classify: array of chosen option indexes aligned with items
  function gradeClassify(items, choices) {
    const bad = items.filter((it, i) => choices[i] !== it.answer);
    return { pass: bad.length === 0, bad };
  }

  // What a protection scenario does, for this region. scenario: { loadMult, leakMult, loadA?, leakMa? }
  function runScenario(sc, r) {
    const rating = r.defaultRating;
    return EB.protection.evaluate({
      rating, curve: r.defaultCurve, rcdMa: r.rcdMa, rcdTimes: r.rcdTimes,
      loadA: sc.loadA != null ? sc.loadA : (sc.loadMult || 0) * rating,
      leakMa: sc.leakMa != null ? sc.leakMa : (sc.leakMult || 0) * r.rcdMa,
    });
  }
  const TRIP_OPTIONS = ['Nothing trips', 'The breaker trips after seconds to minutes', 'The breaker trips instantly', 'The residual-current device trips'];
  const TRIP_INDEX = { none: 0, slow: 1, instant: 2, rcd: 3 };

  EB.engine = { checkAnswer, forRegion, gradeHazard, gradeClassify, runScenario, TRIP_OPTIONS, TRIP_INDEX };
})();
