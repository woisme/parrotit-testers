// The map of an app's screens, with the paths of the testers on it. No framework, no build step.
// Every value read from a run is put in the page as text, never as HTML.
"use strict";

const $ = (sel, root = document) => root.querySelector(sel);
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style") el.style.cssText = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) el.append(kid instanceof Node ? kid : String(kid));
  return el;
}
const svgEl = (tag, attrs = {}) => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};
const clone = (v) => JSON.parse(JSON.stringify(v));

const isParam = (v) => v !== null && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 1 && typeof v.param === "string";

function describeSelector(sel) {
  if (!sel) return "?";
  const idx = Number.isInteger(sel.index) ? ` #${sel.index + 1}` : "";
  if ("text" in sel) return (isParam(sel.text) ? `‹${sel.text.param}›` : `“${sel.text || "…"}”`) + idx;
  if ("id" in sel) return `#${String(sel.id).split("/").pop()}${idx}`;
  if ("point" in sel) return `point ${sel.point}`;
  return "?";
}

function describe(a) {
  switch (a.kind) {
    case "launchApp": return a.clearState ? "Launch app (clean)" : "Launch app";
    case "tapOn": return `Tap ${describeSelector(a.target)}`;
    case "longPressOn": return `Long press ${describeSelector(a.target)}`;
    case "inputText": return `Type ${isParam(a.text) ? `‹${a.text.param}›` : `“${a.text}”`}`;
    case "eraseText": return a.characters ? `Erase ${a.characters} chars` : "Erase text";
    case "pressKey": return a.key === "Back" ? "Back" : `Key ${a.key}`;
    case "swipe": return `Swipe ${String(a.direction).toLowerCase()}`;
    case "scrollUntilVisible": return `Scroll to ${describeSelector(a.target)}`;
    case "hideKeyboard": return "Hide keyboard";
    default: return a.kind;
  }
}

// ---------- Maestro flow, compiled in the page ----------
// Mirrors compileToMaestro of ECR's packages/adapter-maestro, to preview the flow and its
// source map. The authoritative compile is `ecr compile` (button "Compile with ECR").


// ---------- state: the run, the comments (trace.notes.json) and the checks (trace.json) of each tester ----------

const S = { data: null, notes: {}, traces: {}, saved: {}, savedTraces: {}, undo: [], redo: [], picking: null, mapSel: null, mapShot: null, mapHeat: "taps", mapPan: null, mapPath: null, mapDevice: null, mapDragged: false };
const persona = (key) => S.data.personas.find((p) => p.key === key);
const traceOf = (key) => S.traces[key] || persona(key).trace;
/** The trace of a tester, ready to take checks. Only checks are ever added: actions stay as explored. */
function editTrace(key) {
  if (!S.traces[key]) S.traces[key] = clone(persona(key).trace);
  if (!(key in S.savedTraces)) S.savedTraces[key] = JSON.stringify(persona(key).trace);
  return S.traces[key];
}
function notesOf(key) {
  if (!S.notes[key]) {
    const n = persona(key).notes;
    const notes = n && typeof n === "object" ? clone(n) : {};
    notes.screens = notes.screens && typeof notes.screens === "object" ? notes.screens : {};
    S.notes[key] = notes;
    if (!(key in S.saved)) S.saved[key] = JSON.stringify(notes);
  }
  return S.notes[key];
}
const dirtyNotes = () => Object.keys(S.notes).filter((k) => JSON.stringify(S.notes[k]) !== S.saved[k]);
const dirtyTraces = () => Object.keys(S.traces).filter((k) => JSON.stringify(S.traces[k]) !== S.savedTraces[k]);
const dirtyKeys = () => [...new Set([...dirtyNotes(), ...dirtyTraces()])];
const snapshot = () => JSON.stringify({ notes: S.notes, traces: S.traces });

function edit(fn) {
  S.undo.push(snapshot()); S.redo = [];
  if (S.undo.length > 200) S.undo.shift();
  fn();
  render();
}
function undoRedo(from, to) {
  if (!S[from].length) return;
  S[to].push(snapshot());
  const back = JSON.parse(S[from].pop());
  S.notes = back.notes; S.traces = back.traces;
  render();
}

// ---------- checks: what must be on a screen, or must not ----------
// A check becomes an oracle of the step that led to the screen (ecr.trace/0 checkpoints).
// "Known bug" records it as observed failed: the compiled flow is red until the bug is fixed.

/** The step after which a screenshot is shown: the one before the step taken from it, or the last step. */
function stepBefore(key, nn) {
  const t = traceOf(key);
  if (t.evidence && t.evidence.lastScreen === nn) return t.steps.length - 1;
  const i = t.steps.findIndex((st) => st.evidence && st.evidence.screen === nn);
  return i > 0 ? i - 1 : i;
}
/** A check names an element by its name, else by its id, never by a position or an index:
 * "visible" holds when any element with that name is on the screen, "not visible" when none is.
 * So it needs no count of elements that share a name, which a replay may count differently. */
function elementSelector(el) {
  if (el.label && !el.label.includes("${") && el.label.length <= 80 && !el.label.includes("\n") && el.label === el.label.trim()) return { text: el.label };
  if (el.id) return { id: el.id };
  return null;
}
const sharedName = (el, elements, target) => elements.filter((e) => ("text" in target ? e.label === target.text : e.id === target.id)).length > 1;
/** The human time the evaluation protocol of ECR measures: seconds from "Add a check" to the check, and how many. */
function countEffort(key, started) {
  const notes = notesOf(key);
  const e = notes.effort && typeof notes.effort === "object" ? notes.effort : { checkSeconds: 0, checksAdded: 0 };
  e.checkSeconds = Math.round((e.checkSeconds || 0) + Math.min(900, Math.max(0, (Date.now() - started) / 1000)));
  e.checksAdded = (e.checksAdded || 0) + 1;
  notes.effort = e;
}
function addCheck(key, nn, target, kind, bug, started) {
  edit(() => {
    countEffort(key, started);
    const t = editTrace(key);
    const step = t.steps[stepBefore(key, nn)];
    step.checkpoints = step.checkpoints || [];
    const used = new Set(t.steps.flatMap((st) => (st.checkpoints || []).map((o) => o.id)));
    let k = 1; while (used.has(`${step.id}-check${k}`)) k++;
    step.checkpoints.push({ id: `${step.id}-check${k}`, check: { kind, target }, ...(bug ? { observed: "failed" } : {}) });
  });
}
/** Checks of every tester on the screenshots of a screen. */
function checksOn(n) {
  const out = [], seen = new Set();
  for (const v of n.visits) {
    const i = stepBefore(v.key, v.nn);
    if (i < 0 || seen.has(`${v.key}#${i}`)) continue;
    seen.add(`${v.key}#${i}`);
    (traceOf(v.key).steps[i].checkpoints || []).forEach((o, j) => out.push({ o, j, i, key: v.key }));
  }
  return out;
}
const describeCheck = (o) => `${o.check.kind === "visible" ? "Must be visible" : "Must not be visible"}: ${describeSelector(o.check.target)}`;

