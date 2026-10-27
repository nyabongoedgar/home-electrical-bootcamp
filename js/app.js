// App shell: track picker, lesson pages, exercises.
(function () {
  const EB = globalThis.EB;
  const E = EB.engine;
  const app = document.getElementById('app');

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const X = (s) => EB.regions.expand(s);
  const inline = (s) => esc(X(s)).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // ---------- progress ----------
  const KEY = 'he-progress-v1';
  let memory = {};
  const progress = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return memory; } },
    save(p) { memory = p; try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (_) { /* ignore */ } },
    has(id) { return !!this.load()[id]; },
    mark(id) { const p = this.load(); p[id] = true; this.save(p); },
    reset() { this.save({}); },
  };
  const stats = (t) => {
    let total = 0, done = 0;
    t.lessons.forEach((l) => { l.quiz.forEach((_, i) => { total++; if (progress.has(`q:${l.id}:${i}`)) done++; }); l.exercises.forEach((e) => { total++; if (progress.has(`x:${e.id}`)) done++; }); });
    return { total, done, pct: total ? Math.round((100 * done) / total) : 0 };
  };
  const lessonDone = (l) => l.quiz.every((_, i) => progress.has(`q:${l.id}:${i}`)) && l.exercises.every((e) => progress.has(`x:${e.id}`));

  // ---------- chrome: banner and region selector ----------
  function chrome() {
    const r = EB.regions.current;
    document.getElementById('banner').innerHTML = `General education only. This course does not qualify you for electrical work, and mains electricity can kill. ${r.reviewed ? '' : '<strong>This content has not yet been reviewed by a licensed electrician.</strong> '}Check your local rules.`;
    document.getElementById('foot').textContent = `Region profile: ${r.long}. Basis: ${r.source}.`;
    const sel = document.getElementById('region');
    sel.innerHTML = Object.values(EB.regions.all).map((p) => `<option value="${p.id}" ${p.id === r.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
  }
  document.getElementById('region').addEventListener('change', (e) => { EB.regions.set(e.target.value); chrome(); route(); });

  // ---------- routing ----------
  function route() {
    chrome();
    const [, kind, a, b] = (location.hash || '#/').split('/');
    const t = EB.TRACKS.find((x) => x.id === a);
    if (kind === 'track' && t) renderTrack(t);
    else if (kind === 'lesson' && t && t.lessons && t.lessons.find((l) => l.id === b)) renderLesson(t, t.lessons.find((l) => l.id === b));
    else renderPicker();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  // ---------- picker ----------
  function renderPicker() {
    document.title = 'Home Electrical Bootcamp';
    app.innerHTML = `
      <h1>How does the electricity in a home work?</h1>
      <p class="lede">Understand where power comes from, what protects you, and how to stay safe. This is a course about <strong>understanding and safety</strong>, not about doing electrical installation work.</p>
      <div class="cards">${EB.TRACKS.map((t) => {
        const ready = t.status === 'ready';
        const s = ready ? stats(t) : null;
        return `<article class="card ${ready ? '' : 'soon'}">
          <span class="badge ${t.start ? 'startbadge' : ready ? 'ready' : ''}">${t.start ? 'Start here' : ready ? `${t.lessons.length} lessons` : `Planned · ${esc(t.phase)}`}</span>
          <h3>${t.n}. ${esc(X(t.title))}</h3><p>${inline(t.blurb)}</p>
          ${ready ? `<div class="bar" role="progressbar" aria-valuenow="${s.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${s.pct}%"></i></div><p class="muted">${s.done} of ${s.total} done</p><a class="btn" href="#/track/${t.id}">${s.done ? 'Continue' : 'Start'}</a>`
          : `<a class="btn secondary" href="#/track/${t.id}">See the outline</a>`}
        </article>`;
      }).join('')}</div>
      <p class="muted" style="margin-top:26px"><button class="small danger" id="reset" type="button">Reset my progress</button></p>`;
    document.getElementById('reset').onclick = () => { if (confirm('Erase all saved progress in this browser?')) { progress.reset(); route(); } };
  }

  function sidebar(t, current) {
    return `<aside class="side" aria-label="Lessons"><h4><a href="#/track/${t.id}">${esc(X(t.title))}</a></h4><ol>${t.lessons.map((l, i) => `<li><a href="#/lesson/${t.id}/${l.id}" ${l.id === current ? 'aria-current="page"' : ''}><span class="num">${i + 1}</span>${esc(X(l.title))}${lessonDone(l) ? '<span class="done" aria-label="completed">✓</span>' : ''}</a></li>`).join('')}</ol></aside>`;
  }

  function renderTrack(t) {
    document.title = `${X(t.title)} · Home Electrical Bootcamp`;
    if (t.status !== 'ready') {
      app.innerHTML = `<p><a href="#/">← All tracks</a></p><h1>${esc(X(t.title))}</h1><p class="lede">${inline(t.blurb)}</p>
        <div class="block-tip"><strong>Planned for ${esc(t.phase)}.</strong> It needs: ${esc(t.needs)}. It is not playable yet.</div>
        <h2>Planned lessons</h2><ol>${t.outline.map((o) => `<li>${esc(X(o))}</li>`).join('')}</ol>`;
      return;
    }
    const s = stats(t);
    app.innerHTML = `<div class="layout">${sidebar(t)}<section><p><a href="#/">← All tracks</a></p><h1>${esc(X(t.title))}</h1><p class="lede">${inline(t.blurb)}</p>
      <div class="bar"><i style="width:${s.pct}%"></i></div><p class="muted">${s.done} of ${s.total} quizzes and exercises done</p>
      <div class="cards">${t.lessons.map((l, i) => `<article class="card"><span class="badge">${esc(l.time)}${lessonDone(l) ? ' · done ✓' : ''}</span><h3>${i + 1}. ${esc(X(l.title))}</h3><p class="muted">${l.quiz.length} quiz questions · ${l.exercises.length} exercises</p><a class="btn small" href="#/lesson/${t.id}/${l.id}">Open</a></article>`).join('')}</div></section></div>`;
  }

  // ---------- lesson ----------
  function renderBlock(b) {
    if (b.h) return `<h2>${inline(b.h)}</h2>`;
    if (b.p) return `<p>${inline(b.p)}</p>`;
    if (b.list) return `<ul>${b.list.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`;
    if (b.tip) return `<div class="block-tip"><strong>Tip.</strong> ${inline(b.tip)}</div>`;
    if (b.warn) return `<div class="block-warn"><strong>Careful.</strong> ${inline(b.warn)}</div>`;
    if (b.formula) return `<div class="block-formula" role="math">${esc(b.formula)}</div>`;
    if (b.table) return `<div style="overflow-x:auto"><table class="data"><thead><tr>${b.table.head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${b.table.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (b.diagram) return X(EB.diagrams[b.diagram]());
    if (b.lab) return `<div class="lab-host"></div>${b.caption ? `<p class="caption">${inline(b.caption)}</p>` : ''}`;
    return '';
  }

  function renderLesson(t, l) {
    document.title = `${X(l.title)} · Home Electrical Bootcamp`;
    const idx = t.lessons.indexOf(l);
    const next = t.lessons[idx + 1];
    app.innerHTML = `<div class="layout">${sidebar(t, l.id)}<article>
      <p class="muted">Lesson ${idx + 1} of ${t.lessons.length} · ${esc(l.time)}</p><h1>${esc(X(l.title))}</h1>
      ${l.blocks.map(renderBlock).join('')}
      <h2>Quick check</h2><div id="quiz"></div>
      <h2>Exercises</h2><div id="exercises"></div>
      <div class="boundary">
        <div class="safe"><h3>What you can safely do</h3><ul>${l.boundary.safe.map((x) => `<li>${inline(x)}</li>`).join('')}</ul></div>
        <div class="pro"><h3>Call a qualified electrician for</h3><ul>${l.boundary.pro.map((x) => `<li>${inline(x)}</li>`).join('')}</ul></div>
      </div>
      <p>${idx > 0 ? `<a class="btn secondary" href="#/lesson/${t.id}/${t.lessons[idx - 1].id}">← Previous</a> ` : ''}${next ? `<a class="btn" href="#/lesson/${t.id}/${next.id}">Next: ${esc(X(next.title))} →</a>` : `<a class="btn" href="#/track/${t.id}">Finish track</a>`}</p>
    </article></div>`;
    app.querySelectorAll('.lab-host').forEach((h) => EB.ui.lab(h));
    l.quiz.forEach((qq, i) => renderQuiz(app.querySelector('#quiz'), l, qq, i));
    l.exercises.forEach((ex) => renderExercise(app.querySelector('#exercises'), E.forRegion(ex, EB.regions.current), ex));
  }

  function refreshSidebar() {
    const [, , a, b] = location.hash.split('/');
    const t = EB.TRACKS.find((x) => x.id === a);
    const old = app.querySelector('aside.side');
    if (t && old) { const d = document.createElement('div'); d.innerHTML = sidebar(t, b); old.replaceWith(d.firstElementChild); }
  }

  function renderQuiz(host, lesson, qq, i) {
    const el = document.createElement('div');
    el.className = 'quiz';
    const name = `q-${lesson.id}-${i}`;
    el.innerHTML = `<p class="q"><strong>${i + 1}.</strong> ${inline(qq.q)}</p>${qq.options.map((o, j) => `<label><input type="radio" name="${name}" value="${j}"> ${inline(o)}</label>`).join('')}<p class="why" aria-live="polite"></p>`;
    host.appendChild(el);
    const labels = el.querySelectorAll('label');
    if (progress.has(`q:${lesson.id}:${i}`)) { labels[qq.answer].classList.add('right'); el.querySelector('.why').innerHTML = inline(qq.why); }
    el.addEventListener('change', (e) => {
      const j = +e.target.value;
      labels.forEach((x) => x.classList.remove('right', 'wrong'));
      if (j === qq.answer) { labels[j].classList.add('right'); el.querySelector('.why').innerHTML = 'Correct. ' + inline(qq.why); progress.mark(`q:${lesson.id}:${i}`); refreshSidebar(); }
      else { labels[j].classList.add('wrong'); el.querySelector('.why').textContent = 'Not quite. Have another go.'; }
    });
  }

  // ---------- exercises ----------
  const TAG = { calculate: 'Calculate', choose: 'Choose', classify: 'Sort', hazard: 'Spot', trip: 'Predict' };

  function renderExercise(host, ex, raw) {
    const card = document.createElement('section');
    card.className = 'exercise';
    const key = `x:${raw.id}`;
    card.innerHTML = `<h3><span class="tag">${TAG[ex.type]}</span> ${esc(X(ex.title))} <span class="done-mark" aria-live="polite"></span></h3><p>${inline(ex.prompt)}</p><div class="body"></div>`;
    host.appendChild(card);
    const body = card.querySelector('.body');
    const done = () => { progress.mark(key); card.classList.add('done'); card.querySelector('.done-mark').textContent = '✓'; refreshSidebar(); };
    if (progress.has(key)) { card.classList.add('done'); card.querySelector('.done-mark').textContent = '✓'; }
    const hintBox = document.createElement('div');
    hintBox.className = 'hint'; hintBox.hidden = true; hintBox.innerHTML = '<strong>Hint.</strong> ' + inline(ex.hint || 'Re-read the lesson.');
    const fb = document.createElement('p');
    fb.className = 'feedback'; fb.setAttribute('aria-live', 'polite');
    const say = (ok, html) => { fb.className = 'feedback ' + (ok ? 'ok' : 'bad'); fb.innerHTML = html; };
    const actions = (extra = '') => `<div class="actions"><button class="primary" type="submit">Check</button><button type="button" data-hint>Hint</button>${extra}</div>`;
    const wireHint = (root) => { root.querySelector('[data-hint]').onclick = () => { hintBox.hidden = !hintBox.hidden; }; };

    if (ex.type === 'calculate') {
      const form = document.createElement('form');
      form.className = 'answer-row';
      form.innerHTML = `<input type="text" aria-label="Your answer" placeholder="e.g. 8.7 A" autocomplete="off"><button class="btn small" type="submit">Check</button><button type="button" class="small" data-hint>Hint</button><button type="button" class="small" data-sol>Show answer</button>`;
      body.append(form, fb, hintBox);
      form.addEventListener('submit', (e) => { e.preventDefault(); const r = E.checkAnswer(ex.answer, form.querySelector('input').value); if (r.pass) { say(true, 'Correct!'); done(); } else say(false, esc(r.msg)); });
      form.querySelector('[data-sol]').onclick = () => { form.querySelector('input').value = ex.solution; say(true, 'That is the answer. Work out how you would get there.'); };
      wireHint(form);
      return;
    }

    if (ex.type === 'choose' || ex.type === 'trip') {
      const options = ex.type === 'trip' ? E.TRIP_OPTIONS : ex.options;
      const answer = ex.type === 'trip' ? E.TRIP_INDEX[E.runScenario(ex.scenario, EB.regions.current).category] : ex.answer;
      const name = `c-${raw.id}`;
      const form = document.createElement('form');
      form.innerHTML = `${options.map((o, j) => `<label class="opt"><input type="radio" name="${name}" value="${j}"> ${inline(o)}</label>`).join('')}${actions()}`;
      body.append(form, fb, hintBox);
      wireHint(form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pick = form.querySelector('input:checked');
        if (!pick) return say(false, 'Pick an option first.');
        const labels = form.querySelectorAll('label');
        labels.forEach((x) => x.classList.remove('right', 'wrong'));
        const ok = +pick.value === answer;
        if (ok) labels[answer].classList.add('right'); else labels[+pick.value].classList.add('wrong');
        let extra = '';
        if (ex.type === 'trip') {
          const r = EB.regions.current; const ev = E.runScenario(ex.scenario, r);
          extra = ` <span class="muted">(Breaker: ${EB.protection.fmtTime(ev.mcbT)}. ${r.rcd}: ${Number.isFinite(ev.rcdT) ? EB.protection.fmtTime(ev.rcdT) : 'does not trip'}.)</span>`;
        }
        say(ok, (ok ? 'Right. ' : 'Not quite. ') + inline(ex.why || '') + extra);
        if (ok) done();
      });
      return;
    }

    if (ex.type === 'classify') {
      const form = document.createElement('form');
      form.innerHTML = `<table class="classify"><tbody>${ex.items.map((it, i) => `<tr><td>${inline(it.text)}</td><td><select aria-label="Choice for item ${i + 1}" data-i="${i}"><option value="">Choose…</option>${ex.options.map((o, j) => `<option value="${j}">${esc(X(o))}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table>${actions()}`;
      body.append(form, fb, hintBox);
      wireHint(form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const sels = [...form.querySelectorAll('select')];
        if (sels.some((s) => s.value === '')) return say(false, 'Choose an answer for every row.');
        const choices = sels.map((s) => +s.value);
        const r = E.gradeClassify(ex.items, choices);
        form.querySelectorAll('tr').forEach((tr, i) => { tr.classList.remove('right', 'wrong'); tr.classList.add(choices[i] === ex.items[i].answer ? 'right' : 'wrong'); });
        if (r.pass) { say(true, 'All correct.'); done(); } else say(false, `${r.bad.length} of ${ex.items.length} need another look (marked in red).`);
      });
      return;
    }

    if (ex.type === 'hazard') {
      const form = document.createElement('form');
      const picked = new Set();
      form.innerHTML = `<div class="cardgrid">${ex.items.map((it) => `<button type="button" data-id="${it.id}" aria-pressed="false">${inline(it.text)}</button>`).join('')}</div>${actions()}`;
      body.append(form, fb, hintBox);
      wireHint(form);
      form.querySelector('.cardgrid').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        const id = b.dataset.id;
        if (picked.has(id)) picked.delete(id); else picked.add(id);
        b.setAttribute('aria-pressed', String(picked.has(id)));
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const r = E.gradeHazard(ex.items, picked);
        form.querySelectorAll('.cardgrid button').forEach((b) => {
          const it = ex.items.find((x) => x.id === b.dataset.id);
          b.classList.remove('right', 'wrong'); b.querySelector('.why')?.remove();
          const mark = (picked.has(it.id) === it.hazard) ? 'right' : 'wrong';
          b.classList.add(mark);
          b.insertAdjacentHTML('beforeend', `<span class="why">${it.hazard ? 'Unsafe: ' : 'Safe: '}${inline(it.why)}</span>`);
        });
        if (r.pass) { say(true, 'You found them all.'); done(); }
        else say(false, `${r.missed.length ? `${r.missed.length} unsafe situation${r.missed.length > 1 ? 's' : ''} missed. ` : ''}${r.wrong.length ? `${r.wrong.length} safe situation${r.wrong.length > 1 ? 's' : ''} wrongly marked.` : ''}`);
      });
    }
  }

  route();
})();
