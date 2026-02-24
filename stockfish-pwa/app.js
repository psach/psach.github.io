/* global PDFLib, pdfjsLib, JSZip */
// Basic SPA tabs
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.mjs';
const tabs = document.querySelectorAll('.tab-btn');
const views = document.querySelectorAll('.tab');
for (const btn of tabs) btn.addEventListener('click', () => {
  tabs.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  views.forEach(v => v.classList.remove('active'));
  document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
});

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; document.getElementById('installPWA').style.display='inline-block'; });
document.getElementById('installPWA').addEventListener('click', async () => { if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; }});

// Utility functions
const $ = (sel) => document.querySelector(sel);
const readAsArrayBuffer = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsArrayBuffer(file);});
const readAsDataURL = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file);});
const downloadBlob = (blob, name) => { const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 2500); };

// Configure pdf.js worker (global build)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs';

/******************* Merge *******************/
const mergeState = { files: [], selectedIndex: -1 };
const mergeDrop = document.getElementById('mergeDrop');
const mergeInput = document.getElementById('mergeFiles');
const mergeList = document.getElementById('mergeList');

const renderMergeList = () => {
  mergeList.innerHTML = '';
  mergeState.files.forEach((f, i) => {
    const row = document.createElement('div'); row.className='file-item'+(i===mergeState.selectedIndex?' selected':'');
    const name = document.createElement('div'); name.textContent = `${i+1}. ${f.name}`; name.style.padding='.25rem .5rem';
    const size = document.createElement('div'); size.textContent = (f.size/1024/1024).toFixed(2)+' MB'; size.style.textAlign='right'; size.style.padding='.25rem .5rem';
    row.appendChild(name); row.appendChild(size);
    row.addEventListener('click', () => { mergeState.selectedIndex = i; renderMergeList(); });
    mergeList.appendChild(row);
  });
};

const handleMergeFiles = (files) => {
  for (const f of files) if (f.type==='application/pdf') mergeState.files.push(f);
  renderMergeList();
};

mergeDrop.addEventListener('dragover', (e)=>{e.preventDefault(); mergeDrop.classList.add('hover');});
mergeDrop.addEventListener('dragleave', ()=> mergeDrop.classList.remove('hover'));
mergeDrop.addEventListener('drop', (e)=>{e.preventDefault(); mergeDrop.classList.remove('hover'); handleMergeFiles(e.dataTransfer.files);});
mergeInput.addEventListener('change', (e)=> handleMergeFiles(e.target.files));

$('#mergeUp').addEventListener('click', ()=>{ const i=mergeState.selectedIndex; if(i>0){ [mergeState.files[i-1], mergeState.files[i]] = [mergeState.files[i], mergeState.files[i-1]]; mergeState.selectedIndex=i-1; renderMergeList(); }});
$('#mergeDown').addEventListener('click', ()=>{ const i=mergeState.selectedIndex; if(i>=0 && i<mergeState.files.length-1){ [mergeState.files[i+1], mergeState.files[i]] = [mergeState.files[i], mergeState.files[i+1]]; mergeState.selectedIndex=i+1; renderMergeList(); }});
$('#mergeRemove').addEventListener('click', ()=>{ const i=mergeState.selectedIndex; if(i>=0){ mergeState.files.splice(i,1); mergeState.selectedIndex=-1; renderMergeList(); }});

$('#mergeGo').addEventListener('click', async () => {
  if (!mergeState.files.length) return alert('Add PDF files to merge.');
  const out = await PDFLib.PDFDocument.create();
  for (const f of mergeState.files) {
    const bytes = new Uint8Array(await readAsArrayBuffer(f));
    const doc = await PDFLib.PDFDocument.load(bytes);
    const pages = await out.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => out.addPage(p));
  }
  const pdfBytes = await out.save();
  downloadBlob(new Blob([pdfBytes], {type:'application/pdf'}), $('#mergeOutName').value || 'merged.pdf');
});

/******************* Split *******************/
const splitDrop = document.getElementById('splitDrop');
const splitInput = document.getElementById('splitFile');
let splitFileRef = null, splitDoc = null, splitPageCount = 0;