// ---------- screens and taps ----------

const screenInfo = (nn, key) => (nn ? persona(key).screens[nn] : null);
const screenUrl = (key, nn) => {
  const s = screenInfo(nn, key);
  if (!s) return null;
  return s.url || `api/screen?persona=${encodeURIComponent(key)}&name=${encodeURIComponent(s.file)}`;
};
const groupTitle = (g) => (g && S.data.groups[g] && S.data.groups[g].title) || "";
/** The name of a screen: the name of its card (shared by most testers), else the screenshot's own title. */
const screenTitle = (info, nn) => (info && (groupTitle(info.group) || info.title)) || `Screen ${nn}`;

/** Taps and swipes on every screenshot of a group, in [0, 1] of the screen. */
function heatPoints(group, keys) {
  const pts = [];
  for (const key of keys) {
    const trace = traceOf(key);
    for (const step of trace.steps) {
      const ev = step.evidence;
      if (!ev || !ev.screen || !Array.isArray(ev.size)) continue;
      const s = screenInfo(ev.screen, key);
      if (!s || s.group !== group) continue;
      const [w, hgt] = ev.size;
      if (Array.isArray(ev.point)) pts.push({ x: ev.point[0] / w, y: ev.point[1] / hgt, key, weight: 1 });
      if (Array.isArray(ev.from) && Array.isArray(ev.to)) {
        for (let t = 0; t <= 1; t += 0.2) pts.push({ x: (ev.from[0] + (ev.to[0] - ev.from[0]) * t) / w, y: (ev.from[1] + (ev.to[1] - ev.from[1]) * t) / hgt, key, weight: 0.35 });
      }
    }
  }
  return pts;
}

// ---------- rendering ----------

// ---------- rendering ----------

// ---------- one screen in other forms: the merges made by hand or by Claude, kept in trace.notes.json ----------
// notes.sameAs = {NN: {key, nn, by}}: this screenshot shows the same screen as screenshot nn of tester key,
// in another language, text size, device or platform. The map shows one card; traces never change.

