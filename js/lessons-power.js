// Track 1: How a house gets power.
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});
  const q = (qq, options, answer, why) => ({ q: qq, options, answer, why });
  const choose = (id, title, prompt, options, answer, why, hint) => ({ id, type: 'choose', title, prompt, options, answer, why, hint });
  const f1 = (n) => `${+n.toFixed(1)}`;

  const lessons = [
    {
      id: 'grid', title: 'From power station to street', time: '15 min',
      blocks: [
        { h: 'Why the grid uses AC and high voltage' },
        { p: 'Power stations generate **alternating current (AC)**: the voltage swings back and forth {{HZ}} times a second in this region. AC matters because **transformers** can raise or lower AC voltage easily, and transformers do not work on steady DC.' },
        { diagram: 'supply' },
        { p: 'Power is `P = V × I`. To send the same power with a *higher* voltage you need a *lower* current. Cables lose power as heat in proportion to the **square** of the current (`P_loss = I² × R`), so high-voltage transmission wastes far less energy.' },
        { formula: 'I = P / V     P_loss = I² × R' },
        { tip: 'Doubling the voltage halves the current and cuts the cable loss to a quarter. That is why long-distance lines run at tens or hundreds of thousands of volts, and local transformers step it down to the {{V}} V that reaches your home.' },
      ],
      quiz: [
        q('Why can the grid use transformers?', ['They work on AC', 'They create electricity', 'They store energy', 'They reduce frequency'], 0, 'A transformer needs a changing magnetic field, which AC provides.'),
        q('Sending the same power at a higher voltage means…', ['more current', 'less current', 'the same current', 'no loss'], 1, 'I = P / V, so higher V gives lower I.'),
        q('If the current in a cable doubles, the heat loss in it…', ['doubles', 'quadruples', 'halves', 'stays the same'], 1, 'Loss = I² × R, so doubling I multiplies the loss by four.'),
      ],
      exercises: [
        { id: 'gr-hv', type: 'calculate', title: 'Current at high voltage', prompt: 'A town draws 1 MW (1,000,000 W). What current flows in the line if it is sent at 10 kV (10,000 V)? Use I = P / V.', answer: { value: 100, unit: 'A' }, solution: '100 A', hint: 'I = 1,000,000 / 10,000' },
        { id: 'gr-lv', type: 'calculate', title: 'Current at low voltage', prompt: 'For comparison, what current would 1 MW need at 230 V?', answer: { value: 4347.8, unit: 'A', tol: 0.02 }, solution: '4348 A', hint: 'I = 1,000,000 / 230' },
        { id: 'gr-loss', type: 'calculate', title: 'Heat in the line', prompt: 'The 10 kV line carries 100 A and has a total resistance of 0.2 Ω. How much power is lost as heat? Use P = I² × R.', answer: { value: 2000, unit: 'W' }, solution: '2000 W', hint: '100 × 100 × 0.2' },
        choose('gr-why', 'Why high voltage?', 'Why is long-distance power transmitted at very high voltage?', ['It makes the electricity cleaner', 'It lowers the current for the same power, so the cables lose much less energy as heat', 'It is cheaper to generate', 'It makes the lights brighter'], 1, 'Lower current means far lower I²R heating in the lines.', 'Think about P = V × I and loss = I² × R.'),
      ],
      boundary: {
        safe: ['Understand why voltage is stepped up and down.', 'Notice the transformers and cables near you from a distance.'],
        pro: ['Anything to do with the utility’s network, street equipment or the meter tails: this belongs to the utility or a qualified person.'],
      },
    },
    {
      id: 'service', title: 'Meter, main switch and {{PANEL}}', time: '15 min',
      blocks: [
        { h: 'Entering the building' },
        { p: 'The supply reaches the building through a **service cable**. After the utility’s **meter**, a **main switch** can disconnect the whole installation. After that comes the **{{PANEL}}**, which divides the supply into separate **circuits** (lighting, sockets, the cooker and so on), each protected by its own {{BREAKER}} or fuse, and usually by a {{RCDLONG}}.' },
        { list: [
          '**Meter:** measures the energy used (kWh). It belongs to the utility.',
          '**Main switch:** disconnects the whole installation. Know where it is.',
          '**{{PANEL}}:** protective devices for each circuit.',
          '**Circuits:** the cables that go to your sockets, lights and fixed appliances.',
        ] },
        { warn: 'The cables up to and including the main switch are live even when the main switch is off. Only a qualified person may work there.' },
        { tip: 'Find your {{PANEL}} now. Look for labels showing which breaker covers which circuit. Missing or wrong labels are a safety problem worth fixing with an electrician.' },
      ],
      quiz: [
        q('What does the main switch do?', ['Measures energy', 'Disconnects the whole installation', 'Protects one circuit only', 'Stores power'], 1, 'It isolates everything after it, in an emergency or for maintenance.'),
        q('Why is the supply divided into several circuits?', ['To make it cheaper', 'So a fault on one circuit does not shut off the rest, and each cable has its own protection', 'To make it faster', 'Because meters need it'], 1, 'Each circuit has its own protection sized for its cable.'),
        q('Which part is nearest the street?', ['Socket', 'Meter', 'Light switch', '{{PANEL}} breakers'], 1, 'The service cable reaches the meter first.'),
      ],
      exercises: [
        choose('sv-order', 'The order', 'Which sequence is correct, from the street into the house?', ['{{PANEL}}, meter, main switch', 'Meter, main switch, {{PANEL}}', 'Main switch, {{PANEL}}, meter', 'Sockets, {{PANEL}}, meter'], 1, 'Supply, then the meter, then the main switch, then the {{PANEL}} and its circuits.', 'Energy is measured before it is distributed.'),
        choose('sv-main', 'The main switch', 'Why should everyone in the house know where the main switch is?', ['To save electricity', 'To cut the whole supply quickly in an emergency', 'To reset the meter', 'To change the voltage'], 1, 'In a fire, flood or shock, quick isolation matters.', 'Think of an emergency.'),
        choose('sv-live', 'The main switch is off', 'The main switch is off. Which of these is still live?', ['The sockets', 'The lights', 'The cables up to the main switch', 'Everything is dead'], 2, 'The main switch cannot isolate the cables on the supply side of it.', 'What is on the street side of the switch?'),
      ],
      boundary: {
        safe: ['Locate the main switch and {{PANEL}}.', 'Read the circuit labels.', 'Use the {{RCD}} test button as the maker recommends.'],
        pro: ['Opening the {{PANEL}}, the meter, or working on the service cable and main switch.'],
      },
    },
    {
      id: 'lne', title: 'Live, neutral and earth', time: '15 min',
      blocks: [
        { h: 'Three conductors, three jobs' },
        { table: { head: ['Conductor', 'Colour in this region', 'Normal job'], rows: [
          ['Live (hot)', '{{LIVE}}', 'Carries the alternating voltage to the load'],
          ['Neutral', '{{NEUTRAL}}', 'Carries the current back to the source'],
          ['Earth (ground)', '{{EARTH}}', 'Carries **no** current normally. It is a safety path for faults.'],
        ] } },
        { p: 'Current flows in a **loop**: out along the live, through the appliance, and back along the neutral. In normal use the earth conductor carries nothing.' },
        { warn: 'Treat the neutral as dangerous too. In many installations it is near earth voltage, but a break or fault elsewhere can leave it live. Colours can also be wrong in old or altered wiring.' },
        { tip: 'Wire colours differ between countries and older installations. Never rely on colour alone, and never assume a wire is dead.' },
      ],
      quiz: [
        q('In normal operation, which conductor carries no current?', ['Live', 'Neutral', 'Earth', 'All of them carry current'], 2, 'Earth is the protective path that only carries current during a fault.'),
        q('Current in a circuit flows…', ['only in the live', 'out along the live and back along the neutral', 'only in the earth', 'in no particular direction'], 1, 'It needs a complete loop, like in every circuit you have met.'),
        q('Is it safe to assume the neutral cannot hurt you?', ['Yes', 'No: it can be live in a fault or if wiring is wrong', 'Only outdoors', 'Only at night'], 1, 'Always treat every conductor as live until proved otherwise by a qualified person.'),
      ],
      exercises: [
        {
          id: 'ln-colour', type: 'choose', title: 'Earth colour', prompt: 'In this region, which description matches the earth (ground) conductor?',
          options: ['{{LIVE}}', '{{NEUTRAL}}', '{{EARTH}}', 'Any colour'], answer: 2, why: 'The earth conductor uses {{EARTH}} in this region.', hint: 'Check the table in the lesson.',
        },
        choose('ln-normal', 'Who carries current?', 'In normal use, which pair of conductors carries the load’s current?', ['Live and earth', 'Neutral and earth', 'Live and neutral', 'Earth only'], 2, 'The load sits in the loop between live and neutral.', 'Which two make the loop?'),
        choose('ln-neutral', 'A “dead” neutral?', 'A friend says “the neutral is safe to touch”. What is the best response?', ['Agree: it is at zero volts', 'Never assume: neutrals can become live through a fault or wiring error', 'Only touch it with one hand', 'Neutrals are always dangerous but earth is not'], 1, 'Safety rules treat all conductors as live until isolated and tested by a qualified person.', 'Think about what a fault can do.'),
      ],
      boundary: {
        safe: ['Know what live, neutral and earth do.', 'Notice when a plug or appliance has the earth connection and keep it that way.'],
        pro: ['Identifying, connecting or testing conductors in any fixed wiring.'],
      },
    },
    {
      id: 'phases', title: 'Single-phase, three-phase and split-phase', time: '15 min',
      blocks: [
        { h: 'What reaches your home' },
        { p: '{{SUPPLY}}' },
        { p: 'The grid actually delivers **three-phase** power: three alternating voltages, each shifted by a third of a cycle. A home takes either one phase (single-phase) or, with a split-phase system, two lines from the transformer.' },
        { tip: 'Bigger loads (cookers, heat pumps, car chargers) draw a lot of current. Higher-voltage connections let them do the same power with less current, the same idea as the grid.' },
      ],
      quiz: [
        q('Why do big appliances sometimes use a higher-voltage connection?', ['It looks neater', 'For the same power, higher voltage means lower current in the cable', 'It is cheaper to run', 'It reduces frequency'], 1, 'I = P / V again.'),
        q('Three-phase power means…', ['three separate buildings', 'three alternating voltages shifted in time', 'three batteries', 'three times the frequency'], 1, 'Each phase peaks at a different moment, which gives smoother, more efficient power delivery.'),
        q('Which is true of the earth conductor on any supply?', ['It carries the main load', 'It is a safety path and carries nothing normally', 'It is optional', 'It is always neutral'], 1, 'Earth never takes the place of the neutral.'),
      ],
      exercises: [
        {
          id: 'ph-between', type: 'calculate', title: 'Voltage between lines',
          prompt: 'In this region’s supply, what voltage is there between two live lines? (Use the lesson text above: for three-phase, multiply by √3 ≈ 1.732.)',
          region: (r) => (r.id === 'na-120'
            ? { prompt: 'In a split-phase supply, each of two lines is 120 V to neutral and they are opposite in polarity. What is the voltage between the two lines?', answer: { value: 240, unit: 'V' }, solution: '240 V' }
            : { prompt: 'In a three-phase supply, each phase is 230 V to neutral. The voltage between two phases is 230 × √3. What is it (roughly)?', answer: { value: 398.4, unit: 'V', tol: 0.03 }, solution: '398 V' }),
          answer: { value: 398.4, unit: 'V', tol: 0.03 }, solution: '398 V', hint: 'Use the rule in the prompt.',
        },
        choose('ph-why', 'Why not use only low voltage?', 'Why do large appliances such as cookers use a higher-voltage connection?', ['It makes them cook faster by magic', 'For the same power the current is lower, so cables stay cooler and cheaper', 'Because low voltage is illegal', 'It reduces the meter reading'], 1, 'Lower current means thinner cable for the same power, and less heating.', 'What does I = P / V tell you?'),
      ],
      boundary: {
        safe: ['Know what kind of supply your home has by reading your documentation or asking your supplier.'],
        pro: ['Changing, extending or testing the supply, or adding large loads such as chargers or heat pumps.'],
      },
    },
    {
      id: 'bill', title: 'Power, energy and your bill', time: '15 min',
      blocks: [
        { h: 'Power is a rate, energy is an amount' },
        { p: '**Power** (watts) is how fast energy is used. **Energy** is power over time. Utilities bill in **kilowatt-hours (kWh)**: 1 kW for 1 hour.' },
        { formula: 'E (kWh) = P (kW) × t (hours)' },
        { p: 'A 2000 W (2 kW) heater running for 3 hours uses 2 × 3 = 6 kWh. Its current on this region’s {{V}} V supply is `I = P / V`.' },
        { tip: 'Standby loads add up: ten devices at 5 W left on all year is 10 × 5 W × 8760 h = 438 kWh.' },
      ],
      quiz: [
        q('A kilowatt-hour is a unit of…', ['power', 'energy', 'current', 'voltage'], 1, 'It is power (kW) multiplied by time (h).'),
        q('A 100 W bulb runs for 10 hours. Energy used?', ['1 kWh', '10 kWh', '0.1 kWh', '100 kWh'], 0, '0.1 kW × 10 h = 1 kWh.'),
        q('Two heaters of the same power run for the same time. The energy used is…', ['the same', 'halved', 'depends on the colour', 'zero'], 0, 'Same power × same time = same energy.'),
      ],
      exercises: [
        { id: 'bl-kwh', type: 'calculate', title: 'Energy used', prompt: 'A 2 kW heater runs for 3 hours. How many kWh does it use? Give your answer in kWh.', answer: { value: 6000, unit: 'Wh', bare: 1000 }, solution: '6 kWh', hint: 'E = P × t' },
        { id: 'bl-cost', type: 'calculate', title: 'Cost', prompt: 'Electricity costs 0.25 per kWh. What does it cost to run the 2 kW heater for 3 hours? (A plain number, no currency.)', answer: { value: 1.5, unit: null }, solution: '1.5', hint: '6 kWh × 0.25' },
        {
          id: 'bl-amps', type: 'calculate', title: 'Current of a heater', prompt: 'A 1500 W heater plugs into this region’s supply. What current does it draw?',
          region: (r) => ({ answer: { value: 1500 / r.V, unit: 'A' }, solution: `${f1(1500 / r.V)} A` }),
          answer: { value: 6.52, unit: 'A' }, solution: '6.5 A', hint: 'I = P / V',
        },
      ],
      boundary: {
        safe: ['Read your meter and bill, and estimate what appliances cost to run.', 'Use energy monitors and plug-in watt meters.'],
        pro: ['Anything that needs changes to the meter or the supply.'],
      },
    },
    {
      id: 'danger', title: 'Why mains is dangerous', time: '20 min',
      blocks: [
        { h: 'It is current through the body that hurts' },
        { p: 'Voltage is the push; **current** is what damages the body. Roughly (these are approximate teaching bands):' },
        { table: { head: ['Current through the body', 'Typical effect'], rows: [
          ['Below about 1 mA', 'Usually not felt'],
          ['1 – 10 mA', 'A tingle or pain; you can usually let go'],
          ['10 – 30 mA', 'Muscles can lock so you cannot let go; breathing may be affected'],
          ['Above about 30 mA', 'Serious risk of a dangerous heart rhythm and death, especially if it lasts'],
        ] } },
        { p: 'How much current flows depends on the **resistance of the body path**, `I = V / R`. Dry skin can be tens of kilohms; wet skin and good contact can be a couple of kilohms or less.' },
        { formula: 'I = V / R' },
        { warn: 'These figures are why a {{RCDLONG}} trips at about {{RCDMA}} mA, and why water and electricity must be kept apart. Your body’s resistance varies a lot, and you cannot judge it.' },
      ],
      quiz: [
        q('What actually damages the body?', ['Voltage alone', 'Current through the body', 'Frequency alone', 'Colour'], 1, 'Voltage drives the current, but the current is what the body feels.'),
        q('Wet hands make a shock more dangerous because…', ['water is a magnet', 'body resistance drops, so more current flows', 'water raises the voltage', 'water speeds up the current'], 1, 'Lower resistance with the same voltage means higher current.'),
        q('Above roughly what current is there a serious risk of a dangerous heart rhythm?', ['0.1 mA', '1 mA', '30 mA', '3 A'], 2, 'Around 30 mA is the level that shock protection devices are designed to catch.'),
      ],
      exercises: [
        {
          id: 'dg-current', type: 'calculate', title: 'Current through the body', prompt: 'Someone with wet hands has a body resistance of about 2 kΩ and touches a live part at this region’s voltage. What current flows? (I = V / R)',
          region: (r) => ({ answer: { value: r.V / 2000, unit: 'A' }, solution: `${f1((r.V / 2000) * 1000)} mA` }),
          answer: { value: 0.115, unit: 'A' }, solution: '115 mA', hint: 'Convert 2 kΩ to 2000 Ω.',
        },
        {
          id: 'dg-band', type: 'choose', title: 'What does that mean?', prompt: 'Using the table above, how dangerous is the current you just calculated?',
          options: ['Not felt', 'A tingle you can let go of', 'Muscles may lock', 'Serious risk of a dangerous heart rhythm'], answer: 3, why: 'It is well above 30 mA, which is the level a {{RCD}} is designed to catch.', hint: 'Compare it with 30 mA.',
        },
        choose('dg-dry', 'Dry vs wet', 'The same person touches the same live part, once with dry hands and once with wet hands. Which touches carry more current?', ['Dry hands', 'Wet hands', 'They are the same', 'It depends on the colour of the part'], 1, 'Wet skin lowers the body’s resistance, so the current is greater.', 'I = V / R. What happens to R when skin is wet?'),
      ],
      boundary: {
        safe: ['Understand why water, damage and DIY are dangerous.', 'Keep electrical equipment away from baths, sinks and outdoors in rain.'],
        pro: ['Any test or measurement on live mains: this needs training, proper instruments and procedures.'],
      },
    },
  ];
  EB.lessons = EB.lessons || {};
  EB.lessons.power = lessons;
})();
