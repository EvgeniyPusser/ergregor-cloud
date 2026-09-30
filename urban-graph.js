(() => {
  "use strict";
  const model = window.EGREGOR_URBAN;
  const all = [...model.capabilities, ...model.objects];
  const byId = new Map(all.map(node => [node.id, node]));
  const $ = id => document.getElementById(id);
  const labels = { assumed: "Design assumption", limited: "Limited", lost: "Unavailable" };
  let view = "capabilities", scope = null, selected = "water", scenario = "baseline";
  const stateOf = id => model.states[scenario][id] || ["assumed", "No change is specified in this scenario. Actual conditions require observations."];
  function element(tag, text, className) {
    const item = document.createElement(tag);
    if (text !== undefined) item.textContent = text;
    if (className) item.className = className;
    return item;
  }
  function showCapabilities() { view = "capabilities"; scope = null; selected = "water"; render(); }
  function showScope(id) {
    scope = id; view = "objects"; selected = id; render();
    $("up").focus({preventScroll:true});
    $("graph-title").scrollIntoView({block:"start",behavior:"smooth"});
  }
  function visible() {
    if (view === "capabilities") return { nodes: model.capabilities, edges: model.capabilityRelations };
    const ids = scope ? new Set(byId.get(scope).members) : new Set(model.objects.map(n => n.id));
    return { nodes: model.objects.filter(n => ids.has(n.id)), edges: model.relations.filter(e => ids.has(e.source) && ids.has(e.target)) };
  }
  function detail() {
    const node = byId.get(selected), panel = $("detail"), [state, reason] = stateOf(node.id);
    panel.replaceChildren(element("p", node.kind, "eyebrow"), element("h2", node.label), element("span", labels[state], `status ${state}`), element("p", reason), element("p", node.summary));
    if (node.members) {
      const open = element("button", `Expand graph · ${node.members.length} objects →`, "primary");
      open.onclick = () => showScope(node.id); panel.append(open);
      panel.append(element("h3", "Operating requirements"), element("p", node.rule));
    }
    panel.append(element("h3", "What to assess"));
    const metrics = element("ul"); node.metrics.forEach(m => metrics.append(element("li", m))); panel.append(metrics);
    panel.append(element("p", "Values have not been measured. Indicators are not combined into a single score.", "small"));
    const parents = model.capabilities.filter(c => c.members.includes(node.id));
    if (parents.length) {
      panel.append(element("h3", "Contributes to capabilities"));
      const pills = element("div", undefined, "pills");
      parents.forEach(parent => { const b = element("button", parent.label); b.onclick = () => showScope(parent.id); pills.append(b); }); panel.append(pills);
    }
    if (node.children) { panel.append(element("h3", "Next level · planned"), element("p", node.children.join(" · "))); }
    if (!node.members) {
      const links = model.relations.filter(e => e.source === node.id || e.target === node.id);
      panel.append(element("h3", "All object connections"));
      const list = element("ul");
      links.forEach(e => list.append(element("li", `${byId.get(e.source).label} → ${byId.get(e.target).label}: ${e.label}`))); panel.append(list);
      if (scope) panel.append(element("p", "Connections beyond the selected capability are also shown here.", "small"));
    }
    panel.append(element("p", `Persistent ID: ${node.id}`, "small"));
  }
  function draw() {
    const {nodes, edges} = visible(), graph = $("graph");
    graph.replaceChildren();
    const width = graph.clientWidth, height = nodes.length > 9 ? (width < 450 ? 790 : 640) : (width < 450 ? 550 : 490);
    graph.style.height = `${height}px`;
    const columns = width < 450 ? 2 : 3, rows = Math.ceil(nodes.length / columns);
    const positions = new Map(nodes.map((node,i) => [node.id, {x: (i % columns + .5) * width / columns, y: (Math.floor(i / columns) + .5) * height / rows}]));
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns,"svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`); svg.setAttribute("aria-hidden", "true");
    const defs = document.createElementNS(ns,"defs"), marker = document.createElementNS(ns,"marker"), arrow = document.createElementNS(ns,"path");
    marker.setAttribute("id","arrow"); marker.setAttribute("viewBox","0 0 10 10"); marker.setAttribute("refX","9"); marker.setAttribute("refY","5"); marker.setAttribute("markerWidth","6"); marker.setAttribute("markerHeight","6"); marker.setAttribute("orient","auto-start-reverse"); arrow.setAttribute("d","M 0 0 L 10 5 L 0 10 z"); arrow.setAttribute("fill","#9dd9be"); marker.append(arrow); defs.append(marker); svg.append(defs);
    const halfWidth = width < 450 ? 54 : width < 650 ? 62 : 74;
    edges.forEach(edge => {
      const a = positions.get(edge.source), b = positions.get(edge.target), dx = b.x-a.x, dy = b.y-a.y;
      const factor = Math.min(halfWidth / (Math.abs(dx) || 1), 40 / (Math.abs(dy) || 1), .4);
      const path = document.createElementNS(ns,"path");
      path.setAttribute("d",`M ${a.x+dx*factor} ${a.y+dy*factor} L ${b.x-dx*factor} ${b.y-dy*factor}`);
      path.setAttribute("class", `edge${edge.source === selected || edge.target === selected ? " active" : ""}`);
      path.setAttribute("marker-end","url(#arrow)"); svg.append(path);
    });
    graph.append(svg);
    nodes.forEach(node => {
      const [state] = stateOf(node.id), p = positions.get(node.id), button = element("button", undefined, `node ${state}${selected === node.id ? " selected" : ""}`);
      button.append(element("span",node.label), element("small",node.members ? `${node.members.length} objects inside` : labels[state]));
      button.style.left = `${p.x}px`; button.style.top = `${p.y}px`; button.dataset.nodeId = node.id;
      button.setAttribute("aria-pressed",String(selected === node.id)); button.setAttribute("aria-label",`${node.label}. ${labels[state]}`);
      button.onclick = () => { selected = node.id; render(); $("graph").querySelector(`[data-node-id="${node.id}"]`)?.focus({preventScroll:true}); };
      graph.append(button);
    });
    $("edge-count").textContent = `· ${edges.length}`;
    $("edge-list").replaceChildren(...edges.map(e => element("li", `${byId.get(e.source).label} → ${byId.get(e.target).label} · ${e.label}`)));
  }
  function render() {
    $("cap-view").setAttribute("aria-pressed",String(view === "capabilities"));
    $("body-view").setAttribute("aria-pressed",String(view === "objects" && !scope));
    $("up").hidden = !scope;
    $("view-kind").textContent = scope ? "Territory / Internal graph" : "Overview graph";
    $("graph-title").textContent = scope ? byId.get(scope).label : view === "capabilities" ? "Territory capabilities" : "Shared objects and external dependencies";
    $("graph-help").textContent = scope ? "Select an object to see its connections to other capabilities in the details panel." : "Select a node to inspect its composition, criteria and dependencies.";
    $("scenario-note").textContent = model.scenarios.find(s => s.id === scenario).description;
    draw(); detail();
  }
  model.scenarios.forEach(s => { const option = element("option",s.name); option.value = s.id; $("scenario").append(option); });
  $("scenario").onchange = event => { scenario = event.target.value; render(); };
  $("cap-view").onclick = showCapabilities;
  $("body-view").onclick = () => { view = "objects"; scope = null; selected = "houses"; render(); };
  $("up").onclick = showCapabilities;
  $("export").onclick = () => {
    const payload = { ...model, selectedScenario: scenario, observations: [], history: [], exportedAt: new Date().toISOString() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
    const link = element("a"); link.href = url; link.download = `${model.id}-${scenario}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
  };
  let timer; window.addEventListener("resize", () => { clearTimeout(timer); timer = setTimeout(draw,100); });
  render();
})();