/** Applies every merge to the groups the server made, which stay in groups0 so a merge can be undone. */
function applyMerges() {
  if (!S.data.groups0) {
    S.data.groups0 = S.data.groups;
    for (const p of S.data.personas) for (const s of Object.values(p.screens)) s.group0 = s.group;
  }
  const order = Object.keys(S.data.groups0);
  const parent = {};
  const find = (g) => { while (parent[g]) g = parent[g]; return g; };
  for (const p of S.data.personas) {
    for (const [nn, to] of Object.entries(notesOf(p.key).sameAs || {})) {
      const a = p.screens[nn], o = to && persona(to.key), b = o && o.screens[to.nn];
      if (!a || !b) continue;
      const [ra, rb] = [find(a.group0), find(b.group0)].sort((x, y) => order.indexOf(x) - order.indexOf(y));
      if (ra !== rb) parent[rb] = ra;   // the group seen first keeps its name
    }
  }
  const groups = {};
  for (const g of order) {
    const r = find(g), from = S.data.groups0[g];
    if (!groups[r]) groups[r] = { title: S.data.groups0[r].title, count: 0, members: [] };
    groups[r].count += from.count;
    groups[r].members.push(...from.members);
  }
  for (const p of S.data.personas) for (const s of Object.values(p.screens)) s.group = find(s.group0);
  S.data.groups = groups;
}
/** The merges that join screenshots now on group g. */
function mergesOn(g) {
  const out = [];
  for (const p of S.data.personas) {
    for (const [nn, to] of Object.entries(notesOf(p.key).sameAs || {})) {
      const a = p.screens[nn];
      if (a && a.group === g) out.push({ key: p.key, nn, to });
    }
  }
  return out;
}
function mergeBox(map, n, shot) {
  const others = [...map.nodes.values()].filter((o) => o.g !== "start" && o.g !== n.g)
    .map((o) => ({ g: o.g, v: o.visits[0], name: screenTitle(screenInfo(o.visits[0].nn, o.visits[0].key), o.visits[0].nn) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const pick = h("select", { "aria-label": "Screen to merge with" }, h("option", { value: "" }, "Pick a screen…"),
    ...others.map((o) => h("option", { value: o.g }, `${o.name} (${traceOf(o.v.key).persona.id}, ${o.v.nn})`)));
  const merge = () => {
    const o = others.find((x) => x.g === pick.value);
    if (!o) return;
    edit(() => { const notes = notesOf(shot.key); notes.sameAs = notes.sameAs || {}; notes.sameAs[shot.nn] = { key: o.v.key, nn: o.v.nn, by: "you" }; S.mapShot = { key: shot.key, nn: shot.nn }; });
  };
  const made = mergesOn(n.g);
  return fold("merge", "Same screen as another card?", made.length, [
    h("p", { class: "hint", style: "margin:0 0 6px" }, "Another language, text size, device or platform: merge the two cards. Only the map changes, never a trace."),
    h("div", { class: "row" }, pick, h("button", { class: "fit", onclick: merge }, "Merge")),
    made.length ? h("ul", { class: "list", style: "margin-top:8px" }, ...made.map((m) => h("li", {},
      h("span", { class: "grow" }, `${traceOf(m.key).persona.id} ${m.nn} = ${persona(m.to.key) ? traceOf(m.to.key).persona.id : m.to.key} ${m.to.nn}`,
        h("span", { class: "when" }, m.to.by === "claude" ? "merged by Claude" : "merged by hand")),
      h("button", { onclick: () => edit(() => { const notes = notesOf(m.key); delete notes.sameAs[m.nn]; if (!Object.keys(notes.sameAs).length) delete notes.sameAs; S.mapShot = null; }) }, "Separate")))) : null]);
}

function render() {
  applyMerges();
  if (S.mapSel && S.mapSel !== "start" && !S.data.groups[S.mapSel]) {   // its card was merged into another
    const info = S.mapShot && screenInfo(S.mapShot.nn, S.mapShot.key);
    S.mapSel = info ? info.group : null;
  }
  $("#map-heat").value = S.mapHeat;
  renderTop();
  renderMap();
}

function renderTop() {
  $("#undo").disabled = !S.undo.length;
  $("#redo").disabled = !S.redo.length;
  const dirty = dirtyKeys().length > 0;
  const st = $("#status");
  if (!st.classList.contains("error") || dirty) {
    st.className = "status" + (dirty ? " dirty" : "");
    st.textContent = dirty ? "Unsaved changes" : st.dataset.saved || "";
  }
  $("#save").disabled = !dirty;
  document.body.classList.toggle("edited", dirty || S.undo.length > 0);
}

function pathButton(key) {
  const on = S.mapPath === key;
  return h("button", { class: on ? "fit on" : "fit", onclick: () => { S.mapPath = on ? null : key; renderMap(); } }, on ? "Hide path" : "Show path");
}

// ---------- heat maps ----------

const RAMP = (() => {
  const stops = [[0, [30, 60, 255, 0]], [0.25, [30, 140, 255, 150]], [0.5, [40, 220, 160, 200]], [0.75, [250, 220, 50, 230]], [1, [255, 60, 60, 250]]];
  const lut = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let k = 0; while (k < stops.length - 2 && t > stops[k + 1][0]) k++;
    const [t0, c0] = stops[k], [t1, c1] = stops[k + 1];
    const f = (t - t0) / (t1 - t0);
    for (let c = 0; c < 4; c++) lut[i * 4 + c] = c0[c] + (c1[c] - c0[c]) * f;
  }
  return lut;
})();


function paintHeat(canvas, pts, gain = 0.55) {
  const box = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(box.width * dpr));
  canvas.height = Math.max(1, Math.round(box.height * dpr));
  const g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  if (!pts.length) return;
  for (const p of pts) {
    const r = canvas.width * (p.r || 0.09);
    const x = p.x * canvas.width, y = p.y * canvas.height;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(0,0,0,${Math.min(1, gain * p.weight)})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  const img = g.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    if (!a) continue;
    d[i] = RAMP[a * 4]; d[i + 1] = RAMP[a * 4 + 1]; d[i + 2] = RAMP[a * 4 + 2]; d[i + 3] = RAMP[a * 4 + 3];
  }
  g.putImageData(img, 0, 0);
}

// ---------- the map: every screen of the app once, joined by the paths of all testers ----------

const runSize = (key) => { for (const st of traceOf(key).steps) if (st.evidence && Array.isArray(st.evidence.size)) return st.evidence.size; return [1080, 2400]; };

/** Nodes: screen groups. Edges: one screen to the next, counted over every tester. */
function buildMap() {
  const nodes = new Map(), edges = new Map(), paths = new Map();
  const node = (g) => { if (!nodes.has(g)) nodes.set(g, { g, visits: [], testers: new Set(), mapped: false, order: nodes.size }); return nodes.get(g); };
  node("start");
  // the map maker first, so the columns follow the app's structure rather than one persona's detour
  const order = [...S.data.personas].sort((a, b) => Number(!!b.mapper) - Number(!!a.mapper));
  for (const p of order) {
    const t = traceOf(p.key);
    const seq = [];
    t.steps.forEach((st, i) => {
      const nn = st.evidence && st.evidence.screen;
      const info = nn && screenInfo(nn, p.key);
      if (info) seq.push({ g: info.group, i, nn });
    });
    const last = t.evidence && t.evidence.lastScreen && screenInfo(t.evidence.lastScreen, p.key);
    if (last) seq.push({ g: last.group, i: t.steps.length, nn: t.evidence.lastScreen });
    let prev = "start";
    const path = ["start"];
    for (const v of seq) {
      const n = node(v.g);
      n.visits.push({ key: p.key, i: v.i, nn: v.nn });
      if (p.mapper) n.mapped = true; else n.testers.add(p.key);
      if (v.g !== prev) {
        const id = `${prev}>${v.g}`;
        if (!edges.has(id)) edges.set(id, { from: prev, to: v.g, count: 0, testers: new Set(), mapped: false, actions: new Map() });
        const e = edges.get(id);
        if (p.mapper) e.mapped = true; else { e.count++; e.testers.add(p.key); }
        const by = v.i > 0 ? describe(t.steps[v.i - 1].action) : "Launch app";
        e.actions.set(by, (e.actions.get(by) || 0) + 1);
        path.push(v.g);
      }
      prev = v.g;
    }
    paths.set(p.key, path);
  }
  // columns: shortest distance from the launch
  const depth = new Map([["start", 0]]);
  const queue = ["start"];
  while (queue.length) {
    const g = queue.shift();
    for (const e of edges.values()) if (e.from === g && !depth.has(e.to)) { depth.set(e.to, depth.get(g) + 1); queue.push(e.to); }
  }
  for (const n of nodes.values()) n.depth = depth.has(n.g) ? depth.get(n.g) : 1;
  return { nodes, edges, paths };
}

const CARD_W = 168, IMG_W = 152, COL_GAP = 110, SUB_GAP = 28, ROW_GAP = 40, START_W = 110, MAX_ROWS = 3;

/** Columns: steps from the launch. A long column wraps into several, MAX_ROWS cards high, so the map
 * reads left to right instead of as one tall strip. */
function layoutMap(map) {
  const cols = new Map();
  for (const n of map.nodes.values()) { if (!cols.has(n.depth)) cols.set(n.depth, []); cols.get(n.depth).push(n); }
  const aspect = (() => { const s = runSize(focusKey() || S.data.personas[0].key); return s[1] / s[0]; })();
  const cardH = Math.round(IMG_W * aspect) + 58;
  let maxRows = 1;
  for (const list of cols.values()) { list.sort((a, b) => a.order - b.order); maxRows = Math.max(maxRows, Math.min(MAX_ROWS, list.length)); }
  const height = maxRows * cardH + (maxRows - 1) * ROW_GAP;
  let x = 0;
  for (const d of [...cols.keys()].sort((a, b) => a - b)) {
    const list = cols.get(d);
    if (d === 0) {
      for (const n of list) { n.x = 0; n.w = START_W; n.h = 44; n.y = height / 2 - 22; }
      x = START_W + COL_GAP;
      continue;
    }
    const subs = Math.ceil(list.length / MAX_ROWS);
    list.forEach((n, i) => {
      const sub = Math.floor(i / MAX_ROWS), row = i % MAX_ROWS;
      const inSub = Math.min(MAX_ROWS, list.length - sub * MAX_ROWS);
      const colH = inSub * cardH + (inSub - 1) * ROW_GAP;
      n.x = x + sub * (CARD_W + SUB_GAP);
      n.w = CARD_W;
      n.h = cardH;
      n.y = (height - colH) / 2 + row * (cardH + ROW_GAP);
    });
    x += subs * CARD_W + (subs - 1) * SUB_GAP + COL_GAP;
  }
  for (const n of map.nodes.values()) n.y += 100;
  return { width: x - COL_GAP + 20, height: height + 150, cardH };
}

/** Findings of every tester whose screenshots belong to this screen. */
function findingsOn(n) {
  const out = [];
  for (const p of S.data.personas) {
    const nns = new Set(n.visits.filter((v) => v.key === p.key).map((v) => String(v.nn)));
    for (const iss of (p.findings && p.findings.issues) || []) if ((iss.screens || []).some((x) => nns.has(String(x)))) out.push({ ...iss, key: p.key });
  }
  return out;
}
function screenComments(n) {
  const out = [];
  const seen = new Set();
  for (const v of n.visits) {
    const id = `${v.key}#${v.nn}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const list = (notesOf(v.key).screens[v.nn] || []);
    list.forEach((c, j) => out.push({ c, j, key: v.key, nn: v.nn }));
  }
  return out;
}

/** Where taps are likely, when testers did not tap enough: the tappable elements, weighted by
 * their size and by how often testers tapped the same name or id elsewhere in the app. A model
 * can replace it: NN.saliency.json next to the screenshot. */
function estimatedPoints(key, nn) {
  const info = screenInfo(nn, key);
  if (!info) return [];
  if (Array.isArray(info.saliency)) return info.saliency.map(([x, y, w]) => ({ x, y, weight: w, r: 0.07 }));
  const [W, H] = runSize(key);
  const pop = new Map();
  for (const p of S.data.personas) for (const st of traceOf(p.key).steps) {
    const tg = st.action && st.action.target;
    if (!tg) continue;
    if (typeof tg.text === "string") pop.set(`t:${tg.text}`, (pop.get(`t:${tg.text}`) || 0) + 1);
    if (typeof tg.id === "string") pop.set(`i:${tg.id}`, (pop.get(`i:${tg.id}`) || 0) + 1);
  }
  const maxPop = Math.max(1, ...pop.values());
  return info.elements.filter((e) => e.clickable).map((e) => {
    const [x1, y1, x2, y2] = e.bounds;
    const area = ((x2 - x1) * (y2 - y1)) / (W * H);
    const used = ((pop.get(`t:${e.label}`) || 0) + (pop.get(`i:${e.id}`) || 0)) / maxPop;
    return { x: (x1 + x2) / 2 / W, y: (y1 + y2) / 2 / H, weight: 0.25 + 0.35 * Math.min(1, Math.sqrt(area) * 2.5) + 0.6 * used,
      r: Math.max(0.05, Math.min(0.2, Math.min(x2 - x1, y2 - y1) / W * 0.8)) };
  });
}

/** A persona's screenshot first: it carries real taps, and comments go to that persona's notes. */
const firstVisit = (n) => n.visits.find((v) => !persona(v.key).mapper) || n.visits[0];
const personaKeys = () => S.data.personas.filter((p) => !p.mapper).map((p) => p.key);

// ---------- one color per tester, in the order of the run (the first three match the launch video) ----------
const PALETTE = ["#5aa2ff", "#b98aff", "#ff7aa8", "#4fd1a5", "#ffb84d", "#5ad1e6", "#e6d95a", "#ff8a5a", "#9ad15a", "#d18aff"];
const colorOf = (key) => { const i = personaKeys().indexOf(key); return i < 0 ? "#6b7686" : PALETTE[i % PALETTE.length]; };

// ---------- devices: each tester's phone or tablet, and its shape on the map ----------
const deviceOf = (key) => { const c = (traceOf(key).persona || {}).context || {}; const [w, h] = runSize(key); return c.device || `${w} × ${h}`; };
const devices = () => [...new Set(personaKeys().map(deviceOf))];
/** The tester whose screen shape the map takes: the chosen path, else the first tester of the chosen device. */
const focusKey = () => S.mapPath || (S.mapDevice && personaKeys().find((k) => deviceOf(k) === S.mapDevice)) || null;
/** The taps the heat map counts: the chosen tester's, else every tester on the chosen device, else all. */
const heatKeys = () => S.mapPath ? (persona(S.mapPath).mapper ? [] : [S.mapPath]) : personaKeys().filter((k) => !S.mapDevice || deviceOf(k) === S.mapDevice);
/** The screenshot a card shows: the chosen tester's or device's when it saw this screen. matched is false when it did not. */
function visitFor(n) {
  const want = S.mapPath ? (v) => v.key === S.mapPath : S.mapDevice ? (v) => !persona(v.key).mapper && deviceOf(v.key) === S.mapDevice : null;
  if (!want) return { visit: firstVisit(n), matched: true };
  const v = n.visits.find(want);
  return v ? { visit: v, matched: true } : { visit: firstVisit(n), matched: false };
}

function mapPoints(n, key, nn, mode = S.mapHeat) {
  const pts = [];
  if (mode === "off") return pts;
  if (mode === "taps" || mode === "both") pts.push(...heatPoints(n.g, heatKeys()));
  if (mode === "estimated" || (mode === "both" && pts.filter((p) => p.weight === 1).length < 3)) pts.push(...estimatedPoints(key, nn).map((p) => ({ ...p, weight: p.weight * (mode === "both" ? 0.6 : 1) })));
  return pts;
}

function renderMap() {
  const map = buildMap();
  const box = layoutMap(map);
  const world = $("#map-world");
  world.style.width = `${box.width}px`;
  world.style.height = `${box.height}px`;
  if (S.mapSel && !map.nodes.has(S.mapSel)) S.mapSel = null;

  // edges
  const svg = svgEl("svg", { width: box.width, height: box.height, class: "map-edges" });
  const defs = svgEl("defs");
  for (const [id, color] of [["map-arrow", "#6b7686"], ...personaKeys().map((k, i) => [`map-arrow-${i}`, colorOf(k)])]) {
    const marker = svgEl("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 12, markerHeight: 12, markerUnits: "userSpaceOnUse", orient: "auto" });
    marker.append(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: color }));
    defs.append(marker);
  }
  svg.append(defs);
  const maxCount = Math.max(1, ...[...map.edges.values()].map((e) => e.testers.size));
  // one tester's path, when chosen: its arrows stand out, the rest fades
  const trail = S.mapPath && map.paths.get(S.mapPath);
  const pathEdges = new Set(), pathNodes = new Set(trail || []);
  if (trail) for (let k = 1; k < trail.length; k++) pathEdges.add(`${trail[k - 1]}>${trail[k]}`);
  const labels = [];
  for (const e of map.edges.values()) {
    const a = map.nodes.get(e.from), b = map.nodes.get(e.to);
    const on = trail ? pathEdges.has(`${e.from}>${e.to}`) : S.mapSel && (e.from === S.mapSel || e.to === S.mapSel);
    let d, lx, ly;
    if (b.x > a.x) {
      const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x - 4, y2 = b.y + b.h / 2, mx = (x1 + x2) / 2;
      d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`; lx = mx; ly = (y1 + y2) / 2;
    } else if (b.x === a.x) {   // same column: around the right side
      const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x + b.w + 4, y2 = b.y + b.h / 2, out = a.x + a.w + 60;
      d = `M${x1},${y1} C${out},${y1} ${out},${y2} ${x2},${y2}`; lx = out - 14; ly = (y1 + y2) / 2;
    } else {   // back to an earlier screen: an arc over the cards, or under them for a low card
      const above = (a.y + a.h / 2 + b.y + b.h / 2) / 2 <= box.height / 2;
      const x1 = a.x + a.w / 2, x2 = b.x + b.w / 2 + 12;
      const y1 = above ? a.y : a.y + a.h, y2 = above ? b.y - 4 : b.y + b.h + 4;
      const dip = above ? Math.min(y1, y2) - 40 - Math.abs(x1 - x2) * 0.1 : Math.max(y1, y2) + 40 + Math.abs(x1 - x2) * 0.1;
      d = `M${x1},${y1} C${x1},${dip} ${x2},${dip} ${x2},${y2}`; lx = (x1 + x2) / 2; ly = (y1 + y2) / 8 + 0.75 * dip;
    }
    const title = (e.testers.size ? `${e.testers.size} tester${e.testers.size > 1 ? "s" : ""}, ${e.count} time${e.count > 1 ? "s" : ""}` : "Only the map maker went this way") + "\n" + [...e.actions].map(([k, v]) => `${k} (${v})`).join("\n");
    if (!e.testers.size) {   // only the map maker: dashed gray
      const path = svgEl("path", { d, fill: "none", stroke: "#4a5361", "stroke-width": 1.5, "stroke-dasharray": "6 6", "marker-end": "url(#map-arrow)", opacity: trail ? 0.15 : on ? 0.9 : 0.45 });
      const t = svgEl("title"); t.textContent = title; path.append(t);
      svg.append(path);
      continue;
    }
    // one lane per tester, in its color, side by side: 7.5 px apart, centred on the edge
    const lanes = personaKeys().filter((k) => e.testers.has(k));
    const pts = d.match(/-?\d+(\.\d+)?/g).map(Number);
    const [sx, sy, ex, ey] = [pts[0], pts[1], pts[6], pts[7]];
    const len = Math.hypot(ex - sx, ey - sy) || 1, nx = -(ey - sy) / len, ny = (ex - sx) / len;
    lanes.forEach((k, li) => {
      const off = (li - (lanes.length - 1) / 2) * 7.5;
      const q = pts.map((v, vi) => v + off * (vi % 2 ? ny : nx));
      const dl = `M${q[0]},${q[1]} C${q[2]},${q[3]} ${q[4]},${q[5]} ${q[6]},${q[7]}`;
      const mine = trail ? k === S.mapPath : true;
      const path = svgEl("path", { d: dl, fill: "none", stroke: colorOf(k), "stroke-width": 5, "stroke-linecap": "round",
        "marker-end": `url(#map-arrow-${personaKeys().indexOf(k)})`, opacity: trail ? (mine && on ? 1 : 0.1) : on ? 1 : 0.7 });
      const t = svgEl("title"); t.textContent = `${traceOf(k).persona.id}\n${title}`; path.append(t);
      svg.append(path);
    });
  }

  // nodes
  const cards = [...map.nodes.values()].map((n) => {
    if (n.g === "start") return h("div", { class: "map-start", style: `left:${n.x}px;top:${n.y}px;width:${n.w}px` }, "Launch");
    const { visit: rep, matched } = visitFor(n);
    const faded = (trail && !pathNodes.has(n.g)) || !matched;
    const info = screenInfo(rep.nn, rep.key);
    const taps = heatPoints(n.g, heatKeys()).filter((p) => p.weight === 1).length;
    const fnd = findingsOn(n), com = screenComments(n).filter((x) => !x.c.resolved);
    const canvas = h("canvas", {});
    const card = h("button", { class: `map-node${S.mapSel === n.g ? " sel" : ""}${n.testers.size ? "" : " unreached"}${faded ? " faded" : ""}`, style: `left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px`,
      onclick: (ev) => { if (S.mapDragged) return; S.mapSel = n.g; S.mapShot = null; renderMap(); ev.stopPropagation(); } },
      h("div", { class: "thumb", style: `height:${n.h - 58}px` }, h("img", { src: screenUrl(rep.key, rep.nn), alt: "", class: matched ? "" : "other" }), canvas),
      h("span", { class: "t" }, screenTitle(info, rep.nn)),
      h("span", { class: "m" }, n.testers.size ? h("span", { class: "dots", title: personaKeys().filter((k) => n.testers.has(k)).map((k) => traceOf(k).persona.id).join(", ") },
          ...personaKeys().filter((k) => n.testers.has(k)).map((k) => h("i", { style: `background:${colorOf(k)}` })), ` ${taps} tap${taps === 1 ? "" : "s"}`) : h("span", { class: "robot-only" }, "Robot only"),
        !matched && !S.mapPath ? h("span", { class: "chip" }, "Not seen on this device") : null,
        fnd.length ? h("span", { class: "chip bad", title: fnd.map((f) => f.title).join("\n") }, `${fnd.length} finding${fnd.length > 1 ? "s" : ""}`) : null,
        com.length ? h("span", { class: "chip", title: com.map((x) => x.c.text).join("\n") }, `✎ ${com.length}`) : null));
    if (matched) requestAnimationFrame(() => paintHeat(canvas, mapPoints(n, rep.key, rep.nn), 0.6));
    return card;
  });
  world.replaceChildren(svg, ...labels, ...cards);
  const devs = devices();
  const devPick = $("#map-device");
  devPick.closest("label").hidden = devs.length < 2 && !S.mapDevice;
  devPick.replaceChildren(h("option", { value: "" }, "All devices"), ...devs.map((d) => {
    const n = personaKeys().filter((k) => deviceOf(k) === d).length;
    return h("option", { value: d, selected: d === S.mapDevice }, `${d} (${n} tester${n > 1 ? "s" : ""})`);
  }));
  const robot = S.data.personas.find((p) => p.mapper);
  $("#map-testers").replaceChildren(
    h("button", { class: `tester-chip${S.mapPath ? "" : " on"}`, onclick: () => { S.mapPath = null; renderMap(); } }, "All"),
    ...personaKeys().map((k) => h("button", { class: `tester-chip${S.mapPath === k ? " on" : ""}`, title: `Show only ${traceOf(k).persona.id}'s path`,
      onclick: () => { S.mapPath = S.mapPath === k ? null : k; renderMap(); } }, h("i", { style: `background:${colorOf(k)}` }), traceOf(k).persona.id)),
    robot ? h("button", { class: `tester-chip robot${S.mapPath === robot.key ? " on" : ""}`, title: "Show only the robot's paths",
      onclick: () => { S.mapPath = S.mapPath === robot.key ? null : robot.key; renderMap(); } }, h("i", {}), "robot") : null);
  applyPan(box);
  renderMapSide(map);
}