const handleSplitFile = async (file) => {
  if (!file) return;
  try {
    const bytes = new Uint8Array(await readAsArrayBuffer(file));
    splitDoc = await PDFLib.PDFDocument.load(bytes);
    splitPageCount = splitDoc.getPageCount();
    splitFileRef = file;
    alert(`Loaded ${file.name} with ${splitPageCount} pages.`);
  } catch (e) { console.error(e); alert('Failed to load PDF. Is it encrypted?'); }
};

splitDrop.addEventListener('drop', (e)=>{e.preventDefault(); handleSplitFile(e.dataTransfer.files[0]);});
splitDrop.addEventListener('dragover', (e)=>e.preventDefault());
splitInput.addEventListener('change', (e)=> handleSplitFile(e.target.files[0]));

function parseRanges(input, max) {
  // returns array of [start,end] 1-based inclusive
  const ranges = [];
  if (!input) return ranges;
  for (const part of input.split(',').map(s=>s.trim()).filter(Boolean)) {
    if (part.includes('-')) {
      const [a,b] = part.split('-');
      const start = Math.max(1, parseInt(a||'1',10));
      const end = Math.min(max, b ? parseInt(b,10) : max);
      if (!isNaN(start) && !isNaN(end) && start<=end) ranges.push([start,end]);
    } else {
      const p = parseInt(part,10); if(!isNaN(p) && p>=1 && p<=max) ranges.push([p,p]);
    }
  }
  return ranges;
}

$('#splitGo').addEventListener('click', async () => {
  if (!splitDoc) return alert('Load a PDF first.');
  const ranges = parseRanges($('#splitRanges').value, splitPageCount);
  if (!ranges.length) return alert('Enter valid ranges.');
  const srcBytes = await splitDoc.save();
  const src = await PDFLib.PDFDocument.load(srcBytes); // fresh instance
  const tasks = [];
  for (const [a,b] of ranges) {
    tasks.push((async ()=>{
      const out = await PDFLib.PDFDocument.create();
      const pages = await out.copyPages(src, Array.from({length:b-a+1}, (_,i)=>a-1+i));
      pages.forEach(p=>out.addPage(p));
      const bytes = await out.save();
      downloadBlob(new Blob([bytes], {type:'application/pdf'}), `split_${a}-${b}.pdf`);
    })());
  }
  await Promise.all(tasks);
});

/******************* Organize (reorder & rotate) *******************/
let org = { file:null, bytes:null, doc:null, thumbs:[], order:[], rotate:[] };
const orgDrop = document.getElementById('orgDrop');
const orgInput = document.getElementById('orgFile');
const thumbsEl = document.getElementById('thumbs');
let orgSelectedIndex = -1;

async function loadOrgFile(file){
  try{
    const bytes = new Uint8Array(await readAsArrayBuffer(file));
    const doc = await PDFLib.PDFDocument.load(bytes);
    org = { file, bytes, doc, thumbs:[], order: doc.getPageIndices().slice(), rotate: doc.getPageIndices().map(()=>0) };
    // render thumbs with pdf.js
    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;
    thumbsEl.innerHTML = '';
    for (let i=1;i<=pdf.numPages;i++){
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.2 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const wrap = document.createElement('div'); wrap.className='thumb'; wrap.draggable=true; wrap.dataset.index = String(i-1);
      wrap.appendChild(canvas);
      const cap = document.createElement('div'); cap.textContent = `Page ${i}`; cap.style.color='#bbb'; cap.style.fontSize='.85rem';
      wrap.appendChild(cap);
      wrap.addEventListener('click', ()=>{ thumbsEl.querySelectorAll('.thumb').forEach(t=>t.classList.remove('selected')); wrap.classList.add('selected'); orgSelectedIndex = i-1; });
      wrap.addEventListener('dragstart', (e)=>{ e.dataTransfer.setData('text/plain', String(i-1)); });
      wrap.addEventListener('dragover', (e)=> e.preventDefault());
      wrap.addEventListener('drop', (e)=>{
        e.preventDefault();
        const from = parseInt(e.dataTransfer.getData('text/plain'),10);
        const to = parseInt(wrap.dataset.index,10);
        const [moved] = org.order.splice(org.order.indexOf(from),1);
        const toPos = org.order.indexOf(to);
        org.order.splice(toPos,0,moved);
        renderOrgThumbs();
      });
      thumbsEl.appendChild(wrap);
    }
  }catch(err){ console.error(err); alert('Failed to load PDF (maybe encrypted).'); }
}

