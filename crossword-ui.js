// example/crossword-ui.js
// Interactive crossword editor built on top of clue-lite-nlp (UMD build).
// Includes optional Sarvam online extraction via chat completions.

(() => {
  const { createClueNLP, buildCrossword } = window.ClueLiteNLP;

  const $ = (id) => document.getElementById(id);
  const canvas = $('grid');
  const ctx = canvas.getContext('2d');

  const state = {
    nlp: createClueNLP({ minConfidence: 0.45, contextWindow: 3 }),
    rows: [],
    build: null,
    fill: null,
    cellSize: 28,
    pad: 18,
    dragWord: null,
    hoverCell: null,
    conflicts: [],
  };

  // Domain lexicon you can customize
  state.nlp.addWords({
    routeros: 'NOUN',
    rollback: 'NOUN',
    resilient: 'ADJ',
    migrate: 'VERB',
    'credit risk': 'NOUN'
  }).compile();

  function setStatus(msg) { $('status').textContent = msg || ''; }

  // API key handling: in-memory by default, optional sessionStorage.
  const KEY_STORAGE = 'clueLiteSarvamKey';
  function loadKeyFromSession() {
    try { return sessionStorage.getItem(KEY_STORAGE) || ''; } catch { return ''; }
  }
  function saveKeyToSession(key) {
    try { sessionStorage.setItem(KEY_STORAGE, key); } catch {}
  }
  function clearKeyFromSession() {
    try { sessionStorage.removeItem(KEY_STORAGE); } catch {}
  }

  // init key UI
  $('sarvamKey').value = loadKeyFromSession();
  $('keyWarn').style.display = 'none';

  $('rememberKey').addEventListener('change', () => {
    $('keyWarn').style.display = $('rememberKey').checked ? 'block' : 'none';
    if (!$('rememberKey').checked) clearKeyFromSession();
    else saveKeyToSession($('sarvamKey').value || '');
  });
  $('sarvamKey').addEventListener('input', () => {
    if ($('rememberKey').checked) saveKeyToSession($('sarvamKey').value || '');
  });

  function initFill(build) {
    state.fill = Array.from({ length: build.height }, () => Array.from({ length: build.width }, () => ''));
  }

  function computeCellFromEvent(ev) {
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const cs = state.cellSize;
    const gx = Math.floor((x - state.pad) / cs);
    const gy = Math.floor((y - state.pad) / cs);
    if (!state.build) return null;
    if (gx < 0 || gy < 0 || gx >= state.build.width || gy >= state.build.height) return null;
    return { x: gx, y: gy };
  }

  function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (!state.build) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px system-ui';
      ctx.fillText('Click “Auto build” to generate a crossword.', 18, 32);
      return;
    }

    const build = state.build;
    const cs = state.cellSize;

    const wPx = state.pad*2 + build.width*cs;
    const hPx = state.pad*2 + build.height*cs;
    if (canvas.width !== wPx || canvas.height !== hPx) {
      canvas.width = wPx;
      canvas.height = hPx;
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for (let y=0; y<build.height; y++) {
      for (let x=0; x<build.width; x++) {
        const cell = build.cells[y][x];
        const px = state.pad + x*cs;
        const py = state.pad + y*cs;

        ctx.fillStyle = cell.isBlack ? '#111827' : '#ffffff';
        ctx.fillRect(px, py, cs, cs);
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 1;
        ctx.strokeRect(px+0.5, py+0.5, cs, cs);

        if (!cell.isBlack && cell.number) {
          ctx.fillStyle = '#111827';
          ctx.font = '10px system-ui';
          ctx.fillText(String(cell.number), px+3, py+11);
        }

        const showAnswers = $('showAnswers').checked;
        if (!cell.isBlack) {
          const ch = showAnswers ? (cell.ch || '') : (state.fill?.[y]?.[x] || '');
          if (ch) {
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 14px system-ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(ch, px + cs/2, py + cs/2 + 2);
            ctx.textAlign = 'start';
            ctx.textBaseline = 'alphabetic';
          }
        }
      }
    }

    if (state.hoverCell) {
      const {x,y} = state.hoverCell;
      const px = state.pad + x*cs;
      const py = state.pad + y*cs;
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(px+1, py+1, cs-2, cs-2);
    }

    for (const c of state.conflicts) {
      const px = state.pad + c.x*cs;
      const py = state.pad + c.y*cs;
      ctx.fillStyle = 'rgba(239,68,68,0.25)';
      ctx.fillRect(px, py, cs, cs);
    }
  }

  function renderBank(rows) {
    const bank = $('bank');
    bank.innerHTML = '';
    rows.forEach(r => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.draggable = true;
      chip.textContent = `${r.answerKey} (${r.pos})`;
      chip.dataset.answerKey = r.answerKey;
      chip.dataset.answer = r.answer;
      chip.dataset.clue = r.clue;
      chip.dataset.pos = r.pos;

      chip.addEventListener('dragstart', (e) => {
        state.dragWord = {
          answerKey: chip.dataset.answerKey,
          answer: chip.dataset.answer,
          clue: chip.dataset.clue,
          pos: chip.dataset.pos
        };
        e.dataTransfer.setData('text/plain', chip.dataset.answerKey);
      });

      chip.addEventListener('dragend', () => {
        state.dragWord = null;
        state.hoverCell = null;
        render();
      });

      bank.appendChild(chip);
    });
  }

  function renderClues(build) {
    const across = $('across');
    const down = $('down');
    across.innerHTML = '';
    down.innerHTML = '';

    build.clues.across.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.number}. ${c.clue || '(no clue)'}${$('showAnswers').checked ? ' — ' + c.answer : ''}`;
      across.appendChild(li);
    });

    build.clues.down.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.number}. ${c.clue || '(no clue)'}${$('showAnswers').checked ? ' — ' + c.answer : ''}`;
      down.appendChild(li);
    });
  }

  function normalizeRows(rows) {
    // Filter & sort: prefer longer answers, drop too-short.
    return (rows || [])
      .filter(r => (r.answerKey || '').length >= 3)
      .map(r => ({
        pos: r.pos || 'NOUN',
        answer: r.answer || r.answerKey,
        answerKey: String(r.answerKey || '').toUpperCase().replace(/[^A-Z0-9]/g, ''),
        clue: r.clue || '',
        confidence: typeof r.confidence === 'number' ? r.confidence : 0.8,
        offsets: r.offsets || {start:0,end:0},
        tokenSpan: r.tokenSpan || {startToken:0,endToken:0}
      }))
      .filter(r => r.answerKey.length >= 3)
      .sort((a,b)=>b.answerKey.length - a.answerKey.length);
  }

  async function sarvamExtractRows(text) {
    const apiKey = $('sarvamKey').value.trim();
    let model = $('sarvamModel').value.trim() || 'sarvam-105b';

    // Sarvam docs commonly show sarvam-105b / sarvam-30b. If user enters 103b, try it; if fails, fallback.
    const endpoint = 'https://api.sarvam.ai/v1/chat/completions';

    const system = `You are an information extraction engine for crossword creation.\n\nReturn ONLY valid JSON (no markdown, no commentary).\nSchema: {\\"rows\\":[{\\"pos\\":\\"NOUN|VERB|ADJ\\",\\"answer\\":string,\\"answerKey\\":string,\\"clue\\":string,\\"confidence\\":number}]}\n\nRules:\n- Extract 10-30 answers from the text: nouns, verbs, adjectives.\n- answerKey MUST be uppercase A-Z0-9 only (remove spaces/punct).\n- clue must be crossword-like based on context of the input text (short).\n- confidence should be 0.5 to 0.99.\n- Ensure JSON parses strictly.\n`;

    const user = `Input text:\n${text}\n\nTask:\n1) Extract nouns, verbs, adjectives as crossword answers.\n2) Make a clue for each answer.\n3) Output JSON only.`;

    const body = {
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.2
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      // also send subscription key header for compatibility
      'api-subscription-key': apiKey
    };

    const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });

    if (!res.ok) {
      const txt = await res.text().catch(()=> '');
      const err = new Error(`Sarvam failed (${res.status}): ${txt.slice(0,200)}`);
      err.status = res.status;
      err.model = model;
      throw err;
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.reasoning_content;
    if (!content || typeof content !== 'string') {
      throw new Error('Sarvam response missing message.content');
    }

    // Parse JSON from model content
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // attempt to extract JSON substring
      const m = content.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else throw new Error('Sarvam output was not valid JSON');
    }

    if (!parsed || !Array.isArray(parsed.rows)) {
      throw new Error('Sarvam JSON schema invalid: missing rows[]');
    }

    return normalizeRows(parsed.rows);
  }

  async function buildFromText() {
    const text = $('text').value;
    const size = Number($('size').value || 15);
    const style = $('clueStyle').value;

    state.conflicts = [];
    setStatus('⏳ Building crossword...');

    let rows;

    const useSarvam = $('useSarvam').checked;
    const hasKey = ($('sarvamKey').value || '').trim().length > 0;

    if (useSarvam && hasKey) {
      try {
        setStatus('⏳ Calling Sarvam for extraction...');
        rows = await sarvamExtractRows(text);
        setStatus(`✅ Sarvam extracted ${rows.length} items.`);
      } catch (e) {
        console.warn(e);
        // fallback to offline
        setStatus(`⚠️ Sarvam failed (${e.status || ''}). Falling back to offline extraction...`);
        rows = null;
      }
    }

    if (!rows) {
      const cw = state.nlp.crossword(text, { style, maxRows: 200, contextWindow: 3, minConfidence: 0.45 });
      rows = normalizeRows(cw.rows);
      setStatus(`✅ Offline extracted ${rows.length} items.`);
    }

    state.rows = rows;

    state.build = buildCrossword(state.rows, { maxSize: size, preferIntersections: true });
    initFill(state.build);
    renderBank(state.rows);
    renderClues(state.build);

    setStatus(`Built grid ${state.build.width}×${state.build.height} with ${state.build.placements.length} placed words.`);
    render();
  }

  function validateGrid() {
    if (!state.build) return;
    const build = state.build;
    const conflicts = [];

    for (const p of build.placements) {
      const word = p.answerKey;
      const dx = p.dir === 'across' ? 1 : 0;
      const dy = p.dir === 'down' ? 1 : 0;
      for (let i=0;i<word.length;i++) {
        const x = p.x + dx*i;
        const y = p.y + dy*i;
        const cell = build.cells[y]?.[x];
        if (!cell || cell.isBlack) { conflicts.push({x,y}); continue; }
        if (cell.ch !== word[i]) conflicts.push({x,y});
      }
    }

    if (!$('showAnswers').checked && state.fill) {
      for (let y=0;y<build.height;y++) {
        for (let x=0;x<build.width;x++) {
          const cell = build.cells[y][x];
          if (cell.isBlack) continue;
          const user = (state.fill[y][x] || '').toUpperCase();
          if (!user) continue;
          if (cell.ch && user !== cell.ch) conflicts.push({x,y});
        }
      }
    }

    state.conflicts = dedupe(conflicts);
    setStatus(state.conflicts.length ? `⚠️ Conflicts: ${state.conflicts.length} cells highlighted.` : '✅ No conflicts found.');
    render();
  }

  function dedupe(arr) {
    const s = new Set();
    const out = [];
    for (const a of arr) {
      const k = a.x + ',' + a.y;
      if (s.has(k)) continue;
      s.add(k);
      out.push(a);
    }
    return out;
  }

  // drag/drop placement into existing grid
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    state.hoverCell = computeCellFromEvent(e);
    render();
  });
  canvas.addEventListener('dragleave', () => { state.hoverCell = null; render(); });
  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!state.build || !state.dragWord) return;
    const cell = computeCellFromEvent(e);
    if (!cell) return;

    const dir = $('orient').value;
    const word = state.dragWord.answerKey;

    const ok = tryPlaceIntoExisting(cell.x, cell.y, dir, word, state.dragWord);
    setStatus(ok ? '✅ Placed word.' : '❌ Cannot place here (conflict or out of bounds).');

    state.dragWord = null;
    state.hoverCell = null;
    validateGrid();
    renderClues(state.build);
    render();
  });

  function tryPlaceIntoExisting(x, y, dir, answerKey, meta) {
    const build = state.build;
    const dx = dir === 'across' ? 1 : 0;
    const dy = dir === 'down' ? 1 : 0;

    const endX = x + dx*(answerKey.length-1);
    const endY = y + dy*(answerKey.length-1);
    if (endX < 0 || endY < 0 || endX >= build.width || endY >= build.height) return false;

    for (let i=0;i<answerKey.length;i++) {
      const xx = x + dx*i;
      const yy = y + dy*i;
      const cell = build.cells[yy][xx];
      if (cell.isBlack) return false;
      if (cell.ch && cell.ch !== answerKey[i]) return false;
    }

    for (let i=0;i<answerKey.length;i++) {
      const xx = x + dx*i;
      const yy = y + dy*i;
      build.cells[yy][xx].ch = answerKey[i];
      build.cells[yy][xx].isBlack = false;
    }

    build.placements.push({ x, y, dir, answerKey, answer: meta.answer, clue: meta.clue, pos: meta.pos, number: null });
    build.clues = renumber(build);
    return true;
  }

  function renumber(build) {
    const width = build.width, height = build.height, cells = build.cells;
    for (let y=0;y<height;y++) for (let x=0;x<width;x++) cells[y][x].number = null;

    const isWhite = (x,y) => !cells[y][x].isBlack;
    const leftBlack = (x,y) => x===0 || cells[y][x-1].isBlack;
    const upBlack = (x,y) => y===0 || cells[y-1][x].isBlack;
    const hasRight = (x,y) => x+1<width && isWhite(x+1,y);
    const hasDown = (x,y) => y+1<height && isWhite(x,y+1);

    let num = 1;
    const numAt = Array.from({length:height}, ()=>Array(width).fill(null));

    for (let y=0;y<height;y++) {
      for (let x=0;x<width;x++) {
        if (!isWhite(x,y)) continue;
        const startsAcross = leftBlack(x,y) && hasRight(x,y);
        const startsDown = upBlack(x,y) && hasDown(x,y);
        if (startsAcross || startsDown) {
          numAt[y][x] = num;
          cells[y][x].number = num;
          num++;
        }
      }
    }

    for (const p of build.placements) p.number = numAt[p.y][p.x];

    const across = [];
    const down = [];
    for (const p of build.placements) {
      const entry = { number: p.number || 0, clue: p.clue || '', answer: p.answer };
      if (p.dir === 'across') across.push(entry);
      else down.push(entry);
    }
    across.sort((a,b)=>a.number-b.number);
    down.sort((a,b)=>a.number-b.number);
    return { across, down };
  }

  // typing mode
  canvas.addEventListener('pointerdown', (e) => {
    if (!state.build) return;
    state.hoverCell = computeCellFromEvent(e);
    render();
  });

  window.addEventListener('keydown', (e) => {
    if (!state.build || $('showAnswers').checked) return;
    if (!state.hoverCell) return;
    const {x,y} = state.hoverCell;
    const cell = state.build.cells[y][x];
    if (cell.isBlack) return;

    if (e.key === 'Backspace') {
      state.fill[y][x] = '';
      validateGrid();
      render();
      return;
    }

    const k = e.key.toUpperCase();
    if (/^[A-Z0-9]$/.test(k)) {
      state.fill[y][x] = k;
      if ($('orient').value === 'across' && x+1 < state.build.width) state.hoverCell = {x:x+1,y};
      if ($('orient').value === 'down' && y+1 < state.build.height) state.hoverCell = {x,y:y+1};
      validateGrid();
      render();
    }
  });

  // Export PNG
  async function exportPNG() {
    if (!state.build) return;
    const opts = {
      blank: $('expBlank').checked,
      clues: $('expClues').checked,
      answers: $('expAnswers').checked,
    };
    const tasks = [];
    if (opts.blank) tasks.push({ name: 'blank', showClues: false, showAnswers: false });
    if (opts.clues) tasks.push({ name: 'clues', showClues: true, showAnswers: false });
    if (opts.answers) tasks.push({ name: 'answers', showClues: true, showAnswers: true });

    for (const t of tasks) {
      const dataUrl = renderToPNG({ showClues: t.showClues, showAnswers: t.showAnswers });
      downloadDataUrl(dataUrl, `crossword-${t.name}.png`);
      await new Promise(r => setTimeout(r, 150));
    }

    setStatus('📦 Exported PNG(s).');
  }

  function renderToPNG({ showClues, showAnswers }) {
    const build = state.build;
    const cs = 34;
    const pad = 24;
    const cluePad = 18;

    const clueWidth = showClues ? 520 : 0;
    const width = pad*2 + build.width*cs + clueWidth;
    const height = pad*2 + Math.max(build.height*cs, showClues ? 520 : 0);

    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const g = c.getContext('2d');

    g.fillStyle = '#ffffff';
    g.fillRect(0,0,width,height);

    for (let y=0;y<build.height;y++) {
      for (let x=0;x<build.width;x++) {
        const cell = build.cells[y][x];
        const px = pad + x*cs;
        const py = pad + y*cs;

        g.fillStyle = cell.isBlack ? '#111827' : '#ffffff';
        g.fillRect(px, py, cs, cs);
        g.strokeStyle = '#111827';
        g.lineWidth = 1;
        g.strokeRect(px+0.5, py+0.5, cs, cs);

        if (!cell.isBlack && cell.number) {
          g.fillStyle = '#111827';
          g.font = '11px system-ui';
          g.fillText(String(cell.number), px+3, py+12);
        }

        if (!cell.isBlack && showAnswers && cell.ch) {
          g.fillStyle = '#111827';
          g.font = 'bold 16px system-ui';
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.fillText(cell.ch, px + cs/2, py + cs/2 + 3);
          g.textAlign = 'start';
          g.textBaseline = 'alphabetic';
        }
      }
    }

    if (showClues) {
      const x0 = pad*2 + build.width*cs + cluePad;
      let y0 = pad;
      g.fillStyle = '#111827';
      g.font = 'bold 16px system-ui';
      g.fillText('Across', x0, y0);
      y0 += 18;
      g.font = '12px system-ui';

      for (const c1 of build.clues.across) {
        const line = `${c1.number}. ${c1.clue || '(no clue)'}`;
        y0 = drawWrapped(g, line, x0, y0, clueWidth - 2*cluePad, 15);
        y0 += 2;
      }

      y0 += 12;
      g.font = 'bold 16px system-ui';
      g.fillText('Down', x0, y0);
      y0 += 18;
      g.font = '12px system-ui';

      for (const c2 of build.clues.down) {
        const line = `${c2.number}. ${c2.clue || '(no clue)'}`;
        y0 = drawWrapped(g, line, x0, y0, clueWidth - 2*cluePad, 15);
        y0 += 2;
      }
    }

    return c.toDataURL('image/png');
  }

  function drawWrapped(g, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(/\s+/);
    let line = '';
    for (let i=0;i<words.length;i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      if (g.measureText(test).width > maxWidth && line) {
        g.fillText(line, x, y);
        y += lineHeight;
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) {
      g.fillText(line, x, y);
      y += lineHeight;
    }
    return y;
  }

  function downloadDataUrl(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // wired buttons
  $('autoBtn').addEventListener('click', () => buildFromText());
  $('clearBtn').addEventListener('click', () => {
    state.build = null;
    state.rows = [];
    state.fill = null;
    $('bank').innerHTML = '';
    $('across').innerHTML = '';
    $('down').innerHTML = '';
    state.conflicts = [];
    setStatus('Cleared.');
    render();
  });

  $('validateBtn').addEventListener('click', validateGrid);
  $('exportBtn').addEventListener('click', exportPNG);
  $('showAnswers').addEventListener('change', () => {
    if (state.build) renderClues(state.build);
    validateGrid();
    render();
  });

  render();
})();