function applyPan(box) {
  const view = $("#map-canvas");
  if (!S.mapPan) {
    const vw = view.clientWidth, vh = view.clientHeight;
    // the whole map when it fits at a readable size, else readable from the launch on the left
    const k = Math.max(S.fitAll ? 0.15 : 0.6, Math.min(1, (vw - 40) / box.width, (vh - 40) / box.height));
    S.mapPan = { k, x: Math.max(20, (vw - box.width * k) / 2), y: Math.max(10, (vh - box.height * k) / 2) };
  }
  $("#map-world").style.transform = `translate(${S.mapPan.x}px, ${S.mapPan.y}px) scale(${S.mapPan.k})`;
}

function wireMap() {
  const view = $("#map-canvas");
  let drag = null;
  view.addEventListener("pointerdown", (e) => { if (e.button !== 0) return; drag = { x: e.clientX, y: e.clientY, px: S.mapPan.x, py: S.mapPan.y, moved: false }; S.mapDragged = false; });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) { drag.moved = true; S.mapDragged = true; view.classList.add("panning"); }
    if (drag.moved) { S.mapPan.x = drag.px + dx; S.mapPan.y = drag.py + dy; $("#map-world").style.transform = `translate(${S.mapPan.x}px, ${S.mapPan.y}px) scale(${S.mapPan.k})`; }
  });
  window.addEventListener("pointerup", () => { drag = null; view.classList.remove("panning"); setTimeout(() => { S.mapDragged = false; }, 0); });
  view.addEventListener("wheel", (e) => {
    e.preventDefault();
    const r = view.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const k = Math.min(2, Math.max(0.25, S.mapPan.k * Math.exp(-e.deltaY * 0.0015)));
    S.mapPan.x = mx - (mx - S.mapPan.x) * (k / S.mapPan.k);
    S.mapPan.y = my - (my - S.mapPan.y) * (k / S.mapPan.k);
    S.mapPan.k = k;
    $("#map-world").style.transform = `translate(${S.mapPan.x}px, ${S.mapPan.y}px) scale(${k})`;
  }, { passive: false });
  $("#map-fit").onclick = () => { S.mapPan = null; S.fitAll = true; renderMap(); S.fitAll = false; };
  const zoom = (f) => {
    const vw = view.clientWidth / 2, vh = view.clientHeight / 2;
    const k = Math.min(2, Math.max(0.2, S.mapPan.k * f));
    S.mapPan.x = vw - (vw - S.mapPan.x) * (k / S.mapPan.k);
    S.mapPan.y = vh - (vh - S.mapPan.y) * (k / S.mapPan.k);
    S.mapPan.k = k;
    $("#map-world").style.transform = `translate(${S.mapPan.x}px, ${S.mapPan.y}px) scale(${k})`;
  };
  $("#map-zoom-in").onclick = () => zoom(1.25);
  $("#map-zoom-out").onclick = () => zoom(0.8);
  $("#map-device").onchange = (e) => { S.mapDevice = e.target.value || null; S.mapShot = null; renderMap(); };
}

