// npm test -> protection models, region profiles, every exercise in every region, and the safety lint.
const path = require('path');
const root = path.join(__dirname, '..');
['js/units.js', 'js/regions.js', 'js/protection.js', 'js/engine.js', 'js/diagrams.js', 'js/lessons-safety.js', 'js/lessons-power.js', 'js/lessons-protection.js', 'js/content.js'].forEach((f) => require(path.join(root, f)));
const EB = globalThis.EB;
const P = EB.protection;
const E = EB.engine;

let passed = 0;
const failures = [];
const check = (name, fn) => { try { fn(); passed++; } catch (e) { failures.push(`${name}\n      ${e.message}`); } };
const must = (c, m) => { if (!c) throw new Error(m); };
const near = (a, b, tol, w = '') => must(Math.abs(a - b) <= tol * Math.max(Math.abs(b), 1e-12), `${w} expected ${b}, got ${a}`);

// ---------------------------------------------------------------- protection models
check('breaker: conventional trip is 1 hour at 1.45× rating', () => near(P.breakerTime(16, 'B', 16 * 1.45), 3600, 1e-6));
check('breaker: never trips below 1.13× rating', () => { must(P.breakerTime(16, 'B', 16 * 1.1) === Infinity, 'trips at 1.1×'); must(P.breakerTime(16, 'B', 16 * 1.12) === Infinity, 'trips at 1.12×'); });
check('breaker: time falls monotonically as current rises', () => {
  let prev = Infinity;
  for (let m = 1.2; m < 3.9; m += 0.1) { const t = P.breakerTime(16, 'B', 16 * m); must(t <= prev, `not monotonic at ${m}`); prev = t; }
});
check('breaker: instant above the magnetic threshold, per curve (B 4×, C 7.5×, D 15×)', () => {
  must(P.breakerTime(16, 'B', 16 * 4.5) === P.INSTANT_S, 'B'); must(P.breakerTime(16, 'C', 16 * 4.5) > P.INSTANT_S, 'C not instant at 4.5×');
  must(P.breakerTime(16, 'C', 16 * 8) === P.INSTANT_S, 'C'); must(P.breakerTime(16, 'D', 16 * 8) > P.INSTANT_S, 'D not instant at 8×'); must(P.breakerTime(16, 'D', 16 * 16) === P.INSTANT_S, 'D');
});
check('fuse: holds below 1.6×, 1 hour at 1.6×, faster above', () => {
  must(P.fuseTime(13, 13 * 1.5) === Infinity, 'trips at 1.5×'); near(P.fuseTime(13, 13 * 1.6), 3600, 1e-6);
  must(P.fuseTime(13, 13 * 5) < P.fuseTime(13, 13 * 2), 'faster at higher current');
});
check('rcd: no trip below its rating, trip at/above it, faster when larger', () => {
  must(P.rcdTime(30, 29) === Infinity, 'trips below'); must(P.rcdTime(30, 30) === 0.3, 'IΔn'); must(P.rcdTime(30, 60) === 0.15, '2×'); must(P.rcdTime(30, 150) === 0.04, '5×');
});
check('evaluate: overload, short, leakage, and nothing', () => {
  const base = { rating: 16, curve: 'B', rcdMa: 30 };
  must(P.evaluate({ ...base, loadA: 10, leakMa: 0 }).category === 'none', 'none');
  must(P.evaluate({ ...base, loadA: 32, leakMa: 0 }).category === 'slow', 'slow');
  must(P.evaluate({ ...base, loadA: 500, leakMa: 0 }).category === 'instant', 'instant');
  must(P.evaluate({ ...base, loadA: 5, leakMa: 100 }).category === 'rcd', 'rcd');
  must(P.evaluate({ ...base, loadA: 500, leakMa: 100 }).first === 'mcb', 'short beats rcd for speed');
});
check('body bands and fmtTime', () => {
  must(/not felt/.test(P.bodyBand(0.5)) && /let go/.test(P.bodyBand(5)) && /cannot let go/.test(P.bodyBand(20)) && /fibrillation/.test(P.bodyBand(60)), 'bands');
  near(P.bodyCurrentMa(230, 2000), 115, 1e-9);
  must(P.fmtTime(Infinity) === 'never' && /instantly/.test(P.fmtTime(0.01)) && P.fmtTime(0.3) === '300 ms', 'fmt');
});

// ---------------------------------------------------------------- units
check('units: kWh and plain numbers parse', () => {
  must(EB.units.parse('6 kWh').value === 6000 && EB.units.parse('6 kWh').unit === 'Wh', 'kWh');
  must(EB.units.parse('1.5').unit === null, 'plain');
  must(E.checkAnswer({ value: 6000, unit: 'Wh', bare: 1000 }, '6').pass && E.checkAnswer({ value: 6000, unit: 'Wh', bare: 1000 }, '6000 Wh').pass, 'kWh answers');
  must(!E.checkAnswer({ value: 1.5, unit: null }, '1.5 A').pass, 'plain answers reject units');
});