// Simpler reorder: clicking selects; use Up/Down keyboard
thumbsEl.addEventListener('keydown', (e)=>{
  if (org.doc==null) return;
  if (orgSelectedIndex<0) return;
  const idx = org.order.indexOf(orgSelectedIndex);
  if (e.key==='ArrowUp' && idx>0){ [org.order[idx-1],org.order[idx]]=[org.order[idx],org.order[idx-1]]; renderOrgThumbs(); }
  if (e.key==='ArrowDown' && idx<org.order.length-1){ [org.order[idx+1],org.order[idx]]=[org.order[idx],org.order[idx+1]]; renderOrgThumbs(); }
});

function renderOrgThumbs(){
  // Re-render thumbnails in current order
  const nodes = Array.from(thumbsEl.children);
  const map = new Map(nodes.map(n=>[parseInt(n.dataset.index,10), n]));
  thumbsEl.innerHTML='';
  for (const idx of org.order){ const n = map.get(idx); if (n) thumbsEl.appendChild(n); }
}

orgDrop.addEventListener('dragover', e=>e.preventDefault());
orgDrop.addEventListener('drop', e=>{ e.preventDefault(); loadOrgFile(e.dataTransfer.files[0]); });
orgInput.addEventListener('change', e=> loadOrgFile(e.target.files[0]));

$('#rotateLeft').addEventListener('click', ()=>{ if(orgSelectedIndex<0) return; org.rotate[orgSelectedIndex] = (org.rotate[orgSelectedIndex] + 270) % 360; alert(`Will rotate page ${orgSelectedIndex+1} left`); });
$('#rotateRight').addEventListener('click', ()=>{ if(orgSelectedIndex<0) return; org.rotate[orgSelectedIndex] = (org.rotate[orgSelectedIndex] + 90) % 360; alert(`Will rotate page ${orgSelectedIndex+1} right`); });

$('#orgExport').addEventListener('click', async ()=>{
  if (!org.doc) return alert('Load a PDF first.');
  const src = await PDFLib.PDFDocument.load(org.bytes);
  const out = await PDFLib.PDFDocument.create();
  const pages = await out.copyPages(src, org.order);
  pages.forEach((p, i) => {
    const srcIndex = org.order[i];
    const deg = org.rotate[srcIndex]||0;
    if (deg) p.setRotation(PDFLib.degrees(deg));
    out.addPage(p);
  });
  const bytes = await out.save();
  downloadBlob(new Blob([bytes], {type:'application/pdf'}), 'organized.pdf');
});

/******************* Compress (rasterize) *******************/
function qualityToScale(q){ return q==='low'?0.6 : q==='high'?1.2 : 0.9; }
$('#cmpGo').addEventListener('click', async ()=>{
  const file = $('#cmpFile').files[0]; if(!file) return alert('Choose a PDF.');
  const bytes = new Uint8Array(await readAsArrayBuffer(file));
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const out = await PDFLib.PDFDocument.create();
  for (let i=1;i<=pdf.numPages;i++){
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: qualityToScale($('#cmpQuality').value) });
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    const imgBytes = await (await fetch(dataUrl)).arrayBuffer();
    const img = await out.embedJpg(imgBytes);
    const pageDim = [img.width, img.height];
    const p = out.addPage(pageDim);
    p.drawImage(img, {x:0, y:0, width:img.width, height:img.height});
  }
  const pdfBytes = await out.save();
  downloadBlob(new Blob([pdfBytes], {type:'application/pdf'}), $('#cmpOutName').value || 'compressed.pdf');
});

/******************* Images → PDF *******************/
function mmToPt(mm){ return (mm/25.4)*72; }
function pageSizePreset(preset){
  if (preset==='A4') return [595.28, 841.89]; // 210mm × 297mm in points
  if (preset==='Letter') return [612, 792];    // 8.5in × 11in
  return null; // fit to image
}