/** A section of the side panel that opens and closes, and stays as the reader left it. */
function fold(id, title, count, kids, force) {
  S.folds = S.folds || {};
  const open = force !== undefined ? force : (id in S.folds ? S.folds[id] : count > 0);
  const d = h("details", { class: "box fold", open }, h("summary", {}, title, count ? h("span", { class: "badge" }, String(count)) : null), ...kids.filter(Boolean));
  d.addEventListener("toggle", () => { S.folds[id] = d.open; });
  return d;
}
const appName = () => S.data.appName || ((S.data.personas[0] && traceOf(S.data.personas[0].key).app) || {}).id || "this app";
function introPanel(map) {
  const screens = [...map.nodes.values()].filter((n) => n.g !== "start");
  const keys = personaKeys();
  const robot = S.data.personas.some((p) => p.mapper);
  const unreached = screens.filter((n) => !n.testers.size).length;
  const findings = keys.reduce((a, k) => a + (((persona(k).findings || {}).issues) || []).length, 0);
  const stat = (v, label) => h("div", { class: "stat" }, h("b", {}, String(v)), h("span", {}, label));
  return [
    h("h2", { class: "intro-title" }, appName()),
    h("p", { class: "lead" }, robot ? `Every screen a robot found by tapping each button once, with no model, and the paths of ${keys.length} AI tester${keys.length === 1 ? "" : "s"} on top.`
      : `The screens ${keys.length} AI tester${keys.length === 1 ? "" : "s"} reached, and the path of each one.`),
    h("div", { class: "stats" }, stat(screens.length, "screens"), stat(keys.length, keys.length === 1 ? "tester" : "testers"),
      robot ? stat(unreached, "reached by no tester") : null, stat(findings, findings === 1 ? "finding" : "findings")),
    keys.length ? h("div", { class: "box" }, h("h3", {}, "Testers"), h("ul", { class: "list" }, ...keys.map((k) => {
      const t = traceOf(k);
      return h("li", {}, h("i", { class: "swatch", style: `background:${colorOf(k)}` }),
        h("span", { class: "grow" }, t.persona.id, h("span", { class: "when" }, [t.persona.context?.device, t.persona.locale].filter(Boolean).join(" · "))), pathButton(k));
    }))) : null,
    h("p", { class: "hint" }, "Click a screen on the map to see its screenshots, what the testers found there, and to turn a finding into a check."),
  ];
}

