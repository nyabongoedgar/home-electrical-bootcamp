// Assembles tracks. Numbering follows the plan; Track 5 (safety) is recommended first.
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});
  const L = EB.lessons || {};
  EB.TRACKS = [
    { id: 'power', n: 1, title: 'How a house gets power', status: 'ready', blurb: 'From power station to socket: AC, the service entry, live/neutral/earth, and why mains is dangerous.', lessons: L.power || [] },
    { id: 'protection', n: 2, title: 'Protection', status: 'ready', blurb: 'Breakers, fuses, earthing and {{RCD}}s: what each one protects against, with an interactive protection lab.', lessons: L.protection || [] },
    {
      id: 'sizing', n: 3, title: 'Circuits and sizing (on paper)', status: 'planned', phase: 'Phase 3',
      blurb: 'Choosing cable size and breaker rating for a stated load, voltage drop and demand: calculation only.',
      needs: 'Region-specific cable and installation tables, reviewed by a licensed electrician',
      outline: ['Radial and ring circuits', 'Cable types and conductor sizes', 'Current ratings and installation methods (concepts)', 'Protecting the cable with a breaker', 'Voltage drop', 'Maximum demand and diversity', 'Typical lighting, socket and cooker circuits', 'Project: size a small flat on paper'],
    },
    {
      id: 'diagnosing', n: 4, title: 'Reading and diagnosing', status: 'planned', phase: 'Phase 4',
      blurb: 'Read a {{PANEL}} schedule and diagrams, and diagnose symptoms to a likely cause and a safe next step.',
      needs: 'The troubleshooting case player, with a simulated tester and electrician-reviewed scenarios',
      outline: ['Reading a {{PANEL}} schedule', 'Symbols and diagrams', 'Common symptoms', 'Reading simulated test results', 'Diagnosis walk-throughs', 'Capstone: write the note for the electrician'],
    },
    { id: 'safety', n: 5, title: 'Home safety and when to call a pro', status: 'ready', start: true, blurb: 'Hazards, overload, damaged equipment, what a householder can and cannot do, and what to do in an emergency.', lessons: L.safety || [] },
  ];
})();
