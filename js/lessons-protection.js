// Track 2: Protection.
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});
  const q = (qq, options, answer, why) => ({ q: qq, options, answer, why });
  const choose = (id, title, prompt, options, answer, why, hint) => ({ id, type: 'choose', title, prompt, options, answer, why, hint });
  // trip: what happens? scenario in multiples of the region's rating and RCD threshold. The model decides the truth.
  const trip = (id, title, prompt, scenario, why, hint) => ({ id, type: 'trip', title, prompt, scenario, why, hint });
  const f1 = (n) => `${+n.toFixed(1)}`;

  const lessons = [
    {
      id: 'overload-short', title: 'Overload and short circuit', time: '15 min',
      blocks: [
        { h: 'Two ways a circuit draws too much' },
        { list: [
          '**Overload:** too many loads on one circuit. The current is above the cable’s safe rating but not enormous. It heats the cable slowly.',
          '**Short circuit:** live touches neutral (or earth) through almost no resistance. The current is huge and the cable heats in moments.',
        ] },
        { p: 'Both are dangerous because the cable’s insulation melts and can start a fire. A **fuse or {{BREAKER}}** is there to cut the supply before that happens. It protects the **cable**, not the appliance.' },
        { formula: 'short-circuit current ≈ V / (resistance of the fault path)' },
        { lab: true, caption: 'Protection lab. Try “1.5× overload” and “Short circuit”: watch the breaker curve. Overload is slow, short circuit is instant.' },
        { tip: 'The curve is a **time–current** chart: the further right (more current), the faster the breaker acts.' },
      ],
      quiz: [
        q('A short circuit differs from an overload because…', ['it is slower', 'the current is huge and rises at once', 'it only happens in old houses', 'it is harmless'], 1, 'A short is a near-zero resistance path.'),
        q('What does a fuse or breaker mainly protect?', ['The appliance', 'The cable and the building', 'The meter', 'The bill'], 1, 'Its rating is chosen to protect the cable from overheating.'),
        q('Which heats a cable faster?', ['A small overload', 'A short circuit', 'No load', 'They are the same'], 1, 'Heating goes with the square of the current.'),
      ],
      exercises: [
        {
          id: 'ol-overload', type: 'choose', title: 'Overload?', prompt: 'A circuit protected by a {{RATING}} A breaker has a 2 kW kettle and a 2 kW heater running together (4 kW in total). What is happening?',
          options: ['Normal operation', 'Overload', 'Short circuit'],
          region: (r) => ({ answer: 4000 / r.V > r.defaultRating ? 1 : 0, why: `4000 W on ${r.V} V is ${f1(4000 / r.V)} A, which is above ${r.defaultRating} A.` }),
          answer: 1, why: 'The total current is above the breaker rating.', hint: 'Work out I = P / V, then compare with the breaker rating.',
        },
        choose('ol-short', 'Short circuit?', 'A damaged heater cord lets the live wire touch the neutral directly. Which is it?', ['Normal operation', 'Overload', 'Short circuit'], 2, 'Live touching neutral with almost no resistance is a short circuit.', 'Is there an appliance in the path, or just wire to wire?'),
        trip('ol-trip', 'What trips?', 'A fault puts 30 times the breaker’s rating through the circuit. What happens?', { loadMult: 30 }, 'A short circuit is far above the instantaneous (magnetic) threshold.', 'Use the lab if you like: pick the “Short circuit” preset.'),
      ],
      boundary: {
        safe: ['Understand why breakers and fuses exist.', 'Reset a tripped breaker once after unplugging the likely cause.'],
        pro: ['Repeated tripping, or changing a breaker’s rating: the rating must match the cable, which needs a qualified person.'],
      },
    },
    {
      id: 'breakers', title: 'Fuses and breakers: how they trip', time: '20 min',
      blocks: [
        { h: 'Thermal and magnetic' },
        { p: 'A {{BREAKER}} has two mechanisms. A **thermal** element (a bimetal strip) heats slowly with an overload and bends until it trips: the more the overload, the faster. A **magnetic** element reacts to a very large current almost instantly: that is the short-circuit response.' },
        { p: 'Fuses melt a calibrated element: the greater the current, the quicker it melts.' },
        { lab: true, caption: 'Slide the load current and watch the operating point move on the breaker’s curve.' },
        { table: { head: ['Curve (IEC breakers)', 'Instant trip at about', 'Typical use'], rows: [['B', '3–5 × rating', 'Ordinary lighting and sockets'], ['C', '5–10 × rating', 'Equipment with moderate surge currents'], ['D', '10–20 × rating', 'Loads with large start-up surges, such as some motors']] } },
        { tip: 'Some loads draw a big surge when they start. A breaker with the wrong curve may trip when the load is fine, or fail to protect against a real fault.' },
      ],
      quiz: [
        q('What does the thermal part of a breaker respond to?', ['Sudden huge currents', 'Sustained overload', 'Voltage', 'Frequency'], 1, 'It heats up gradually with overload current.'),
        q('Which curve tolerates large start-up surges best?', ['B', 'C', 'D'], 2, 'D trips instantly only at 10–20 × rating.'),
        q('A breaker at 1.1× its rating will…', ['trip instantly', 'carry the current without tripping for a long time', 'explode', 'trip in a second'], 1, 'A small overload is tolerated for a long time: that is the “must not trip” region.'),
      ],
      exercises: [
        trip('br-normal', 'Normal load', 'The load is 0.8 times the breaker rating. What happens?', { loadMult: 0.8 }, 'Below rating nothing trips.', 'Is the current above the rating?'),
        trip('br-over', 'A 2× overload', 'The load is twice the breaker rating. What happens?', { loadMult: 2 }, 'Thermal trip: not instant, but within minutes.', 'Look at the curve at 2× on the lab.'),
        trip('br-small', 'A 1.1× overload', 'The load is 1.1 times the rating. What happens?', { loadMult: 1.1 }, 'Small overloads are tolerated for a long time.', 'The breaker is not meant to trip below about 1.13×.'),
        trip('br-short', 'A hard short', 'The load is 20 times the rating. What happens?', { loadMult: 20 }, 'Far above the instant threshold.', 'Which part of the curve is flat and fast?'),
        choose('br-curve', 'Choosing a curve', 'A motor circuit has large starting surges that keep tripping a B-curve breaker even though nothing is wrong. Which kind of breaker curve is designed for this?', ['A curve that trips at lower surges', 'A curve that tolerates larger surges, such as C or D', 'No breaker at all', 'A smaller rating'], 1, 'A higher-curve breaker allows brief surges but still trips on real faults. It must be selected by a qualified person to match the cable and the loop.', 'Which curve trips at higher multiples?'),
      ],
      boundary: {
        safe: ['Understand curves and why surges matter.', 'Use the simulator to explore.'],
        pro: ['Choosing or replacing breakers: it affects cable protection and fault clearing for the whole circuit.'],
      },
    },
    {
      id: 'earthing', title: 'Earthing: why exposed metal is connected', time: '15 min',
      blocks: [
        { h: 'The path that makes a fault trip the breaker' },
        { p: 'Imagine the live wire inside a toaster comes loose and touches the metal case. **Without** an earth connection the case becomes live and *waits for you to touch it*, and then current flows through your body.' },
        { p: '**With** an earth conductor connecting the case to earth, the fault current has an easy path back. That current is **large**, so the breaker trips fast and the case is dead within moments.' },
        { formula: 'fault current ≈ V / (resistance of the fault loop)' },
        { warn: 'An appliance works perfectly without its earth. You would never notice the protection is missing until the day a fault happens.' },
        { tip: 'Earthing and the breaker (or {{RCD}}) work together. Earth gives the fault a path, and the protective device uses it to cut the power.' },
      ],
      quiz: [
        q('A live wire touches the metal case of an earthed appliance. What happens?', ['The case stays live indefinitely', 'A large fault current flows to earth and the breaker trips', 'Nothing', 'The appliance stops but stays live'], 1, 'The earth path is low resistance, so the current is large and the breaker acts quickly.'),
        q('A live wire touches the case of an appliance with no earth. The case…', ['trips the breaker', 'becomes live and stays live', 'is harmless', 'cools down'], 1, 'There is no easy path for a large fault current, so nothing trips.'),
        q('Which statement is true?', ['Earthing is only needed outdoors', 'The earth conductor normally carries no current', 'Earth replaces the neutral', 'Earth makes appliances faster'], 1, 'It is a safety path that only carries current in a fault.'),
      ],
      exercises: [
        {
          id: 'ea-loop', type: 'calculate', title: 'Fault current', prompt: 'A fault loop has a resistance of 1 Ω. On this region’s supply voltage, what fault current flows? (I = V / R)',
          region: (r) => ({ answer: { value: r.V, unit: 'A' }, solution: `${r.V} A` }),
          answer: { value: 230, unit: 'A' }, solution: '230 A', hint: 'I = V / 1',
        },
        choose('ea-pin', 'The earth pin', 'Someone snaps off the earth pin of a metal-cased kettle’s plug “so it fits”. What have they done?', ['Nothing important: the kettle works', 'Removed the protective path, so a fault could leave the case live', 'Made it use less electricity', 'Made it safer'], 1, 'The kettle works, but a fault would leave the case live.', 'What is the earth pin for?'),
        choose('ea-class', 'Do all appliances need earth?', 'Some appliances have a plastic body, with insulation designed so that no earth is needed. What is the right conclusion?', ['Never use them', 'They protect people in a different way, by design (“double insulated”), so do not add or remove earth connections yourself', 'They are always unsafe', 'They must be earthed anyway'], 1, 'Double-insulated appliances are designed to be safe without earth, which is why they have a different plug or marking.', 'How else can a product keep your hands away from live parts?'),
      ],
      boundary: {
        safe: ['Keep the earth pin and use earthed plugs and leads as supplied.', 'Understand why you must not defeat protection.'],
        pro: ['Any work on earthing or bonding, or testing earth continuity or loop impedance.'],
      },
    },
    {
      id: 'rcd', title: '{{RCD}}: protection for people', time: '20 min',
      blocks: [
        { h: 'Spotting current that is going the wrong way' },
        { p: 'A {{RCDLONG}} compares the current going out on the live with the current coming back on the neutral. They should be equal. If some current leaks to earth, **for example through a person**, less comes back and the device trips.' },
        { diagram: 'rcd' },
        { p: 'In this region the trip level is {{RCDMA}} mA. That is far smaller than a breaker would ever notice, which is why a breaker alone does not protect people.' },
        { lab: true, caption: 'Move the leakage slider or choose “Person touches live”. Compare with the breaker, which does not react at all.' },
        { list: [
          'It trips on leakage, **not** on overload: it does not replace the breaker.',
          'Test it with its own **test button** as the maker recommends (often every few months).',
          'It reduces the risk but does not remove it: it takes a moment to act, and it only works if the current really leaks to earth.',
        ] },
      ],
      quiz: [
        q('What does a {{RCD}} compare?', ['Voltage and frequency', 'Current out on the live with current back on the neutral', 'Power and energy', 'Earth and the supply'], 1, 'A difference means current is leaking to somewhere else.'),
        q('Why does a breaker alone not protect people from shock?', ['It is too slow to matter', 'It only reacts to current far above what is dangerous for a person', 'It cannot detect current', 'It protects only appliances'], 1, 'A person can be harmed at currents far below a breaker’s trip level.'),
        q('How should you check your {{RCD}} works?', ['Hope for the best', 'Press its test button as the maker recommends', 'Short a wire across it', 'Open it up'], 1, 'The test button creates a small controlled imbalance to prove it trips.'),
      ],
      exercises: [
        trip('rcd-person', 'Person touches live', 'A person touches a live part. A current well above the {{RCD}}’s trip level flows through them to earth, but the circuit’s load is small. What happens?', { loadMult: 0.3, leakMult: 5 }, 'The leakage is far above the trip threshold, so the {{RCD}} trips. The breaker would not.', 'Which device reacts to leakage?'),
        trip('rcd-small', 'A tiny leakage', 'An appliance leaks about 40% of the {{RCD}}’s trip threshold. What happens?', { loadMult: 0.3, leakMult: 0.4 }, 'Below the threshold nothing trips. Some leakage is normal in appliances.', 'Is it above or below the trip level?'),
        trip('rcd-both', 'Normal load and a leak', 'A circuit carries a normal load (0.5× the breaker rating) and some current leaks at 3 × the {{RCD}} threshold. What trips?', { loadMult: 0.5, leakMult: 3 }, 'Only the {{RCD}} sees the leak.', 'Is the load above the rating?'),
        {
          id: 'rcd-ratio', type: 'calculate', title: 'Body current vs trip level', prompt: 'A person with wet skin (2 kΩ) touches a live part on this region’s supply. How many times larger is the current than the {{RCD}}’s trip threshold? (I = V / R, then divide by the threshold.)',
          region: (r) => ({ answer: { value: r.V / 2 / r.rcdMa, unit: null, tol: 0.03 }, solution: f1(r.V / 2 / r.rcdMa) }),
          answer: { value: 3.83, unit: null, tol: 0.03 }, solution: '3.8', hint: 'The current in mA is V / 2000 × 1000.',
        },
      ],
      boundary: {
        safe: ['Use the test button as the maker recommends.', 'Plug sensitive outdoor equipment into protected sockets.'],
        pro: ['Fitting, replacing or investigating {{RCD}}s, and finding the cause of repeated trips in fixed wiring.'],
      },
    },
    {
      id: 'which', title: 'Which device protects against what?', time: '15 min',
      blocks: [
        { h: 'Putting it together' },
        { table: { head: ['Hazard', 'Device', 'What it does'], rows: [
          ['Overload or short circuit', 'Fuse or {{BREAKER}}', 'Cuts off before the cable overheats'],
          ['Current leaking through a person or to earth', '{{RCD}}', 'Cuts off in a fraction of a second'],
          ['Metal parts becoming live', 'Earthing (protective conductor)', 'Gives faults an easy path so protective devices trip'],
          ['Arc faults (damaged cable sparking)', 'Arc-fault device (where required)', 'Detects dangerous arcing patterns'],
          ['Voltage spikes (such as lightning)', 'Surge protective device', 'Limits the voltage reaching equipment'],
        ] } },
        { tip: 'The devices overlap: they are layers of protection, and none of them replaces the others.' },
      ],
      quiz: [
        q('Which device is aimed at protecting people from leakage current?', ['{{BREAKER}}', '{{RCD}}', 'Meter', 'Light switch'], 1, 'It detects an imbalance, which is how leakage shows up.'),
        q('Why use several protective devices instead of one?', ['It is a legal formality', 'Each one catches hazards the others miss', 'To use up space', 'To reduce the bill'], 1, 'They are layers: overload, leakage, faults and surges are different problems.'),
        q('Surge protective devices guard against…', ['overload of the cable', 'voltage spikes', 'people touching live parts', 'a loose neutral'], 1, 'They limit the transient voltage reaching equipment.'),
      ],
      exercises: [
        {
          id: 'wh-match', type: 'classify', title: 'Match the protection', prompt: 'For each hazard, choose the protection mainly aimed at it.',
          options: ['Fuse or {{BREAKER}}', '{{RCD}}', 'Earthing', 'Surge protective device'],
          items: [
            { text: 'A heater, kettle and toaster together draw too much current for the cable.', answer: 0 },
            { text: 'Someone touches a live wire and current flows through them to earth.', answer: 1 },
            { text: 'A fault makes the metal case of an appliance live.', answer: 2 },
            { text: 'A lightning strike sends a voltage spike down the supply.', answer: 3 },
            { text: 'A heater cord short-circuits live to neutral.', answer: 0 },
          ],
          hint: 'Overload and short: breaker. Leakage: {{RCD}}. Live metal: earth gives the path. Spikes: surge device.',
        },
      ],
      boundary: {
        safe: ['Know what each layer of protection is for.', 'Check that you have a {{RCD}} and test it as recommended.'],
        pro: ['Choosing, fitting or changing any protective device.'],
      },
    },
    {
      id: 'lab-project', title: 'Project: the protection lab', time: '25 min',
      blocks: [
        { h: 'Predict, then test' },
        { p: 'Use the lab to build your own scenarios, then answer the prediction exercises below. The lab is a **teaching model** of how protective devices behave. It is not a design tool.' },
        { lab: true, caption: 'Free play: change the load, the leakage and the breaker rating.' },
        { warn: 'Never test protective devices by creating real faults. Use the test buttons the makers fit, and the simulator for everything else.' },
      ],
      quiz: [
        q('In the lab, what do you change to simulate a person touching a live part?', ['The load', 'The leakage to earth', 'The curve', 'The frequency'], 1, 'A person adds a leakage path to earth.'),
        q('A load slightly above the breaker rating and no leakage. What do you expect?', ['Instant trip', 'No trip for a long time', 'The {{RCD}} trips', 'Nothing is drawn'], 1, 'Small overloads are tolerated for a long time.'),
        q('Which device does not react to a person’s leakage if the load is normal?', ['{{RCD}}', '{{BREAKER}}', 'Both', 'Neither'], 1, 'Only the {{RCD}} responds to small leakage.'),
      ],
      exercises: [
        trip('lp-1', 'Two heaters on one circuit', 'The circuit load is 1.3 times the breaker rating, with no leakage. What happens in the next few minutes?', { loadMult: 1.3 }, 'Small overloads can run for an hour or more: the cable warms but nothing trips yet.', 'Check the curve at 1.3×.'),
        trip('lp-2', 'Hairdryer in the bath', 'A hairdryer drops in a bath. The load is normal, but leakage to earth is 10 times the {{RCD}}’s threshold. What trips?', { loadMult: 0.4, leakMult: 10 }, 'The {{RCD}} responds to leakage within a fraction of a second, the breaker does not notice.', 'Which device sees leakage?'),
        trip('lp-3', 'Hard short', 'A plug is crushed and live touches neutral. The current is 25 times the breaker rating. What happens?', { loadMult: 25 }, 'Instant breaker trip.', 'The flat, fast part of the curve.'),
        trip('lp-4', 'Everyday leakage', 'A washing machine leaks at 20% of the {{RCD}} threshold, with a normal load. What happens?', { loadMult: 0.5, leakMult: 0.2 }, 'Normal leakage is below the threshold, so nothing trips.', 'Below the trip level means no action.'),
        trip('lp-5', 'Short plus person', 'A fault pulls 40 times the breaker rating and also leaks at 5 times the {{RCD}} threshold. What acts first?', { loadMult: 40, leakMult: 5 }, 'Both would act. For this model the breaker’s instant trip is the fastest.', 'Compare the speeds in the lab output.'),
      ],
      boundary: {
        safe: ['Explore protection with the simulator.', 'Explain to someone else what each device does.'],
        pro: ['Anything involving real faults or real wiring.'],
      },
    },
  ];
  EB.lessons = EB.lessons || {};
  EB.lessons.protection = lessons;
})();