function renderMapSide(map) {
  const side = $("#map-side");
  const where = `${S.mapSel}|${S.mapPath}`;
  if (side.dataset.where !== where) { side.dataset.where = where; S.picking = null; requestAnimationFrame(() => { side.scrollTop = 0; }); }
  const n = map.nodes.get(S.mapSel);
  if (!n) { side.replaceChildren(...introPanel(map).filter(Boolean)); return; }
  const shot = (S.mapShot && n.visits.find((v) => v.key === S.mapShot.key && v.nn === S.mapShot.nn)) || visitFor(n).visit;
  const info = screenInfo(shot.nn, shot.key);
  const [W, H] = runSize(shot.key);
  const canvas = h("canvas", {});
  const overlay = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none" });
  if (S.picking && info) for (const el of info.elements) {
    if (!(el.label || el.id) || !elementSelector(el)) continue;
    const [x1, y1, x2, y2] = el.bounds;
    const r = svgEl("rect", { x: x1, y: y1, width: x2 - x1, height: y2 - y1, class: `pick-el${S.picking.el === el ? " on" : ""}` });
    const t = svgEl("title"); t.textContent = el.label || el.id; r.append(t);
    r.addEventListener("click", () => { S.picking.el = el; renderMap(); });
    overlay.append(r);
  }
  const phone = h("div", { class: `phone map-phone${S.picking ? " pick" : ""}`, style: `aspect-ratio:${W} / ${H}` }, h("img", { src: screenUrl(shot.key, shot.nn), alt: "" }), canvas, overlay);
  requestAnimationFrame(() => paintHeat(canvas, mapPoints(n, shot.key, shot.nn), 0.6));

  const mapper = S.data.personas.find((p) => p.mapper && n.visits.some((v) => v.key === p.key));
  const testers = [...n.testers].map((key) => {
    const visits = n.visits.filter((v) => v.key === key);
    return h("li", {}, h("span", { class: "grow" }, traceOf(key).persona.id, h("span", { class: "when" }, `${visits.length} visit${visits.length > 1 ? "s" : ""} · ${[traceOf(key).persona.context?.device, traceOf(key).persona.locale].filter(Boolean).join(" · ")}`)),
      pathButton(key));
  });
  const flows = (dir) => [...map.edges.values()].filter((e) => (dir === "in" ? e.to : e.from) === n.g).sort((a, b) => b.testers.size - a.testers.size).map((e) => {
    const other = map.nodes.get(dir === "in" ? e.from : e.to);
    const name = other.g === "start" ? "Launch" : screenTitle(screenInfo(other.visits[0].nn, other.visits[0].key), other.visits[0].nn);
    return h("li", {}, h("span", { class: "grow" }, h("button", { class: "link", onclick: () => { if (other.g !== "start") { S.mapSel = other.g; S.mapShot = null; renderMap(); } } }, name),
      h("span", { class: "when" }, [...e.actions.keys()].slice(0, 3).join(" · "))), h("span", { class: "badge" }, `${e.testers.size}`));
  });
  const fnd = findingsOn(n);
  const comments = screenComments(n);
  const input = h("textarea", { rows: 2, placeholder: "What should change on this screen? (Ctrl+Enter)" });
  const add = () => {
    const text = input.value.trim();
    if (!text) return;
    edit(() => { const s = notesOf(shot.key).screens; (s[shot.nn] = s[shot.nn] || []).push({ id: `c${Date.now().toString(36)}`, text, at: new Date().toISOString(), resolved: false }); });
  };
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); add(); } });
  const mutate = (x, fn) => edit(() => { const s = notesOf(x.key).screens, l = s[x.nn]; fn(l); if (!l.length) delete s[x.nn]; });

  const shown = S.mapPath && map.paths.get(S.mapPath);
  const pathBox = shown ? h("div", { class: "box path-box" }, h("h3", {}, `Path of ${traceOf(S.mapPath).persona.id}`, h("button", { class: "link", onclick: () => { S.mapPath = null; renderMap(); } }, "Show all")),
    h("ol", { class: "path" }, ...shown.slice(1).map((g) => { const o = map.nodes.get(g); return h("li", {}, h("button", { class: `link${g === n.g ? " here" : ""}`, onclick: () => { S.mapSel = g; S.mapShot = null; renderMap(); } }, screenTitle(screenInfo(o.visits[0].nn, o.visits[0].key), o.visits[0].nn))); }))) : null;
  const seenBy = n.testers.size ? `Seen by ${n.testers.size} tester${n.testers.size === 1 ? "" : "s"}${n.mapped ? " and the robot" : ""}` : "Only the robot came here";
  const beforeAfter = (() => { const i = flows("in"), o = flows("out"); return [
    h("h4", {}, "Comes from"), i.length ? h("ul", { class: "list" }, ...i) : h("p", { class: "hint" }, "The launch of the app."),
    h("h4", {}, "Leads to"), o.length ? h("ul", { class: "list" }, ...o) : h("p", { class: "hint", style: "margin:0" }, "Nobody went further from here.")]; })();
  side.replaceChildren(...[
    h("div", { class: "side-head" }, h("h2", {}, screenTitle(info, shot.nn)), h("button", { class: "icon", title: "Back to the overview (Esc)", "aria-label": "Close", onclick: () => { S.mapSel = null; renderMap(); } }, "×")),
    h("p", { class: "hint" }, `${seenBy} · ${n.visits.length} screenshot${n.visits.length > 1 ? "s" : ""}`),
    pathBox,
    phone,
    n.visits.length > 1 ? h("div", { class: "shots" }, ...n.visits.map((v) => h("button", { class: `shot${v === shot ? " on" : ""}`, title: `${traceOf(v.key).persona.id}, screenshot ${v.nn}`, onclick: () => { S.mapShot = { key: v.key, nn: v.nn }; renderMap(); } },
      h("img", { src: screenUrl(v.key, v.nn), alt: "" })))) : null,
    fnd.length ? h("div", { class: "box" }, h("h3", {}, "Found here"), h("ul", { class: "list" }, ...fnd.map((f) => h("li", {},
      h("span", { class: "grow" }, h("span", { class: `dot sev-${f.severity}` }), f.title, h("span", { class: "when" }, `${traceOf(f.key).persona.id} · ${f.severity}`)),
      h("button", { title: "Pick on the screen what shows this bug, or what is missing: the check stays red until the bug is fixed", onclick: () => { S.picking = { el: null, kind: "notVisible", bug: true, started: Date.now() }; S.folds = { ...(S.folds || {}), checks: true }; renderMap(); } }, "Make it a test"))))) : null,
    testers.length ? h("div", { class: "box" }, h("h3", {}, "Testers who came here"), h("ul", { class: "list" }, ...testers)) : h("div", { class: "box" }, h("h3", {}, "No tester came here"),
      h("p", { class: "hint", style: "margin:0" }, "Only the robot opened this screen. Is it hard to find, or not needed?"),
      mapper ? h("div", { class: "row", style: "margin-top:8px" }, h("span", { class: "hint", style: "margin:0" }, "The robot's path replays with no model."), pathButton(mapper.key)) : null),
    fold("flows", "Before and after", 0, beforeAfter, S.folds && "flows" in S.folds ? undefined : false),
    fold("comments", "Comments", comments.length, [
      h("ul", { class: "list" }, ...comments.map((x) => h("li", { class: x.c.resolved ? "resolved" : "" },
        h("span", { class: "grow" }, x.c.text, h("span", { class: "when" }, `${traceOf(x.key).persona.id}, screenshot ${x.nn} · ${new Date(x.c.at).toLocaleString()}`)),
        h("button", { onclick: () => mutate(x, (l) => { l[x.j].resolved = !l[x.j].resolved; }) }, x.c.resolved ? "Reopen" : "Resolve"),
        h("button", { class: "danger", onclick: () => mutate(x, (l) => l.splice(x.j, 1)) }, "Delete")))),
      input, h("div", { class: "row", style: "margin-top:6px" }, h("span", { class: "hint", style: "margin:0" }, "Saved in trace.notes.json"), h("button", { class: "fit", onclick: add }, "Comment"))]),
    checkBox(n, shot, info),
    mergeBox(map, n, shot)].filter(Boolean));
}

