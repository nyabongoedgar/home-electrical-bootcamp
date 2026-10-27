# Home Electrical Bootcamp

An interactive course on how a home's electrical system works, what protects people, and how to stay safe. It teaches **understanding and recognition**. It is **not** a wiring how-to and does not qualify anyone for electrical work. Static site, vanilla JS, no build step, works offline.

Sibling of [electronics-bootcamp](../electronics-bootcamp) and [electronics-troubleshooting](../electronics-troubleshooting). Plan: `../home-electrical-plan.md`.

## Status (Phase 1 of the plan, with Tracks 1 and 2 pulled forward)

| Piece | State |
|---|---|
| Track 5: Home safety and when to call a pro (5 lessons) | Playable |
| Track 1: How a house gets power (6 lessons) | Playable |
| Track 2: Protection (6 lessons) with an interactive protection lab | Playable |
| Tracks 3 (sizing on paper) and 4 (reading and diagnosing) | Outlined, not built. They need electrician-reviewed tables and scenarios. |
| Region profiles: 230 V/50 Hz and 120/240 V/60 Hz | Done, **unreviewed** |
| **Licensed-electrician review** | **Not done. This is the release gate.** |

> The content has not been reviewed by a licensed electrician (`reviewed: null` in every region profile) and the app says so on every page. Do not present it as authoritative, and do not publish it as a finished course, until that review has happened and been recorded.

## Run

```bash
npm start     # http://localhost:8082
npm test      # models, regions, every exercise in every region, safety lint
```

## What is in it

- **Region profiles** (`js/regions.js`): voltage, frequency, wire colours, RCD/GFCI trip level and timing, breaker ratings and curves, supply description. Lessons use `{{V}}`, `{{RCD}}`, `{{LIVE}}`… tokens, and exercises can override prompt, answer and scenario per region (`ex.region(r)`), so *3.8 times the RCD threshold* becomes *12 times the GFCI threshold* when the region changes.
- **Protection lab** (`js/protection.js`, `js/ui/lab.js`): a teaching model of breaker thermal/magnetic curves (B, C, D), fuses, RCD/GFCI trip thresholds and timing, plus the effect of current on the body. Drag the load and leakage and see what trips and when. Everything is labelled a teaching model.
- **Exercise types:** calculate (unit-aware, region-aware), choose, classify, hazard-spotting cards, and "what trips?" predictions decided by the model (not hand-written answers).
- **Every lesson ends** with a *what you can safely do / call a qualified electrician for* box.

## Safety design

| Risk | How it is handled |
|---|---|
| Learners attempt live work afterwards | No exercise asks for live-work steps. A **lint test** fails the build if lesson text contains instructions such as strip/splice/terminate/connect the live wire/open the consumer unit. The lint's own pattern is tested against bad and good examples so it cannot silently stop working. |
| Rules differ by country and change | All region-dependent values live in profiles with a `source` and a `reviewed` date (null until reviewed). Lessons say to check local rules. |
| Simplified models mislead | Models are labelled "teaching model", and the lab states that real devices vary within their standards. |
| Qualification claims | A banner on every page and a disclaimer lesson state the course does not qualify anyone. |

## Authoring

Add a lesson to a `js/lessons-*.js` file:

```js
{ id, title, time, blocks: [{ h }, { p }, { list }, { table }, { tip }, { warn }, { formula }, { diagram: 'rcd' }, { lab: true }],
  quiz: [{ q, options, answer, why }],
  exercises: [ /* calculate | choose | classify | hazard | trip */ ],
  boundary: { safe: [...], pro: [...] } }          // required: the test enforces it
```

`trip` exercises give a scenario in multiples of the region's breaker rating and RCD threshold (`{ loadMult: 2, leakMult: 5 }`); the model decides the right option.

## Self-check

`npm test` verifies:
1. The protection models: 1 h at 1.45× rating, no trip below 1.13×, monotonic curves, per-curve instant thresholds, fuse and RCD behaviour, and which device acts first.
2. Region profiles are complete, consistent, sourced, and honest about review status.
3. Every exercise in **every region**: tokens expand, calculate solutions pass while blank/wrong/10× answers fail, classify and hazard grading work, and trip scenarios resolve; all four outcomes are covered.
4. Every lesson has a safe/professional boundary note.
5. The safety lint and its own self-test, and the presence of the disclaimers.

## Before any public release

1. A licensed electrician in each supported region reviews all lessons and the models, and the `reviewed` dates are filled in.
2. Legal review of the disclaimers and terms.
3. Decide what is out of scope for each region, and keep the course to concepts, safety and paper exercises.