$('#i2pGo').addEventListener('click', async ()=>{
  const files = Array.from($('#i2pFiles').files || [] ).filter(f=>f.type.startsWith('image/'));
  if (!files.length) return alert('Choose images.');
  const out = await PDFLib.PDFDocument.create();
  const margin = mmToPt(parseFloat($('#i2pMargin').value||'0'));
  const preset = $('#i2pSize').value;
  for (const f of files){
    const bytes = new Uint8Array(await readAsArrayBuffer(f));
    let img, iw, ih;
    if (f.type==='image/jpeg' || f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg')){ img = await out.embedJpg(bytes); iw=img.width; ih=img.height; }
    else { img = await out.embedPng(bytes); iw=img.width; ih=img.height; }
    let pw, ph;
    const presetSize = pageSizePreset(preset);
    if (presetSize){ [pw,ph] = presetSize; }
    else { pw = iw + margin*2; ph = ih + margin*2; }
    const page = out.addPage([pw,ph]);
    const scale = Math.min((pw - margin*2)/iw, (ph - margin*2)/ih, 1);
    const w = iw*scale, h = ih*scale;
    const x = (pw - w)/2, y = (ph - h)/2;
    page.drawImage(img, {x, y, width:w, height:h});
  }
  const bytes = await out.save();
  downloadBlob(new Blob([bytes], {type:'application/pdf'}), $('#i2pOutName').value || 'images.pdf');
});

/******************* PDF → Images *******************/
$('#p2iGo').addEventListener('click', async ()=>{
  const file = $('#p2iFile').files[0]; if(!file) return alert('Choose a PDF.');
  const format = $('#p2iFormat').value; const dpi = parseInt($('#p2iDPI').value,10)||144;
  const bytes = new Uint8Array(await readAsArrayBuffer(file));
  const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  const zip = new JSZip();
  const ppi = 96; // CSS pixels per inch
  const factor = dpi/ppi;
  const preview = document.getElementById('p2iPreview'); preview.innerHTML='';
  for (let i=1;i<=pdf.numPages;i++){
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: factor });
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    canvas.width = Math.floor(viewport.width); canvas.height = Math.floor(viewport.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    let blob;
    if (format==='png') blob = await new Promise(res=> canvas.toBlob(res, 'image/png'));
    else blob = await new Promise(res=> canvas.toBlob(res, 'image/jpeg', 0.9));

    const arrayBuf = await blob.arrayBuffer();
    zip.file(`page_${i}.${format==='png'?'png':'jpg'}`, arrayBuf);

    const thumb = document.createElement('div'); thumb.className='thumb';
    const imgEl = document.createElement('img'); imgEl.src = URL.createObjectURL(blob); imgEl.style.width='100%';
    const cap = document.createElement('div'); cap.textContent = `Page ${i}`; cap.style.color='#bbb'; cap.style.fontSize='.85rem';
    thumb.appendChild(imgEl); thumb.appendChild(cap); preview.appendChild(thumb);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, (file.name.replace(/\.pdf$/i,'')||'pdf')+'_images.zip');
});


     // Initialize chess.js and chessboard.js
        const game = new Chess();
        const board = Chessboard('board', {
            draggable: true,
            position: 'start',
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        });

        // Load Stockfish
        const stockfish = new Worker('stockfish.js');

        // UI elements
        const statusElement = document.getElementById('status');

        // Update the board position after a piece is dropped
        function onDrop(source, target) {
            const move = game.move({ from: source, to: target, promotion: 'q' });

            // Illegal move
            if (move === null) {
                return 'snapback';
            }

            // Update status
            updateStatus();

            // Make the engine move
            setTimeout(makeEngineMove, 250);
        }

        // Update board position to match game state
        function onSnapEnd() {
            board.position(game.fen());
        }

        // Make a move using Stockfish
        function makeEngineMove() {
            if (game.game_over()) {
                updateStatus();
                return;
            }

            stockfish.postMessage(`position fen ${game.fen()}`);
            stockfish.postMessage('go depth 15');

            stockfish.onmessage = function(event) {
                const line = event.data;
                if (line.startsWith('bestmove')) {
                    const bestMove = line.split(' ')[1];
                    game.move({ from: bestMove.slice(0, 2), to: bestMove.slice(2, 4), promotion: 'q' });
                    board.position(game.fen());
                    updateStatus();
                }
            };
        }

        // Update the status element
        function updateStatus() {
            let status = '';

            if (game.in_checkmate()) {
                status = 'Checkmate! Game over.';
            } else if (game.in_draw()) {
                status = 'Draw! Game over.';
            } else {
                status = `Your move! ${game.turn() === 'w' ? 'White' : 'Black'} to move.`;
                if (game.in_check()) {
                    status += ' Check!';
                }
            }

            statusElement.textContent = status;
        }

        updateStatus();
		