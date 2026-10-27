// Static teaching diagrams as SVG strings (colours come from CSS variables, so they follow light/dark).
(function () {
  const EB = (globalThis.EB = globalThis.EB || {});
  const box = (x, y, w, h, t1, t2) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="dbox"/><text x="${x + w / 2}" y="${y + h / 2 - (t2 ? 7 : 0)}" class="dt" text-anchor="middle" dominant-baseline="central">${t1}</text>${t2 ? `<text x="${x + w / 2}" y="${y + h / 2 + 11}" class="dts" text-anchor="middle" dominant-baseline="central">${t2}</text>` : ''}</g>`;
  const wrap = (title, desc, h, body) => `<svg viewBox="0 0 680 ${h}" width="100%" role="img" aria-label="${title}" class="diagram"><title>${title}</title><desc>${desc}</desc><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>${body}</svg>`;

  EB.diagrams = {
    supply: () => {
      const names = [['Power station', 'generates AC'], ['High-voltage grid', 'low losses'], ['Local transformer', 'steps voltage down'], ['Meter and main switch', 'your supply'], ['{{PANEL}}', 'breakers, {{RCD}}']];
      const w = 112, gap = 20, x0 = 20;
      let body = '';
      names.forEach((n, i) => {
        const x = x0 + i * (w + gap);
        body += box(x, 50, w, 64, n[0], n[1]);
        if (i < names.length - 1) body += `<line x1="${x + w + 2}" y1="82" x2="${x + w + gap - 2}" y2="82" class="darr" marker-end="url(#ar)"/>`;
      });
      body += `<text x="340" y="150" class="dts" text-anchor="middle">Everything to the right of the meter is the building’s own installation.</text>`;
      return wrap('Path of electricity from power station to the building', 'Five boxes in a row: power station, high-voltage grid, local transformer, meter and main switch, then the distribution board.', 170, body);
    },
    rcd: () => {
      let body = '';
      body += `<line x1="30" y1="60" x2="560" y2="60" class="dline"/><line x1="30" y1="140" x2="560" y2="140" class="dline"/>`;
      body += `<text x="30" y="50" class="dts">Live (current out)</text><text x="30" y="160" class="dts">Neutral (current back)</text>`;
      body += `<ellipse cx="200" cy="100" rx="30" ry="56" class="dbox"/><text x="200" y="100" class="dt" text-anchor="middle" dominant-baseline="central">sensor</text>`;
      body += `<rect x="390" y="75" width="90" height="50" rx="6" class="dbox"/><text x="435" y="100" class="dt" text-anchor="middle" dominant-baseline="central">Appliance</text>`;
      body += `<line x1="560" y1="60" x2="560" y2="140" class="dline"/>`;
      body += `<path d="M 435 125 L 435 200 L 520 200" fill="none" class="dleak" marker-end="url(#ar)"/><text x="530" y="204" class="dts">leak through a person to earth</text>`;
      body += `<text x="200" y="196" class="dts" text-anchor="middle">out ≠ back → trips</text>`;
      return wrap('How a residual-current device works', 'Live and neutral pass through a sensor. If some current leaks to earth through a person, less returns on the neutral than went out on the live, and the device trips.', 230, body);
    },
  };
})();
