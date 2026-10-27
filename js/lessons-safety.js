// Track 5: Home safety and when to call a professional.
// This course teaches understanding and recognition. It contains no instructions for live work.
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});
  const q = (qq, options, answer, why) => ({ q: qq, options, answer, why });
  const choose = (id, title, prompt, options, answer, why, hint) => ({ id, type: 'choose', title, prompt, options, answer, why, hint });
  const SAFE_OR_PRO = ['Reasonable for a householder', 'Needs a qualified electrician'];

  const lessons = [
    {
      id: 'hazards', title: 'Hazards around the home', time: '15 min',
      blocks: [
        { h: 'Two ways electricity hurts' },
        { p: '**Shock:** current passes through your body. It does not take much, as lesson 6 of Track 1 shows.' },
        { p: '**Fire:** too much current heats cables, plugs and appliances, or a loose connection arcs and overheats. Fires usually start where the electricity is *used*: leads, adaptors, plugs and appliances.' },
        { h: 'The usual suspects' },
        { list: [
          '**Water and electricity.** Wet skin conducts far better than dry skin, so the same voltage can push far more current.',
          '**Damaged flex or plugs.** Cuts, kinks, crushed cables and bare conductors.',
          '**Overloaded sockets and adaptors.** More current than the lead or socket is built for, so they heat up.',
          '**Heat.** Heaters and cables covered by blankets or coiled tightly cannot shed their heat.',
          '**DIY work on fixed wiring.** Mistakes can stay hidden in a wall for years.',
          '**Removed protection.** A snapped-off earth pin, or a bypassed breaker or {{RCD}}.',
        ] },
        { warn: 'Never touch a person or an appliance that you suspect is live. Switch off the power first, or call for help.' },
      ],
      quiz: [
        q('Why is water such a hazard around electricity?', ['It makes electricity stronger', 'Wet skin conducts much better, so more current flows through you', 'It stops breakers working', 'It only matters outdoors'], 1, 'Wet skin has a far lower resistance, so the same voltage drives far more current through the body.'),
        q('Which is most likely to start an electrical fire?', ['A switched-off lamp', 'An overloaded, hot adaptor or a damaged lead', 'A fully charged phone', 'A light bulb that works normally'], 1, 'Heat from overload or a poor connection is the usual cause.'),
        q('Why is removing an appliance plug’s earth pin dangerous?', ['It makes the appliance slower', 'It removes the protective path that makes a fault trip the breaker', 'It saves electricity', 'It is harmless because the appliance still works'], 1, 'The earth connection is there for the day something goes wrong; the appliance works without it, so you would not notice.'),
      ],
      exercises: [
        {
          id: 'hz-kitchen', type: 'hazard', title: 'Spot the hazards',
          prompt: 'Select every situation that is unsafe. Leave the safe ones unselected.',
          items: [
            { id: 'a', text: 'A kettle’s flex trails over the edge of a full sink.', hazard: true, why: 'Flex can fall in or get wet, and a pull can damage it.' },
            { id: 'b', text: 'A toaster sits on a dry counter, plugged in and switched off.', hazard: false, why: 'Normal and safe.' },
            { id: 'c', text: 'A hairdryer is plugged in and balanced on the edge of a filled bath.', hazard: true, why: 'If it falls in, the water becomes live. Never use mains appliances near a bath.' },
            { id: 'd', text: 'A fridge is plugged straight into a wall socket.', hazard: false, why: 'A direct connection is the best arrangement for a high-use appliance.' },
            { id: 'e', text: 'A power adaptor is plugged into another adaptor, running a heater, a kettle and a microwave.', hazard: true, why: 'Daisy-chained adaptors with big loads overload the socket and overheat.' },
            { id: 'f', text: 'A lead has a cut in its outer sheath and the copper shows.', hazard: true, why: 'Exposed conductors can shock and arc. Stop using it.' },
            { id: 'g', text: 'A light fitting has had its bulb changed after the light was switched off.', hazard: false, why: 'Switching off first is the sensible way to do this.' },
            { id: 'h', text: 'A cable reel stays tightly coiled while it runs a 2 kW heater.', hazard: true, why: 'A coiled cable cannot shed heat and can overheat. Unwind it fully.' },
            { id: 'i', text: 'A plug is yanked out of a socket by pulling on the cable.', hazard: true, why: 'This damages the cable and connections. Pull on the plug body.' },
          ],
          hint: 'Ask: could this let a person touch something live, or could it overheat?',
        },
        choose('hz-water', 'Water on an appliance', 'Water has splashed onto a plugged-in appliance. What is the safest first action?',
          ['Pull the plug out right away with wet hands', 'Switch off at the {{PANEL}} (if it is dry and safe to reach) before touching anything', 'Wipe it with a wet cloth', 'Keep using it: it will dry out'], 1,
          'Removing the power first means that you are not part of the circuit while you deal with it.', 'Who or what is making things live, and how can it be stopped without touching it?'),
      ],
      boundary: {
        safe: ['Look for damaged leads, hot plugs and scorch marks, and stop using anything suspicious.', 'Unplug appliances properly, by the plug.', 'Keep water away from electrics.'],
        pro: ['Anything inside a wall, ceiling, {{PANEL}} or fixed wiring.', 'Any repair after you have seen scorching, sparks or a burning smell.'],
      },
    },
    {
      id: 'overloads', title: 'Extension leads, adaptors and overload', time: '15 min',
      blocks: [
        { h: 'Adding loads adds current' },
        { p: 'Every appliance draws a current `I = P / V`. When several share a lead or a socket, their currents **add**. Leads and sockets have a **rated current** printed on them. Go above it and the lead heats up.' },
        { formula: 'I = P / V' },
        { p: 'On this region’s {{V}} V supply, a 2000 W kettle draws about 2000 / {{V}} amps. Add a 1000 W heater on the same lead and you must add their currents.' },
        { tip: 'Heating appliances (kettles, heaters, toasters, hairdryers) are the heavy loads. Phone chargers and lamps are tiny by comparison.' },
        { list: [
          'Plug high-power appliances directly into a wall socket where possible.',
          'Do not chain adaptors or extension leads together.',
          'Fully unwind a cable reel before use.',
          'If a lead, adaptor or plug feels warm, unplug it and stop using it.',
        ] },
      ],
      quiz: [
        q('Several appliances share one lead. The lead’s current is…', ['the largest one', 'the sum of all of them', 'the average', 'zero'], 1, 'Parallel loads draw current from the same supply, so their currents add.'),
        q('Which appliance is the biggest overload risk on a lead?', ['A phone charger', 'A table lamp', 'A 2 kW heater', 'A radio'], 2, 'Heating appliances draw far more power than electronics.'),
        q('A plug on a lead feels warm to touch during use. What should you do?', ['Ignore it', 'Unplug it and stop using it until it is checked', 'Pour water on it', 'Cover it'], 1, 'Warmth means wasted power as heat, from overload or a poor connection.'),
      ],
      exercises: [
        {
          id: 'ov-current', type: 'calculate', title: 'Total current',
          prompt: 'A 2 kW heater and a 1 kW kettle run from the same lead on this region’s supply. What total current do they draw?',
          region: (r) => ({ answer: { value: 3000 / r.V, unit: 'A', tol: 0.02 }, solution: `${(3000 / r.V).toFixed(2)} A` }),
          answer: { value: 13.04, unit: 'A' }, solution: '13.04 A', hint: 'Add the powers, then divide by the voltage: I = P / V.',
        },
        {
          id: 'ov-rated', type: 'calculate', title: 'Rated current',
          prompt: 'A lead is rated for 10 A. How many watts can it carry at most on a 230 V supply? (Use 230 V for this exercise.)',
          answer: { value: 2300, unit: 'W' }, solution: '2300 W', hint: 'P = V × I.',
        },
        choose('ov-best', 'Safest set-up', 'You need to run a 3 kW heater. Which is the safest way?',
          ['Plug it into an adaptor on an adaptor', 'Plug it directly into a wall socket', 'Use a long, thin, tightly coiled extension reel', 'Plug it into a multi-socket strip with other appliances'], 1,
          'A direct connection avoids extra joints and cables that can overload.', 'Fewer connections and shorter cables mean less to go wrong.'),
      ],
      boundary: {
        safe: ['Add up the powers on a lead and keep under its rating.', 'Unplug and replace damaged leads and adaptors with correctly rated ones.'],
        pro: ['If a socket keeps overloading, you probably need more sockets or circuits: that is a job for an electrician.'],
      },
    },
    {
      id: 'damage', title: 'Damaged cables, appliances and water', time: '15 min',
      blocks: [
        { h: 'Decide quickly, and safely' },
        { p: 'Knowing when to *stop* is the most useful skill. Most of these decisions are simple: if something is damaged, hot, wet, sparking or tingling, it stops being used.' },
        { table: { head: ['What you notice', 'What it can mean', 'What to do'], rows: [
          ['Cut or crushed cable', 'Exposed conductors', 'Stop using it. Replace the lead or appliance.'],
          ['Hot plug or socket', 'Overload or a loose connection', 'Unplug, stop using it, have it checked.'],
          ['Tingle when you touch an appliance', 'A fault is making the metal live', 'Stop, unplug it or switch off at the {{PANEL}}, and do not use it again until repaired.'],
          ['Sparks, burning smell or scorch marks', 'Arcing or overheating', 'Switch off at the {{PANEL}} if safe to reach, stay clear, and call an electrician.'],
          ['A {{RCD}} that trips repeatedly', 'Real leakage to earth', 'Find the appliance by unplugging them, and get a professional if the cause is not obvious.'],
        ] } },
        { warn: 'Do not “just tape it up”. Tape is not a safe repair for mains cable.' },
      ],
      quiz: [
        q('You feel a tingle when touching a metal appliance. What does it suggest?', ['The appliance is working hard', 'A fault is making the metal live', 'The appliance is clean', 'Nothing to worry about'], 1, 'A tingle means current is reaching you. Stop using it and isolate it.'),
        q('A {{RCD}} trips every time one appliance is plugged in. The most likely cause is…', ['A fault on that appliance', 'The {{RCD}} is too strong', 'Too many lights', 'Nothing in particular'], 0, 'The device is doing its job: it detects leakage from the faulty appliance.'),
        q('Is electrical tape a proper repair for a cut mains lead?', ['Yes', 'No: replace the lead', 'Only if the tape is black', 'Only for outdoor leads'], 1, 'Tape does not restore the insulation, strain relief or the earth protection.'),
      ],
      exercises: [
        choose('dm-cut', 'A cut lead', 'The outer sheath of a lamp’s flex is cut and you can see copper. What now?', ['Wrap it in tape and keep using it', 'Unplug it, stop using the lamp, and replace the lead or lamp', 'Move the lead out of sight', 'Switch it on to test it'], 1, 'The insulation is broken. Replace it.', 'Is the damage something you can safely fix, or must the part go?'),
        choose('dm-hot', 'A hot plug', 'The plug on a heater lead is too hot to touch after an hour. What does this tell you?', ['Normal for heaters', 'A poor connection or an overloaded lead: unplug it and stop using it', 'The room is cold', 'The heater is very efficient'], 1, 'The plug should stay barely warm. A hot plug is wasting power as heat at the connection.', 'Heat where it should not be means energy is going where it should not.'),
        choose('dm-tingle', 'A tingle', 'A washing machine gives you a mild tingle. What is the sensible response?', ['Carry on: it is mild', 'Stop using it, switch it off at the {{PANEL}} or unplug it, and get it repaired', 'Put a rubber mat down', 'Touch it only with one hand'], 1, 'The metal is probably live because of a fault.', 'Any current you can feel through an appliance is a failure of its protection.'),
        choose('dm-rcd', 'The tripping {{RCD}}', 'The {{RCD}} trips whenever the dishwasher starts. You unplug the dishwasher and it stops tripping. What does that suggest?', ['The {{RCD}} is faulty', 'The dishwasher has an earth leakage fault', 'There are too many lights', 'The grid is unstable'], 1, 'Removing the one appliance cured it: the fault is in that appliance.', 'What changed when you removed the one appliance?'),
      ],
      boundary: {
        safe: ['Stop using, unplug and replace damaged leads and appliances.', 'Switch off at the {{PANEL}} if it is dry and safe to reach.'],
        pro: ['Any fault inside an appliance’s mains parts (unless you are qualified to repair that type).', 'Repeated tripping that you cannot trace to one appliance.', 'Scorching, sparks or burning smells.'],
      },
    },
    {
      id: 'safe-or-pro', title: 'What a householder can do, and what needs a pro', time: '15 min',
      blocks: [
        { h: 'Drawing the line' },
        { p: 'In most countries, work on fixed electrical wiring is **regulated**: it needs a qualified person, and some of it must be inspected or notified to an authority. Rules vary by place and change over time, so always check your **local requirements**.' },
        { p: 'Even where the law allows householders to do some jobs, the risk is real: a mistake can stay hidden in a wall for years and then cause a fire or a fatal shock.' },
        { h: 'A useful rule of thumb' },
        { list: [
          '**Using and looking after** the electrical system (resetting a tripped breaker once, testing the {{RCD}} test button as the maker recommends, replacing a bulb with the power off, replacing a damaged lead) is within a householder’s reach.',
          '**Changing or adding** to the fixed wiring (new sockets, new circuits, work in the {{PANEL}}, moving fittings, anything with exposed wiring) needs a qualified electrician.',
        ] },
        { warn: 'This course does not make you qualified to carry out electrical installation work and gives no instructions for it.' },
      ],
      quiz: [
        q('Who should add a new circuit to a house?', ['Any confident householder', 'A qualified electrician, following local rules', 'The shop that sold the cable', 'Nobody'], 1, 'New circuits affect the safety of the whole installation, and are regulated in most places.'),
        q('Which is something a householder can reasonably do?', ['Replacing the {{PANEL}}', 'Pressing the {{RCD}} test button as the maker recommends', 'Adding a socket by splicing into an existing circuit', 'Rewiring a light fitting with the power on'], 1, 'Testing a {{RCD}} with its own button is designed for householders.'),
        q('Rules for electrical work are…', ['The same everywhere', 'Different by region and updated over time', 'Only for factories', 'Optional'], 1, 'Always check your local requirements.'),
      ],
      exercises: [
        {
          id: 'sp-classify', type: 'classify', title: 'Sort the jobs',
          prompt: 'For each job, choose who should do it.', options: SAFE_OR_PRO,
          items: [
            { text: 'Replace a light bulb after switching the light off at the wall switch.', answer: 0 },
            { text: 'Add a new socket to the kitchen.', answer: 1 },
            { text: 'Press the {{RCD}} test button to check that it trips, as the maker advises.', answer: 0 },
            { text: 'Replace the {{PANEL}}.', answer: 1 },
            { text: 'Reset a tripped breaker once, after unplugging the appliance that caused it.', answer: 0 },
            { text: 'Investigate a socket that sparks and is hot.', answer: 1 },
            { text: 'Replace a damaged extension lead with a new one.', answer: 0 },
          ],
          hint: 'Using and looking after the system: householder. Changing the fixed wiring or investigating faults inside it: electrician.',
        },
      ],
      boundary: {
        safe: ['Use and look after the system as described above.', 'Learn enough to ask an electrician good questions.'],
        pro: ['New or altered wiring, work in the {{PANEL}}, and investigating faults in fixed wiring: check your local rules for what must be done by a qualified person.'],
      },
    },
    {
      id: 'emergencies', title: 'Emergencies: shock, fire and sparks', time: '15 min',
      blocks: [
        { h: 'If someone gets a shock' },
        { list: [
          '**Do not touch them** while they may still be in contact with the electricity.',
          '**Cut the power** at the source if you can do so safely: switch off at the {{PANEL}} or unplug.',
          'If you cannot, and must separate them, use something dry that does not conduct (such as a wooden broom handle), and stand on something dry.',
          '**Call {{EMERGENCY}}.** Anyone who has had a significant shock needs medical checking, even if they feel fine. Follow the dispatcher’s instructions, including first aid if they are not breathing.',
        ] },
        { h: 'Electrical fire' },
        { list: [
          '**Never use water** on a fire involving electrical equipment.',
          'If it is safe to do so, switch off the power at the {{PANEL}}.',
          'Only use an extinguisher if you are trained, the fire is small, and you have an escape route. Otherwise **get out, stay out, and call {{EMERGENCY}}**.',
        ] },
        { h: 'Sparks or burning smell' },
        { p: 'Stop using it. Switch off at the {{PANEL}} if safe to reach, keep clear, and call a qualified electrician (or the emergency services if there is fire or smoke).' },
        { tip: 'Learn where your {{PANEL}} is and how to switch the main supply off *before* you need it.' },
      ],
      quiz: [
        q('Someone is stuck to a live appliance and cannot let go. What should you do first?', ['Grab them and pull', 'Switch off the power if you can do it safely, without touching them', 'Throw water on them', 'Wait'], 1, 'Touching them can make you part of the circuit. Cut the power first.'),
        q('Can you use water on an electrical fire?', ['Yes, always', 'No: it conducts electricity and can spread the fire', 'Only if it is a small fire', 'Only if the power is on'], 1, 'Switch off the power if safe, and call for help or use a suitable extinguisher if you are trained.'),
        q('Someone had a shock and feels fine. What next?', ['Nothing', 'Get them medically checked', 'Make them run around', 'Give them water'], 1, 'Shocks can cause delayed heart-rhythm problems and burns.'),
      ],
      exercises: [
        choose('em-shock', 'The first move', 'A person is gripping a faulty live appliance and shaking. What is the best first action?', ['Pull them away by the arm', 'Switch off the power at the source if you can do it without touching them', 'Pour water over the appliance', 'Leave and call a friend'], 1, 'Break the contact with the power, not with your hands.', 'Which action keeps you out of the circuit?'),
        choose('em-fire', 'A small fire', 'A heater cable is on fire. What is wrong with using a bucket of water?', ['Nothing, water always works', 'Water conducts electricity and can spread the fire', 'It would be a waste of water', 'The fire is too big'], 1, 'Cut the power if safe, then use the right extinguisher (if trained) or leave and call for help.', 'Water and live electricity are a bad mix.'),
        choose('em-sparks', 'Sparks from a socket', 'A wall socket sparks and smells of burning. What is the best next step?', ['Keep using it carefully', 'Stop using it, switch off at the {{PANEL}} if safe, and call a qualified electrician', 'Put a plug cover on it', 'Spray it with cleaner'], 1, 'Arcing in a socket can start a fire in the wall.', 'You must not leave an arcing connection live.'),
      ],
      boundary: {
        safe: ['Switch off the power at the source if you can do so safely.', 'Call {{EMERGENCY}} and follow their instructions.', 'Evacuate if there is fire or smoke.'],
        pro: ['Any investigation or repair after an electrical fire, shock or sparking: a qualified electrician must check the installation before it is used again.'],
      },
    },
  ];
  EB.lessons = EB.lessons || {};
  EB.lessons.safety = lessons;
})();