function checkBox(n, shot, info) {
  const checks = checksOn(n);
  const pick = S.picking;
  const list = checks.length ? h("ul", { class: "list" }, ...checks.map((x) => h("li", { class: x.o.observed === "failed" ? "bug" : "" },
    h("span", { class: "grow" }, describeCheck(x.o), h("span", { class: "when" }, `${traceOf(x.key).persona.id}, after step ${traceOf(x.key).steps[x.i].id}${x.o.observed === "failed" ? " · known bug: red until fixed" : ""}`)),
    h("button", { title: x.o.observed === "failed" ? "The bug is fixed: keep this check as a guard" : "This was false during the run: record it as a known bug",
      onclick: () => edit(() => { const o = editTrace(x.key).steps[x.i].checkpoints[x.j]; if (o.observed === "failed") delete o.observed; else o.observed = "failed"; }) }, x.o.observed === "failed" ? "Fixed" : "Is a bug"),
    h("button", { class: "danger", onclick: () => edit(() => { const st = editTrace(x.key).steps[x.i]; st.checkpoints.splice(x.j, 1); }) }, "Delete"))))
    : h("p", { class: "hint", style: "margin:0 0 8px" }, "No check yet: a replay only proves the taps still work.");
  let form;
  if (!pick) form = h("div", { class: "row" }, h("span", { class: "hint", style: "margin:0" }, "Checks go to trace.json and compile to Maestro assertions."),
    h("button", { class: "fit", disabled: !info, onclick: () => { S.picking = { el: null, kind: "visible", bug: false, started: Date.now() }; renderMap(); } }, "Add a check"));
  else {
    const target = pick.el && elementSelector(pick.el);
    const kind = h("select", { onchange: (e) => { pick.kind = e.target.value; } }, h("option", { value: "visible", selected: pick.kind === "visible" }, "Must be visible"), h("option", { value: "notVisible", selected: pick.kind === "notVisible" }, "Must not be visible"));
    const bug = h("input", { type: "checkbox", checked: pick.bug, onchange: (e) => { pick.bug = e.target.checked; } });
    form = h("div", {},
      h("p", { class: "hint", style: "margin:0 0 6px" }, target ? `Element: ${describeSelector(target)}${sharedName(pick.el, info.elements, target) ? " (several elements have this name: the check is about any of them)" : ""}` : "Click an element on the screen above."),
      h("div", { class: "row" }, kind),
      h("label", { class: "check-bug" }, bug, " It was wrong during the run (known bug)"),
      h("div", { class: "row", style: "margin-top:6px" }, h("button", { class: "fit", onclick: () => { S.picking = null; renderMap(); } }, "Cancel"), h("span"),
        h("button", { class: "fit primary", disabled: !target, onclick: () => { S.picking = null; addCheck(shot.key, shot.nn, target, pick.kind, pick.bug, pick.started); } }, "Add check")));
  }
  return fold("checks", "Checks a replay verifies", checks.length, [list, form], S.picking ? true : undefined);
}