// ---------------------------------------------------------------- regions
const regions = Object.values(EB.regions.all);
check('regions: complete profiles, consistent values, honest review status', () => {
  must(regions.length >= 2, 'need at least two profiles');
  for (const r of regions) {
    for (const k of ['id', 'name', 'long', 'V', 'Hz', 'supply', 'live', 'neutral', 'earth', 'rcd', 'rcdLong', 'rcdMa', 'rcdTimes', 'breaker', 'panel', 'ratings', 'curves', 'defaultCurve', 'defaultRating', 'source']) must(r[k] !== undefined, `${r.id} missing ${k}`);
    must(r.ratings.includes(r.defaultRating) && r.curves.includes(r.defaultCurve), `${r.id} defaults not in lists`);
    must(r.reviewed === null || /^\d{4}-\d{2}-\d{2}$/.test(r.reviewed), `${r.id} reviewed must be null or an ISO date`);
    must(r.source.length > 10, `${r.id} needs a source`);
  }
});
check('regions: tokens expand with no leftovers', () => {
  for (const r of regions) must(!/\{\{/.test(EB.regions.expand('{{V}} {{HZ}} {{LIVE}} {{NEUTRAL}} {{EARTH}} {{RCD}} {{RCDLONG}} {{RCDMA}} {{BREAKER}} {{PANEL}} {{RATING}} {{EMERGENCY}} {{SUPPLY}}', r)), 'leftover');
});

// ---------------------------------------------------------------- course structure
const tracks = EB.TRACKS;
const ready = tracks.filter((t) => t.status === 'ready');
check('course: 5 tracks, ready ones have lessons, planned ones have outlines', () => {
  must(tracks.length === 5, 'tracks');
  for (const t of tracks) must(t.status === 'ready' ? t.lessons.length >= 5 : t.outline.length >= 5 && t.phase && t.needs, `${t.id} incomplete`);
  must(ready.map((t) => t.id).sort().join() === 'power,protection,safety', 'ready set');
});

const lessons = ready.flatMap((t) => t.lessons.map((l) => ({ t, l })));
const seen = new Set();
check('course: every lesson has blocks, ≥3 quiz questions, exercises and a boundary note', () => {
  for (const { l } of lessons) {
    must(!seen.has(l.id), 'dup lesson ' + l.id); seen.add(l.id);
    must(l.blocks.length >= 3 && l.quiz.length >= 3 && l.exercises.length >= 1, `${l.id}: too thin`);
    must(l.boundary && l.boundary.safe.length >= 1 && l.boundary.pro.length >= 1, `${l.id}: needs a "safe / call a professional" note`);
    l.quiz.forEach((q, i) => must(q.options.length >= 2 && q.answer >= 0 && q.answer < q.options.length && q.why, `${l.id} q${i + 1} malformed`));
  }
});

// ---------------------------------------------------------------- every exercise, in every region
const ids = new Set();
let exCount = 0;
for (const { l } of lessons) {
  for (const raw of l.exercises) {
    exCount++;
    check(`exercise ${raw.id}: unique id, title, prompt`, () => { must(!ids.has(raw.id), 'dup id'); ids.add(raw.id); must(raw.title && raw.prompt && raw.type, 'fields'); });
    for (const r of regions) {
      const ex = E.forRegion(raw, r);
      const tag = `exercise ${raw.id} [${r.id}]`;
      const text = [ex.title, ex.prompt, ex.hint, ex.why, ...(ex.options || []), ...(ex.items || []).map((i) => i.text + (i.why || ''))].filter(Boolean).map((s) => EB.regions.expand(s, r)).join(' ');
      check(`${tag}: no unexpanded tokens`, () => must(!/\{\{/.test(text), 'leftover token'));
      if (ex.type === 'calculate') {
        check(`${tag}: reference answer passes; blank, wrong and wrong-unit answers fail`, () => {
          must(ex.solution, 'needs a solution string');
          const ok = E.checkAnswer(ex.answer, ex.solution); must(ok.pass, `solution "${ex.solution}" rejected: ${ok.msg}`);
          must(!E.checkAnswer(ex.answer, '').pass, 'blank accepted');
          must(!E.checkAnswer(ex.answer, ex.answer.unit == null ? String(ex.answer.value * 10) : `${ex.answer.value * 10} ${ex.answer.unit}`).pass, '10x accepted');
          must(!E.checkAnswer(ex.answer, '7 banana').pass, 'garbage accepted');
        });
      } else if (ex.type === 'choose') {
        check(`${tag}: options and answer valid`, () => must(ex.options.length >= 3 && Number.isInteger(ex.answer) && ex.answer >= 0 && ex.answer < ex.options.length && ex.why, 'malformed'));
      } else if (ex.type === 'classify') {
        check(`${tag}: every item has a valid answer, and not all the same`, () => {
          must(ex.items.length >= 3 && ex.items.every((i) => i.answer >= 0 && i.answer < ex.options.length), 'malformed');
          must(new Set(ex.items.map((i) => i.answer)).size >= 2, 'all items share one answer');
          must(E.gradeClassify(ex.items, ex.items.map((i) => i.answer)).pass && !E.gradeClassify(ex.items, ex.items.map((i) => (i.answer + 1) % ex.options.length)).pass, 'grading');
        });
      } else if (ex.type === 'hazard') {
        check(`${tag}: has both hazards and safe cards; grading works`, () => {
          must(ex.items.some((i) => i.hazard) && ex.items.some((i) => !i.hazard), 'needs both');
          must(ex.items.every((i) => i.why), 'every card explains why');
          must(E.gradeHazard(ex.items, new Set(ex.items.filter((i) => i.hazard).map((i) => i.id))).pass, 'right set fails');
          must(!E.gradeHazard(ex.items, new Set(ex.items.map((i) => i.id))).pass && !E.gradeHazard(ex.items, new Set()).pass, 'wrong sets pass');
        });
      } else if (ex.type === 'trip') {
        check(`${tag}: the model decides a sensible answer`, () => {
          const ev = E.runScenario(ex.scenario, r);
          must(ev.category in E.TRIP_INDEX, 'category ' + ev.category);
        });
      } else throw new Error('unknown exercise type ' + ex.type);
    }
  }
}
check('course: trip exercises cover every outcome', () => {
  const seenCat = new Set();
  for (const { l } of lessons) for (const ex of l.exercises) if (ex.type === 'trip') for (const r of regions) seenCat.add(E.runScenario(ex.scenario, r).category);
  for (const c of ['none', 'slow', 'instant', 'rcd']) must(seenCat.has(c), 'no scenario ends in: ' + c);
});
check('course: region-dependent answers actually differ between regions where they should', () => {
  const ex = lessons.flatMap(({ l }) => l.exercises).find((e) => e.id === 'bl-amps');
  const a = E.forRegion(ex, EB.regions.all['iec-230']).answer.value, b = E.forRegion(ex, EB.regions.all['na-120']).answer.value;
  must(Math.abs(a - b) > 3, 'bl-amps should differ by region');
});

// ---------------------------------------------------------------- safety lint
// This course teaches understanding and safety. No lesson may tell the learner to perform live work.
const PANEL = '(consumer unit|breaker panel|panel|board|meter|\\{\\{PANEL\\}\\})';
const LIVE_PHRASES = new RegExp('\\b(connect the (live|neutral|earth|wire|cable|conductor)|disconnect the (live|neutral|earth|wire|cable|conductor)|remove the cover|open the ' + PANEL + '|work on live|wire up|rewire the)', 'i');
const LIVE_VERBS = /(^|[.!?:;,]\s+|\b(first|then|next|now)\s+)(strip|splice|terminate|loosen|tighten|bypass)\b/i;
const LIVE_WORK = { test: (s) => LIVE_PHRASES.test(s) || LIVE_VERBS.test(s) };
const strings = [];
const collect = (id, v) => { if (typeof v === 'string') strings.push([id, v]); else if (Array.isArray(v)) v.forEach((x) => collect(id, x)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => collect(id, x)); };
for (const { l } of lessons) {
  collect(l.id + ' blocks', l.blocks); collect(l.id + ' quiz', l.quiz); collect(l.id + ' boundary', l.boundary);
  l.exercises.forEach((e) => collect(l.id + '/' + e.id, { title: e.title, prompt: e.prompt, hint: e.hint, why: e.why, options: e.options, items: e.items }));
}
check('safety lint: no lesson text contains live-work instructions', () => {
  const hits = strings.filter(([, s]) => LIVE_WORK.test(s));
  must(hits.length === 0, hits.map(([id, s]) => `${id}: "${s.slice(0, 80)}"`).join('; '));
});
check('safety lint: the pattern itself catches live-work instructions (so the lint cannot silently pass)', () => {
  for (const bad of ['Strip the insulation from the live wire.', 'First, connect the live wire to the terminal.', 'Then loosen the screw. Remove the cover and tighten it.', 'Open the consumer unit and bypass the breaker.']) must(LIVE_WORK.test(bad), 'missed: ' + bad);
  for (const ok of ['Unplug the appliance.', 'Switch off at the main switch.', 'Live and neutral form a loop.']) must(!LIVE_WORK.test(ok), 'false alarm: ' + ok);
});
check('safety lint: disclaimers are present', () => {
  const html = require('fs').readFileSync(path.join(root, 'js/app.js'), 'utf8');
  must(/does not qualify you for electrical work/.test(html) && /not yet been reviewed/.test(html), 'banner text');
  must(lessons.some(({ l }) => l.blocks.some((b) => b.warn && /does not make you qualified/.test(b.warn))), 'qualification disclaimer lesson');
});

console.log(`\n${passed} checks passed, ${failures.length} failed  (${ready.length} tracks, ${lessons.length} lessons, ${exCount} exercises × ${regions.length} regions)`);
if (failures.length) { console.log('\nFAILURES:\n  - ' + failures.join('\n  - ')); process.exit(1); }