// ---------- saving ----------

async function post(path, key, body) {
  try {
    const r = await fetch(`${path}?persona=${encodeURIComponent(key)}`, { method: "POST", headers: { "Content-Type": "application/json", "X-Dashboard": "1" }, body: JSON.stringify(body) });
    return { ok: r.ok, body: await r.json().catch(() => ({})) };
  } catch (e) {
    return { ok: false, body: { problems: ["The dashboard server does not answer. Is it still running?"] } };
  }
}

async function save() {
  if (S.data.static) return saveStatic();
  for (const key of dirtyTraces()) {
    const r = await post("api/trace", key, S.traces[key]);
    if (!r.ok) return flash((r.body.problems || ["Checks not saved"]).join(" "), true);
    S.savedTraces[key] = JSON.stringify(S.traces[key]);
    persona(key).trace = clone(S.traces[key]);
  }
  for (const key of dirtyNotes()) {
    const r = await post("api/notes", key, S.notes[key]);
    if (!r.ok) return flash("Comments not saved", true);
    S.saved[key] = JSON.stringify(S.notes[key]);
  }
  $("#status").dataset.saved = `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}${S.data.ecr ? " · checked by ECR" : ""}`;
  flash($("#status").dataset.saved);
}

/** The online demo has no server: edits stay in the page, and Save downloads them. */
function saveStatic() {
  for (const key of dirtyTraces()) {
    download(`${traceOf(key).persona.id}.trace.json`, JSON.stringify(S.traces[key], null, 2) + "\n");
    S.savedTraces[key] = JSON.stringify(S.traces[key]);
  }
  for (const key of dirtyNotes()) {
    download(`${traceOf(key).persona.id}.trace.notes.json`, JSON.stringify(S.notes[key], null, 2) + "\n");
    S.saved[key] = JSON.stringify(S.notes[key]);
  }
  $("#status").dataset.saved = "Downloaded: this demo saves nothing online";
  flash($("#status").dataset.saved);
}

function flash(text, error = false) {
  const st = $("#status");
  st.className = `status${error ? " error" : ""}`;
  st.textContent = text;
  renderTop();
  if (error) setTimeout(() => { st.classList.remove("error"); renderTop(); }, 6000);
}

function download(name, text) {
  const a = h("a", { href: URL.createObjectURL(new Blob([text], { type: "application/json" })), download: name });
  document.body.append(a); a.click(); a.remove();
}

function wire() {
  $("#map-heat").onchange = (e) => { S.mapHeat = e.target.value; render(); };
  const help = $("#help-box");
  const openHelp = (on) => { help.hidden = !on; if (on) $("#help-close").focus(); try { localStorage.setItem("mapHelpSeen", "1"); } catch (_) { /* private window */ } };
  $("#help").onclick = () => openHelp(true);
  $("#help-close").onclick = () => openHelp(false);
  help.addEventListener("click", (e) => { if (e.target === help) openHelp(false); });
  wireMap();
  $("#undo").onclick = () => undoRedo("undo", "redo");
  $("#redo").onclick = () => undoRedo("redo", "undo");
  $("#save").onclick = save;
  document.addEventListener("keydown", (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); save(); return; }
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { if (e.key === "Escape") e.target.blur(); return; }
    if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); undoRedo(e.shiftKey ? "redo" : "undo", e.shiftKey ? "undo" : "redo"); }
    else if (mod && e.key.toLowerCase() === "y") { e.preventDefault(); undoRedo("redo", "undo"); }
    else if (e.key === "Escape" && !$("#help-box").hidden) { $("#help-box").hidden = true; }
    else if (e.key === "Escape" && S.picking) { S.picking = null; renderMap(); }
    else if (e.key === "Escape" && S.mapPath) { S.mapPath = null; renderMap(); }
    else if (e.key === "Escape" && S.mapSel) { S.mapSel = null; renderMap(); }
  });
  window.addEventListener("resize", () => renderMap());
  window.addEventListener("beforeunload", (e) => { if (S.data && dirtyKeys().length) { e.preventDefault(); e.returnValue = ""; } });
}

async function start() {
  try {
    let r = await fetch("api/run");
    if (!r.ok) r = await fetch("api/run.json");   // the static demo (scripts/dashboard.py --export)
    S.data = await r.json();
  } catch (e) {
    $("#loading").textContent = "Could not read the run. Is the dashboard server running?";
    return;
  }
  if (!S.data.personas.length) { $("#loading").textContent = "No trace.json in this run."; return; }
  $("#run-name").textContent = S.data.run;
  $("#app-name").textContent = `App map · ${appName()}`;
  try { if (!localStorage.getItem("mapHelpSeen")) { $("#help-box").hidden = false; localStorage.setItem("mapHelpSeen", "1"); } } catch (_) { /* private window: no first-visit help */ }
  if (S.data.static) {
    document.body.classList.add("static");
    $("#save").textContent = "Download";
    $("#save").title = "Download the edited trace.json and trace.notes.json (Ctrl+S)";
    $("#demo-note").hidden = false;
    if (S.data.demoNote) $("#demo-note").textContent = S.data.demoNote;
  }
  document.title = `App map · ${S.data.run}`;
  wire();
  render();
  $("#loading").hidden = true;
}

start();
