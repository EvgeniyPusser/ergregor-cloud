/* Living Building Assembly — v0.1
   Illustrative 3D model of on-site formation of a Living Building.
   Units: 1 unit ≈ 1 metre. y is up. Time T runs from 0 to 7 (one unit per stage). */
(() => {
  "use strict";
  const T_MAX = 7;

  // ---------------- real-world references ----------------
  const REFS = {
    ethVideo: { label: "ETH Zurich · In situ Fabricator & Mesh Mould: complete construction (video)", url: "https://www.youtube.com/watch?v=ZeLEeY8yK2Y", where: "Switzerland" },
    ethFab: { label: "DFAB HOUSE · In situ Fabricator: mobile robot building rebar on site", url: "https://dfabhouse.ch/in_situ_fabricator/", where: "Switzerland" },
    ethMesh: { label: "DFAB HOUSE · Mesh Mould: robotic reinforcement as formwork", url: "https://dfabhouse.ch/mesh_mould/", where: "Switzerland" },
    icon: { label: "ICON · Wolf Ranch: 100 homes printed on site by Vulcan (videos)", url: "https://www.iconbuild.com/projects/wolf-ranch", where: "USA" }
  };

  // ---------------- stages (text) ----------------
  const STAGES = [
    { title: "Site & material substrate",
      text: "What arrives on site is not a finished form, but information, material substrate and means of formation. Underground tanks hold the substrate; pipes and hoses will feed it to the formation robots." },
    { title: "Foundation from the centres",
      text: "Two formation robots dock at the morphogenetic centres (gold rings). They form the base slab locally, layer by layer, from the delivered substrate. Utility channels are laid inside the slab: water, power, gas, air and repair material. Together they are the circulatory system of the building (layer \"Utilities\")." },
    { title: "Robotic reinforcement",
      text: "Reinforcement cages for columns and walls are formed first. They fix the relational positions of the future elements: what connects to what, and where loads will travel. Every cage receives an IoT chip: a sensor of its element. Chips link with the elements they touch and with the controllers at the centres: the nervous system that senses and controls the building (layer \"Nervous\").",
      refs: ["ethVideo", "ethFab", "ethMesh"] },
    { title: "Ground floor: layer-by-layer formation",
      text: "Concrete is formed around the cages. The dark band on each element is the active formation front, where fresh material is being deposited. Each robot works on the elements nearest to its centre.",
      refs: ["icon"] },
    { title: "First floor slab",
      text: "The robots move up and form the slab that connects the ground-floor elements into one body. The slab mesh appears first, then the material." },
    { title: "Upper floor",
      text: "The same developmental rules are applied again one level higher: cages first, then formation. The upper floor is not a copy of the ground floor, because it has fewer columns and different walls." },
    { title: "Roof: a functional body",
      text: "The body reaches a fully functional state. The formation capability stays on site, so morphogenesis does not end here. It can continue as growth, adaptation and recovery (next versions)." }
  ];

  // ---------------- renderer / scene ----------------
  const canvas = document.getElementById("scene");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a66, 0.62));
  const sun = new THREE.DirectionalLight(0xffffff, 0.85);
  sun.position.set(-12, 22, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 70 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  // ---------------- materials ----------------
  const M = {
    concrete: new THREE.MeshStandardMaterial({ color: 0xcfcac0, roughness: 0.92 }),
    front: new THREE.MeshStandardMaterial({ color: 0x6e6a62, roughness: 0.6 }),
    soil: new THREE.MeshStandardMaterial({ color: 0x7a5b40, roughness: 1 }),
    soilDark: new THREE.MeshStandardMaterial({ color: 0x5f4632, roughness: 1 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x8ea476, roughness: 1 }),
    tank: new THREE.MeshStandardMaterial({ color: 0xb9c0c6, roughness: 0.35, metalness: 0.55 }),
    pipe: new THREE.MeshStandardMaterial({ color: 0x8a9096, roughness: 0.4, metalness: 0.5 }),
    hose: new THREE.MeshStandardMaterial({ color: 0x2c2f33, roughness: 0.7 }),
    robot: new THREE.MeshStandardMaterial({ color: 0xe0a526, roughness: 0.45, metalness: 0.2 }),
    robotDark: new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.8 }),
    centre: new THREE.MeshBasicMaterial({ color: 0xe0a526 }),
    rebar: new THREE.LineBasicMaterial({ color: 0x8a4f22 })
  };

  function box(w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
  }
  function boxFrom(x0, x1, y0, y1, z0, z1, mat) { return box(x1 - x0, y1 - y0, z1 - z0, mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); }

  // ---------------- ground with a cut-away corner ----------------
  boxFrom(-10, 2, -3, 0, -9, 9, M.soil);
  boxFrom(2, 10, -3, 0, -9, 3, M.soil);
  boxFrom(2, 10, -3.2, -2.9, 3, 9, M.soilDark);
  boxFrom(-10, 2, 0, 0.02, -9, 9, M.grass).receiveShadow = true;
  boxFrom(2, 10, 0, 0.02, -9, 3, M.grass).receiveShadow = true;
  // a few shrubs
  [[-8, -7], [-8.5, 6], [8, -7.5], [-3, 7.8]].forEach(([x, z], i) => {
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55 + (i % 2) * 0.2, 0), new THREE.MeshStandardMaterial({ color: 0x7f9a6a, roughness: 1, flatShading: true }));
    s.position.set(x, 0.5, z); s.castShadow = true; scene.add(s);
  });

  // ---------------- material substrate: tanks and pipes ----------------
  const TANKS = [new THREE.Vector3(4.0, -1.75, 6.4), new THREE.Vector3(7.0, -1.75, 6.4)];
  const tankMeshes = TANKS.map(p => {
    const g = new THREE.CylinderGeometry(0.7, 0.7, 1.5, 28); g.translate(0, 0.75, 0);
    const m = new THREE.Mesh(g, M.tank); m.position.set(p.x, -2.9, p.z); m.castShadow = true; scene.add(m);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.tank);
    cap.position.set(0, 1.5, 0); m.add(cap); return m;
  });
  function tube(points, r, mat) {
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.1);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, r, 8, false), mat);
    m.castShadow = true; scene.add(m); return m;
  }
  const pipes = TANKS.map((p, i) => tube([
    new THREE.Vector3(p.x, -0.8, p.z), new THREE.Vector3(p.x, -0.6, p.z - 1.2),
    new THREE.Vector3(p.x - 0.3, -0.45, 3.2), new THREE.Vector3(i ? 4.6 : 3.4, -0.45, 2.9), new THREE.Vector3(i ? 4.6 : 3.4, 0.1, 2.9)
  ], 0.12, M.pipe));

  // ---------------- building elements ----------------
  // Each element: concrete box that grows upward (fill), a rebar cage that grows first, and a dark formation front.
  const elements = [];
  const rebarGroup = new THREE.Group(); scene.add(rebarGroup);

  function cageGeometry(w, h, d, slab) {
    const pts = []; const inset = 0.07;
    if (slab) {
      const y = h * 0.5; const sp = 0.42;
      for (let x = -w / 2 + inset; x <= w / 2 - inset + 1e-6; x += sp) pts.push(x, y, -d / 2 + inset, x, y, d / 2 - inset);
      for (let z = -d / 2 + inset; z <= d / 2 - inset + 1e-6; z += sp) pts.push(-w / 2 + inset, y, z, w / 2 - inset, y, z);
    } else {
      const hw = w / 2 - inset, hd = d / 2 - inset, top = h + 0.4, sp = 0.24;
      const per = [];
      const nx = Math.max(1, Math.round((2 * hw) / sp)), nz = Math.max(1, Math.round((2 * hd) / sp));
      for (let i = 0; i <= nx; i++) { per.push([-hw + (2 * hw * i) / nx, -hd], [-hw + (2 * hw * i) / nx, hd]); }
      for (let i = 1; i < nz; i++) { per.push([-hw, -hd + (2 * hd * i) / nz], [hw, -hd + (2 * hd * i) / nz]); }
      per.forEach(([x, z]) => pts.push(x, 0, z, x, top, z));
      for (let y = 0.15; y <= h; y += 0.28) {
        pts.push(-hw, y, -hd, hw, y, -hd, hw, y, -hd, hw, y, hd, hw, y, hd, -hw, y, hd, -hw, y, hd, -hw, y, -hd);
      }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); return g;
  }

  function element(name, x0, x1, y0, y1, z0, z1, opts) {
    const w = x1 - x0, h = y1 - y0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const slab = !!opts.slab;
    const g = new THREE.BoxGeometry(w, h, d); g.translate(0, h / 2, 0);
    const mesh = new THREE.Mesh(g, M.concrete); mesh.position.set(cx, y0, cz); mesh.castShadow = mesh.receiveShadow = true; scene.add(mesh);
    const fh = Math.min(0.12, h * 0.3);
    const fg = new THREE.BoxGeometry(w + 0.01, fh, d + 0.01); fg.translate(0, -fh / 2, 0);
    const front = new THREE.Mesh(fg, M.front); scene.add(front);
    const cage = new THREE.LineSegments(cageGeometry(w, h, d, slab), M.rebar); cage.position.set(cx, y0, cz); rebarGroup.add(cage);
    const e = Object.assign({ name, x0, x1, y0, y1, z0, z1, w, h, d, cx, cz, slab, mesh, front, cage, segs: cage.geometry.attributes.position.count }, opts);
    elements.push(e); return e;
  }

  // Stagger a group of elements inside a time window.
  function stagger(list, key, a, b) {
    const n = list.length;
    list.forEach((e, i) => { const s = a + (b - a) * (i / n) * 0.6; e[key] = [s, s + (b - a) * 0.4]; });
  }

  // Foundation
  element("Foundation slab", -5.6, 5.6, 0, 0.5, -4.6, 4.6, { slab: true, rebar: [1.0, 1.4], fill: [1.3, 2.0], robot: "both" });

  // Ground floor (0.5 → 3.5)
  const gf = [];
  const colsG = [[-4.7, -3.7], [0, -3.7], [4.7, -3.7], [-4.7, 3.7], [0, 3.7], [4.7, 3.7]];
  colsG.forEach(([x, z], i) => gf.push(element("Column G" + (i + 1), x - 0.3, x + 0.3, 0.5, 3.5, z - 0.3, z + 0.3, { robot: x <= 0 ? 0 : 1 })));
  gf.push(element("Back wall G-left", -4.4, -0.3, 0.5, 3.5, -3.85, -3.55, { robot: 0 }));
  gf.push(element("Back wall G-right", 0.3, 4.4, 0.5, 3.5, -3.85, -3.55, { robot: 1 }));
  gf.push(element("Side wall G", -4.85, -4.55, 0.5, 3.5, -3.4, 1.2, { robot: 0 }));
  gf.push(element("Core wall G", 1.6, 1.9, 0.5, 3.5, -3.4, -0.6, { robot: 1 }));
  gf.sort((a, b) => a.cx - b.cx);
  stagger(gf, "rebar", 2.0, 3.0);
  stagger(gf, "fill", 3.0, 4.0);

  // First floor slab (3.5 → 3.9)
  element("First floor slab", -5.2, 5.2, 3.5, 3.9, -4.2, 4.2, { slab: true, rebar: [4.0, 4.4], fill: [4.35, 5.0], robot: "both" });

  // Upper floor (3.9 → 6.9)
  const uf = [];
  [[-4.7, -3.7], [4.7, -3.7], [-4.7, 3.7], [4.7, 3.7]].forEach(([x, z], i) => uf.push(element("Column U" + (i + 1), x - 0.3, x + 0.3, 3.9, 6.9, z - 0.3, z + 0.3, { robot: x <= 0 ? 0 : 1 })));
  uf.push(element("Back wall U", -4.4, 4.4, 3.9, 6.9, -3.85, -3.55, { robot: 1 }));
  uf.push(element("Side wall U", 4.55, 4.85, 3.9, 6.9, -3.4, 0.4, { robot: 1 }));
  uf.push(element("Partition U", -1.2, -0.9, 3.9, 6.9, -3.4, 0.8, { robot: 0 }));
  uf.sort((a, b) => a.cx - b.cx);
  stagger(uf, "rebar", 5.0, 5.4);
  stagger(uf, "fill", 5.3, 6.0);

  // Roof slab + parapet
  element("Roof slab", -5.3, 5.3, 6.9, 7.3, -4.3, 4.3, { slab: true, rebar: [6.0, 6.3], fill: [6.25, 6.8], robot: "both" });
  const par = [
    element("Parapet N", -5.3, 5.3, 7.3, 7.75, -4.3, -4.05, { robot: 1 }),
    element("Parapet S", -5.3, 5.3, 7.3, 7.75, 4.05, 4.3, { robot: 0 }),
    element("Parapet W", -5.3, -5.05, 7.3, 7.75, -4.05, 4.05, { robot: 0 }),
    element("Parapet E", 5.05, 5.3, 7.3, 7.75, -4.05, 4.05, { robot: 1 })
  ];
  par.forEach(e => { e.rebar = [6.75, 6.85]; });
  stagger(par, "fill", 6.8, 7.0);

  // Morphogenetic centres (robot docking points)
  const CENTRES = [new THREE.Vector3(-2.4, 0, 0.6), new THREE.Vector3(2.4, 0, 0.6)];
  const centreRings = CENTRES.map(c => {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 8, 40), M.centre);
    r.rotation.x = Math.PI / 2; r.position.set(c.x, 0.53, c.z); scene.add(r); return r;
  });

  // ---------------- robots ----------------
  function cyl(r, mat) { const g = new THREE.CylinderGeometry(r, r, 1, 12); g.translate(0, 0.5, 0); const m = new THREE.Mesh(g, mat); m.castShadow = true; scene.add(m); return m; }
  function between(m, a, b) {
    const dir = new THREE.Vector3().subVectors(b, a); const len = dir.length();
    m.position.copy(a); m.scale.set(1, Math.max(len, 0.001), 1);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  }
  function makeRobot(i) {
    const base = new THREE.Group(); scene.add(base);
    const tr = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.28, 0.8), M.robotDark); tr.position.y = 0.14; tr.castShadow = true; base.add(tr);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.32, 0.6), M.robot); body.position.y = 0.44; body.castShadow = true; base.add(body);
    const tur = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.3, 16), M.robot); tur.position.y = 0.75; tur.castShadow = true; base.add(tur);
    const upper = cyl(0.08, M.robot), fore = cyl(0.065, M.robot);
    const elbowJ = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), M.robotDark); scene.add(elbowJ);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.26), M.robotDark); head.castShadow = true; scene.add(head);
    const nozzle = cyl(0.04, M.robot);
    const hose = new THREE.Mesh(new THREE.BufferGeometry(), M.hose); hose.castShadow = true; scene.add(hose);
    return { i, base, upper, fore, elbowJ, head, nozzle, hose, pos: CENTRES[i].clone(), headPos: CENTRES[i].clone().add(new THREE.Vector3(0.6, 1.3, 0)), parts: [base, upper, fore, elbowJ, head, nozzle, hose] };
  }
  const robots = [makeRobot(0), makeRobot(1)];

  // ================= NETWORKS (v0.2-A) =================
  // Nervous system: an IoT chip in every element, linked to touching neighbours and to the centre hubs.
  // Circulatory system: material channels from the substrate tanks through slabs, columns and walls.
  const NET = { nervous: false, blood: false, xray: false, selected: null };
  const CYAN = 0x1fb6ff, RED = 0xff5a3c;
  const chipMat = new THREE.MeshBasicMaterial({ color: CYAN, depthTest: false, transparent: true });
  const chipSelMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, depthTest: false, transparent: true });
  const linkMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5, depthTest: false });
  const linkSelMat = new THREE.LineBasicMaterial({ color: 0x00c8ff, transparent: true, opacity: 1, depthTest: false });
  const linkDimMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.12, depthTest: false });
  const chanMat = new THREE.MeshBasicMaterial({ color: 0xe8412a, transparent: true, opacity: 0.95, depthTest: false });

  const chips = [];
  elements.forEach((e, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.26), chipMat);
    m.position.set(e.cx, e.y0 + e.h / 2, e.cz); m.renderOrder = 20; m.visible = false; scene.add(m);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.32, 28), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.45, depthTest: false, side: THREE.DoubleSide }));
    halo.rotation.x = -Math.PI / 2; halo.renderOrder = 20; m.add(halo);
    e.chip = { id: "IoT-" + String(i + 1).padStart(2, "0"), mesh: m, halo, links: [] };
    m.userData.el = e; chips.push(m);
  });
  const hubs = CENTRES.map((c, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), chipMat);
    m.position.set(c.x, 0.75, c.z); m.renderOrder = 20; m.visible = false; scene.add(m);
    return { name: "Controller c" + (i + 1), mesh: m };
  });

  const touch = (a, b, t = 0.12) => a.x0 <= b.x1 + t && b.x0 <= a.x1 + t && a.y0 <= b.y1 + t && b.y0 <= a.y1 + t && a.z0 <= b.z1 + t && b.z0 <= a.z1 + t;
  const links = [];
  function addLink(pa, pb, ea, eb, hub) {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([pa, pb]), linkMat);
    line.renderOrder = 19; line.visible = false; scene.add(line);
    const L = { pa, pb, ea, eb, hub, line }; links.push(L);
    if (ea) ea.chip.links.push(L); if (eb) eb.chip.links.push(L); return L;
  }
  for (let i = 0; i < elements.length; i++) for (let j = i + 1; j < elements.length; j++) {
    if (touch(elements[i], elements[j])) addLink(elements[i].chip.mesh.position, elements[j].chip.mesh.position, elements[i], elements[j]);
  }
  const foundationEl = elements[0];
  hubs.forEach(h => addLink(h.mesh.position, foundationEl.chip.mesh.position, null, foundationEl, h));

  const chipOn = e => e.pr >= 0.5 || e.pf > 0;
  const linkOn = (L, T) => (L.ea ? chipOn(L.ea) : T > 0.8) && (L.eb ? chipOn(L.eb) : T > 0.8);

  // Signal pulses travelling along links
  const pulses = [];
  const pulseGeo = new THREE.SphereGeometry(0.08, 8, 6);
  for (let i = 0; i < 48; i++) {
    const m = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({ color: 0xbff0ff, depthTest: false, transparent: true }));
    m.renderOrder = 21; m.visible = false; scene.add(m); pulses.push({ m, L: null, t: 0, rev: false });
  }

  // Circulatory system = utility networks. Each network is a list of straight pieces hosted by an element
  // (a piece appears when its host element is formed). Routes are an illustrative layout, not an MEP design.
  const NETS = {
    water:  { label: "Water",           color: 0x2f6fde, flow: 0xbcd4ff, r: 0.05, on: false, pieces: [] },
    power:  { label: "Power",           color: 0xf2b200, flow: 0xfff3b0, r: 0.045, on: false, pieces: [] },
    gas:    { label: "Gas",             color: 0x2fa36b, flow: 0xc8f5dc, r: 0.045, on: false, pieces: [] },
    air:    { label: "Air",             color: 0x8e9bb0, flow: 0xffffff, r: 0.09, on: false, pieces: [] },
    repair: { label: "Repair material", color: 0xe8412a, flow: 0xfff1c2, r: 0.05, on: false, pieces: [] }
  };
  Object.values(NETS).forEach(n => { n.mat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.95, depthTest: false }); });
  const pieces = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  function chanPiece(a, b, host, key) {
    const n = NETS[key];
    const g = new THREE.CylinderGeometry(n.r, n.r, 1, 8); g.translate(0, 0.5, 0);
    const m = new THREE.Mesh(g, n.mat); m.renderOrder = 18; m.visible = false; scene.add(m);
    between(m, a, b); const P = { a, b, host, key, m }; pieces.push(P); n.pieces.push(P);
    if (host) { host.nets = host.nets || new Set(); host.nets.add(key); }
  }
  const chanPath = (key, host, pts) => { for (let i = 0; i < pts.length - 1; i++) chanPiece(pts[i], pts[i + 1], host, key); };
  const byName = n => elements.find(e => e.name === n);
  const slab1 = byName("First floor slab"), roof = byName("Roof slab");

  // --- Repair material: from the substrate tanks into foundation, columns and slabs
  const rring = (y, host) => chanPath("repair", host, [V(4.7, y, 3.7), V(-4.7, y, 3.7), V(-4.7, y, -3.7), V(4.7, y, -3.7), V(4.7, y, 3.7)]);
  chanPath("repair", foundationEl, [V(3.4, -0.45, 2.9), V(3.4, 0.25, 2.9), V(3.4, 0.25, 3.7)]);
  chanPath("repair", foundationEl, [V(4.6, -0.45, 2.9), V(4.6, 0.25, 2.9), V(4.6, 0.25, 3.7)]);
  rring(0.25, foundationEl); rring(3.7, slab1); rring(7.1, roof);
  elements.filter(e => /^Column G/.test(e.name)).forEach(e => chanPath("repair", e, [V(e.cx, 0.25, e.cz), V(e.cx, 3.7, e.cz)]));
  elements.filter(e => /^Column U/.test(e.name)).forEach(e => chanPath("repair", e, [V(e.cx, 3.7, e.cz), V(e.cx, 7.1, e.cz)]));

  // --- Water: service inlet from the back, riser in the core wall, branches to kitchen and bathrooms
  chanPath("water", foundationEl, [V(1.75, -0.6, -8), V(1.75, -0.6, -3.2), V(1.75, 0.25, -3.2)]);
  chanPath("water", byName("Core wall G"), [V(1.75, 0.25, -3.2), V(1.75, 3.6, -3.2)]);
  chanPath("water", byName("Core wall G"), [V(1.75, 0.8, -3.2), V(3.8, 0.8, -3.2), V(3.8, 0.8, -2.2)]);
  chanPath("water", byName("Core wall G"), [V(1.75, 0.8, -2.4), V(-0.6, 0.8, -2.4)]);
  chanPath("water", byName("Back wall U"), [V(1.75, 3.6, -3.2), V(1.75, 6.5, -3.2)]);
  chanPath("water", byName("Back wall U"), [V(1.75, 4.2, -3.2), V(-0.9, 4.2, -3.2), V(-0.9, 4.2, -1.6)]);

  // --- Power: inlet on the left, riser in the side wall, a ring in each floor slab, riser through the partition
  const pring = (y, host) => chanPath("power", host, [V(4.9, y, 3.95), V(-4.9, y, 3.95), V(-4.9, y, -3.95), V(4.9, y, -3.95), V(4.9, y, 3.95)]);
  chanPath("power", foundationEl, [V(-9, -0.4, -1.5), V(-4.7, -0.4, -1.5), V(-4.7, 0.3, -1.5)]);
  chanPath("power", byName("Side wall G"), [V(-4.7, 0.3, -1.5), V(-4.7, 3.75, -1.5), V(-4.9, 3.75, -1.5)]);
  chanPath("power", byName("Side wall G"), [V(-4.7, 1.1, -3.2), V(-4.7, 1.1, 1.0)]);
  pring(3.75, slab1);
  chanPath("power", byName("Partition U"), [V(-1.05, 3.75, -3.95), V(-1.05, 3.75, -1.0), V(-1.05, 7.15, -1.0), V(-1.05, 7.15, -3.95)]);
  chanPath("power", byName("Partition U"), [V(-1.05, 4.5, -3.3), V(-1.05, 4.5, 0.6)]);
  pring(7.15, roof);

  // --- Gas: short line from the right to the ground-floor kitchen
  chanPath("gas", foundationEl, [V(9, -0.4, -2.6), V(4.4, -0.4, -2.6), V(4.4, 0.3, -2.6)]);
  chanPath("gas", byName("Back wall G-right"), [V(4.4, 0.3, -2.6), V(4.4, 1.25, -2.6), V(4.4, 1.25, -3.35), V(3.2, 1.25, -3.35)]);

  // --- Air: ducts under each ceiling, riser to a ventilation unit on the roof
  const ducts = (y, host) => {
    chanPath("air", host, [V(-4.0, y, 0.2), V(3.0, y, 0.2)]);
    chanPath("air", host, [V(-2.6, y, -3.0), V(-2.6, y, 3.0)]);
    chanPath("air", host, [V(1.0, y, -3.0), V(1.0, y, 3.0)]);
  };
  ducts(3.25, slab1); ducts(6.65, roof);
  chanPath("air", slab1, [V(3.0, 3.25, 0.2), V(3.0, 3.25, -2.6), V(3.0, 6.65, -2.6)]);
  chanPath("air", roof, [V(3.0, 6.65, -2.6), V(3.0, 6.65, 0.2)]);
  chanPath("air", roof, [V(3.0, 6.65, -2.6), V(3.0, 7.75, -2.6)]);
  const airUnit = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 1.0), new THREE.MeshStandardMaterial({ color: 0x9aa4b2, roughness: 0.5, metalness: 0.4 }));
  airUnit.position.set(3.0, 7.6, -2.6); airUnit.castShadow = true; airUnit.visible = false; scene.add(airUnit);

  const flows = [];
  const flowGeo = new THREE.SphereGeometry(0.1, 8, 6);
  for (let i = 0; i < 90; i++) {
    const m = new THREE.Mesh(flowGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true }));
    m.renderOrder = 21; m.visible = false; scene.add(m); flows.push({ m, P: null, t: 0 });
  }
  const anyNet = () => Object.values(NETS).some(n => n.on);

  function applyXray(mat, on) {
    const changed = mat.transparent !== on;
    mat.transparent = on; mat.opacity = on ? 0.28 : 1; mat.depthWrite = !on;
    if (changed) mat.needsUpdate = true;
  }
  function setXray(on) {
    [M.concrete, M.front, ...elements.map(e => e.stressMat).filter(Boolean)].forEach(mat => applyXray(mat, on));
  }

  function updateNetworks(T) {
    chips.forEach(m => { const e = m.userData.el; m.visible = NET.nervous && chipOn(e); m.material = NET.selected === e ? chipSelMat : chipMat; m.scale.setScalar(NET.selected === e ? 1.9 : 1); });
    hubs.forEach(h => { h.mesh.visible = NET.nervous && T > 0.8; });
    links.forEach(L => {
      L.line.visible = NET.nervous && linkOn(L, T);
      L.line.material = !NET.selected ? linkMat : (L.ea === NET.selected || L.eb === NET.selected) ? linkSelMat : linkDimMat;
    });
    pieces.forEach(p => { p.m.visible = NETS[p.key].on && (!p.host || p.host.pf > 0); });
    airUnit.visible = roof.pf >= 1;
  }

  let netLast = 0, pulseAcc = 0, flowAcc = 0;
  function animateNetworks(now) {
    const dt = Math.min(0.1, (now - (netLast || now)) / 1000); netLast = now;
    animateMobile(dt);
    animateDamage(dt, now);
    if (STR.on) STR.sensors.forEach(sn => { if (sn.risk && sn.m) sn.m.scale.setScalar(1.15 + 0.4 * Math.sin(now / 180)); });
    // pulses
    if (NET.nervous) {
      pulseAcc += dt;
      const live = links.filter(L => L.line.visible);
      while (pulseAcc > 0.07 && live.length) {
        pulseAcc -= 0.07;
        const p = pulses.find(q => !q.L); if (!p) break;
        p.L = live[(Math.random() * live.length) | 0]; p.t = 0; p.rev = Math.random() < 0.5; p.m.visible = true;
      }
    }
    pulses.forEach(p => {
      if (!p.L) return;
      p.t += dt / 0.7;
      if (p.t >= 1 || !NET.nervous || !p.L.line.visible) { p.L = null; p.m.visible = false; return; }
      const a = p.rev ? p.L.pb : p.L.pa, b = p.rev ? p.L.pa : p.L.pb;
      p.m.position.lerpVectors(a, b, p.t);
    });
    // material flow
    if (anyNet()) {
      flowAcc += dt;
      const live = pieces.filter(q => q.m.visible);
      while (flowAcc > 0.05 && live.length) {
        flowAcc -= 0.05;
        const f = flows.find(q => !q.P); if (!f) break;
        f.P = live[(Math.random() * live.length) | 0]; f.t = 0; f.m.visible = true; f.m.material.color.setHex(NETS[f.P.key].flow);
      }
    }
    flows.forEach(f => {
      if (!f.P) return;
      f.t += dt * 2.2 / Math.max(0.6, f.P.a.distanceTo(f.P.b));
      if (f.t >= 1 || !f.P.m.visible) { f.P = null; f.m.visible = false; return; }
      f.m.position.lerpVectors(f.P.a, f.P.b, f.t);
    });
  }

  function chipCard(e) {
    const card = document.getElementById("chip-card");
    if (!e) { card.hidden = true; return; }
    const ci = e.robot === "both" ? (e.cx <= 0 ? 0 : 1) : e.robot;
    const c = CENTRES[ci];
    const nb = e.chip.links.map(L => (L.hub ? L.hub.name : (L.ea === e ? L.eb : L.ea).name));
    card.hidden = false;
    card.innerHTML = `<p class="refs-title">IoT chip · nervous system</p><h3>${e.chip.id} · ${e.name}</h3>
      <dl>
        <dt>Position relative to centre c${ci + 1}</dt><dd>dx ${(e.cx - c.x).toFixed(1)} m · dy ${(e.y0 + e.h / 2).toFixed(1)} m · dz ${(e.cz - c.z).toFixed(1)} m</dd>
        <dt>Signal links (${nb.length})</dt><dd>${nb.join(", ")}</dd>
        <dt>Utility networks through this element</dt><dd>${e.nets ? [...e.nets].map(k => NETS[k].label).join(", ") : "none"}</dd>
        <dt>Status</dt><dd>${e.failed ? "offline · destroyed" : e.rebuilding ? "repair in progress" : e.pf >= 1 ? "online · formed" : e.pf > 0 ? "online · element being formed" : e.pr > 0 ? "online · in reinforcement cage" : "not formed · offline"}</dd>
        ${structuralReading(e)}
      </dl>
      <p class="small">${STR.on ? "Numbers come from a simplified tributary-area model with assumed capacities. Not a structural design." : "Turn on the Stress layer to see structural readings."}</p>`;
  }


  // ================= STRUCTURAL MONITORING (v0.3-B1) =================
  // Simplified gravity-load model (tributary areas), NOT a structural design:
  //  - every slab gives its weight + finishes + live load to the nearest supporting element below it
  //  - every vertical element passes its total force down to the slab/foundation it stands on
  //  - columns/walls: stress = N / A, compared with an assumed design strength
  //  - slabs: M = q·L²/8 with L = 2 × (largest distance from any slab point to its nearest support)
  //  - foundation: soil pressure = total load / footprint area
  const STR = { on: false, sig: "", res: new Map(), maxU: 0, sensors: [] };
  const RHO = 25;                     // kN/m³, reinforced concrete
  const FIN = 1.0;                    // kN/m², finishes
  const LIVE = { "Foundation slab": 2.0, "First floor slab": 2.0, "Roof slab": 1.0 }; // kN/m², use
  const F_CAP = 12000;                // kN/m² = 12 MPa, assumed design compressive strength
  const M_CAP = 120;                  // kNm per metre width, assumed slab bending capacity
  const SOIL_CAP = 150;               // kPa, assumed allowable soil pressure
  const formed = e => e.pf >= 1 && !e.failed && !e.rebuilding;
  const rectDist = (px, pz, e) => Math.hypot(Math.max(e.x0 - px, 0, px - e.x1), Math.max(e.z0 - pz, 0, pz - e.z1));

  function computeStress() {
    const res = new Map();
    elements.forEach(e => res.set(e, { own: 0, got: 0, points: [] }));
    (STR.props || []).forEach(pr => res.set(pr, { own: 0, got: 0, points: [] }));
    const list = elements.filter(formed).concat(STR.props || []).sort((a, b) => b.y0 - a.y0); // top-down
    for (const e of list) {
      const r = res.get(e); r.own = e.w * e.h * e.d * RHO;
      if (!e.slab) {
        r.N = r.own + r.got;
        r.A = e.w * e.d; r.sigma = r.N / r.A; r.util = r.sigma / (F_CAP * (e.cap || 1));
        const below = list.find(s => s.slab && Math.abs(s.y1 - e.y0) < 0.05 && rectDist(e.cx, e.cz, s) < 0.01);
        if (below) res.get(below).points.push({ x: e.cx, z: e.cz, P: r.N, from: e });
        continue;
      }
      const area = e.w * e.d;
      const baseQ = r.own / area + FIN;
      const liveQ = (LIVE[e.name] || 0) * (e.liveF === undefined ? 1 : e.liveF);
      const zone = e.liveZone;
      const closedArea = zone ? Math.max(0, Math.min(e.x1, zone.x1) - Math.max(e.x0, zone.x0)) * Math.max(0, Math.min(e.z1, zone.z1) - Math.max(e.z0, zone.z0)) : 0;
      r.q = baseQ + liveQ * (1 - closedArea / area);
      r.N = r.q * area + r.points.reduce((s, p) => s + p.P, 0);
      if (e.y0 < 0.01) { // foundation on soil
        r.p = r.N / area; r.util = r.p / (SOIL_CAP * (e.cap || 1));
        const top = r.points.slice().sort((a, b) => b.P - a.P)[0];
        r.hot = top ? { x: top.x, z: top.z } : { x: e.cx, z: e.cz };
        continue;
      }
      const sup = list.filter(v => !v.slab && Math.abs(v.y1 - e.y0) < 0.05 && v.x1 > e.x0 && v.x0 < e.x1 && v.z1 > e.z0 && v.z0 < e.z1);
      if (!sup.length) { r.util = 0; continue; }
      let maxD = 0, mid = { x: e.cx, z: e.cz };
      const step = 0.25;
      for (let x0 = e.x0; x0 < e.x1 - 1e-9; x0 += step) for (let z0 = e.z0; z0 < e.z1 - 1e-9; z0 += step) {
        const x1 = Math.min(x0 + step, e.x1), z1 = Math.min(z0 + step, e.z1);
        const x = (x0 + x1) / 2, z = (z0 + z1) / 2, dA = (x1 - x0) * (z1 - z0);
        const closed = zone ? Math.max(0, Math.min(x1, zone.x1) - Math.max(x0, zone.x0)) * Math.max(0, Math.min(z1, zone.z1) - Math.max(z0, zone.z0)) : 0;
        let best = null, bd = Infinity;
        for (const s of sup) { const d = rectDist(x, z, s); if (d < bd) { bd = d; best = s; } }
        res.get(best).got += baseQ * dA + liveQ * (dA - closed);
        if (bd > maxD) { maxD = bd; mid = { x, z }; }
      }
      for (const p of r.points) {
        let best = null, bd = Infinity;
        for (const s of sup) { const d = rectDist(p.x, p.z, s); if (d < bd) { bd = d; best = s; } }
        res.get(best).got += p.P;
      }
      // Illustrative equivalent uniform load includes loads arriving from above.
      // This does not resolve local moments, punching shear or plate behaviour.
      r.qEquivalent = r.N / area;
      r.L = Math.max(1, 2 * maxD); r.M = r.qEquivalent * r.L * r.L / 8; r.util = r.M / (M_CAP * (e.cap || 1)); r.mid = mid; r.sup = sup; r.maxD = Math.max(maxD, 0.5);
      const heavy = sup.slice().sort((a, b) => res.get(b).got - res.get(a).got)[0];
      r.over = heavy ? { x: heavy.cx, z: heavy.cz, name: heavy.name } : null;
    }
    STR.res = res;
    STR.maxU = Math.max(1e-6, ...list.filter(e => !e.prop).map(e => res.get(e).util || 0));
    buildSensors(list);
  }

  // fixed sensors at the known critical points of each element
  const sensorGeo = new THREE.OctahedronGeometry(0.15);
  function buildSensors(list) {
    clearSensors();
    const add = (e, x, y, z, factor, what) => {
      const r = STR.res.get(e);
      STR.sensors.push({ e, pos: new THREE.Vector3(x, y, z), score: (r.util || 0) * factor, what, m: null });
    };
    for (const e of list) {
      const r = STR.res.get(e);
      if (/^Parapet/.test(e.name) || e.prop) continue;
      if (!e.slab && e.w < 0.7 && e.d < 0.7) { // column
        add(e, e.cx, e.y0 + 0.2, e.cz, 1.0, "base of column: largest axial force");
        add(e, e.cx, e.y1 - 0.2, e.cz, 0.9, "top of column: load enters from the slab");
      } else if (!e.slab) { // wall
        const along = e.w >= e.d;
        add(e, along ? e.x0 + 0.25 : e.cx, e.y0 + 0.25, along ? e.cz : e.z0 + 0.25, 1.15, "wall end at the base: stress concentration over the support");
        add(e, along ? e.x1 - 0.25 : e.cx, e.y0 + 0.25, along ? e.cz : e.z1 - 0.25, 1.15, "wall end at the base: stress concentration over the support");
      } else if (e.y0 < 0.01) {
        add(e, r.hot.x, e.y1, r.hot.z, 1.0, "foundation under the most loaded support");
      } else {
        add(e, r.mid.x, e.y0 + e.h / 2, r.mid.z, 1.0, "mid-span: largest sagging moment");
        if (r.over) add(e, r.over.x, e.y0 + e.h / 2, r.over.z, 0.9, "over " + r.over.name + ": hogging moment and punching shear");
      }
    }
    placeSensors(STR.sensors);
  }

  function clearSensors() {
    STR.sensors.forEach(s => { if (s.m) { scene.remove(s.m); s.m.material.dispose(); } });
    STR.sensors = [];
  }
  function placeSensors(arr) {
    // The fixed-sensor builder passes the current array itself.
    const next = arr.slice();
    clearSensors();
    STR.sensors = next;
    const ranked = STR.sensors.slice().sort((a, b) => b.score - a.score);
    ranked.forEach((s, i) => { s.rank = i + 1; s.risk = STR.res.get(s.e).util >= 1; });
    STR.sensors.forEach(s => {
      s.m = new THREE.Mesh(sensorGeo, new THREE.MeshBasicMaterial({ color: s.risk ? 0xff2d55 : 0xff9500, depthTest: false, transparent: true }));
      s.m.position.copy(s.pos); s.m.renderOrder = 22; s.m.userData.sensor = s; scene.add(s.m);
    });
    renderRiskList(ranked.slice(0, 4));
    updateStressVisibility();
  }
  function updateStressVisibility() { STR.sensors.forEach(s => { if (s.m) s.m.visible = STR.on && !MOB.running; }); }

  function stressColor(share) { return new THREE.Color().setHSL(0.62 * (1 - Math.min(1, share)), 0.78, 0.52); }

  function updateStress() {
    if (!STR.on) {
      elements.forEach(e => { if (e.mesh.material !== M.concrete) e.mesh.material = M.concrete; });
      STR.sensors.forEach(s => { s.m.visible = false; });
      document.getElementById("stress-box").hidden = true;
      return;
    }
    const sig = elements.map(e => (formed(e) ? 1 : 0)).join("");
    if (sig !== STR.sig) { STR.sig = sig; clearCrawlers(); computeStress(); setSensorStatus("Rule-based sensors: placed at the known critical points of each element."); }
    elements.forEach(e => {
      const r = STR.res.get(e);
      if (!formed(e) || r.util === undefined) { e.mesh.material = M.concrete; return; }
      if (!e.stressMat) e.stressMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
      applyXray(e.stressMat, NET.xray);
      e.stressMat.color.copy(stressColor(r.util));
      e.mesh.material = e.stressMat;
    });
    updateStressVisibility();
    document.getElementById("stress-box").hidden = false;
  }

  function renderRiskList(top) {
    const box = document.getElementById("risk-list"); if (!box) return;
    box.innerHTML = top.length ? top.map(s => `<li class="${s.risk ? "over-capacity" : ""}"><b>${s.rank}</b>${s.e.name} · ${s.what} · element utilisation ${Math.round(STR.res.get(s.e).util * 100)} % · heuristic search score ${s.score.toFixed(2)}</li>`).join("") : "<li>No formed elements yet.</li>";
  }

  function structuralReading(e) {
    if (!STR.on) return "";
    const r = STR.res.get(e); if (!r || r.util === undefined || !formed(e)) return "";
    const pct = v => Math.round(v * 100) + " %";
    const capacityFactor = e.cap === undefined ? 1 : e.cap;
    let txt;
    if (!e.slab) txt = `Axial force ${Math.round(r.N)} kN · section ${r.A.toFixed(2)} m² · stress ${(r.sigma / 1000).toFixed(2)} MPa<br>Utilisation ${pct(r.util)} of current assumed ${(12 * capacityFactor).toFixed(2)} MPa`;
    else if (e.y0 < 0.01) txt = `Total load ${Math.round(r.N)} kN · soil pressure ${Math.round(r.p)} kPa<br>Utilisation ${pct(r.util)} of current assumed ${(150 * capacityFactor).toFixed(0)} kPa`;
    else txt = `Equivalent q ${(r.qEquivalent || r.q).toFixed(1)} kN/m² (includes loads from above) · effective span ${r.L.toFixed(1)} m · M ${Math.round(r.M)} kNm/m<br>Utilisation ${pct(r.util)} of current assumed ${(120 * capacityFactor).toFixed(1)} kNm/m · uniform-load approximation; local bending and punching shear not resolved`;
    const sens = STR.sensors.filter(s => s.e === e).map(s => `${s.risk ? "⚠ element at/over assumed capacity · sensor #" + s.rank : "sensor #" + s.rank}: ${s.what}`).join("<br>");
    return `<dt>Structural reading (simplified)</dt><dd>${txt}<br>Relative to the most loaded element: ${pct(r.util / STR.maxU)}</dd>` + (sens ? `<dt>Integrity sensors</dt><dd>${sens}</dd>` : "");
  }

  // ================= MOBILE SENSORS (v0.3-B2) =================
  // Local stress field inside an element (engineering rules of thumb, not FEM), as a fraction of capacity.
  const isColumn = e => !e.slab && e.w < 0.7 && e.d < 0.7;
  function localStress(e, p) {
    const r = STR.res.get(e); if (!r || !r.util) return 0;
    const ny = Math.min(1, Math.max(0, (p.y - e.y0) / e.h));
    if (isColumn(e)) return r.util * ((1 - 0.25 * ny) + 0.15 * Math.exp(-(1 - ny) * e.h / 0.3));
    if (!e.slab) {
      const along = e.w >= e.d, s = along ? p.x - e.x0 : p.z - e.z0, L = along ? e.w : e.d;
      const de = Math.min(s, L - s);
      return r.util * (1 + 0.6 * Math.exp(-de / 0.4)) * (1 - 0.25 * ny);
    }
    if (e.y0 < 0.01) {
      const Pmax = Math.max(1e-6, ...r.points.map(q => q.P));
      let peak = 0; r.points.forEach(q => { peak = Math.max(peak, (q.P / Pmax) * Math.exp(-Math.hypot(p.x - q.x, p.z - q.z) / 0.6)); });
      return r.util * (0.5 + 1.5 * peak);
    }
    let d = Infinity; r.sup.forEach(s => { d = Math.min(d, rectDist(p.x, p.z, s)); });
    const gmax = Math.max(1e-6, ...r.sup.map(s => STR.res.get(s).got));
    let hog = 0; r.sup.forEach(s => { hog = Math.max(hog, 0.75 * (STR.res.get(s).got / gmax) * Math.exp(-rectDist(p.x, p.z, s) / 0.35)); });
    return r.util * Math.max((d / r.maxD) ** 2, hog);
  }

  // Search domain of an element: two free coordinates; the third is fixed.
  function domain(e) {
    if (isColumn(e)) return { a: "y", amin: e.y0 + 0.1, amax: e.y1 - 0.1, b: null, fixed: { x: e.cx, z: e.cz } };
    if (!e.slab) {
      const along = e.w >= e.d;
      return along ? { a: "x", amin: e.x0 + 0.05, amax: e.x1 - 0.05, b: "y", bmin: e.y0 + 0.1, bmax: e.y1 - 0.1, fixed: { z: e.cz } }
                   : { a: "z", amin: e.z0 + 0.05, amax: e.z1 - 0.05, b: "y", bmin: e.y0 + 0.1, bmax: e.y1 - 0.1, fixed: { x: e.cx } };
    }
    return { a: "x", amin: e.x0 + 0.1, amax: e.x1 - 0.1, b: "z", bmin: e.z0 + 0.1, bmax: e.z1 - 0.1, fixed: { y: e.y0 < 0.01 ? e.y1 : e.y0 + e.h / 2 } };
  }
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // Stochastic hill climbing: try neighbours, move to a higher-stress point, shrink the step when stuck.
  function climb(e, start, rand) {
    const D = domain(e);
    const toP = (a, b) => { const p = Object.assign({ x: 0, y: 0, z: 0 }, D.fixed); p[D.a] = a; if (D.b) p[D.b] = b; return p; };
    let a = start[0], b = start[1], cur = localStress(e, toP(a, b));
    const span = Math.max(D.amax - D.amin, D.b ? D.bmax - D.bmin : 0);
    let step = Math.max(0.18, span * 0.08);
    const path = [toP(a, b)];
    for (let it = 0; it < 160 && step > 0.03; it++) {
      let best = null, bv = cur;
      for (let k = 0; k < 14; k++) {
        const ang = rand() * Math.PI * 2;
        const na = Math.min(D.amax, Math.max(D.amin, a + Math.cos(ang) * step));
        const nb = D.b ? Math.min(D.bmax, Math.max(D.bmin, b + Math.sin(ang) * step)) : 0;
        const v = localStress(e, toP(na, nb));
        if (v > bv + 1e-9) { bv = v; best = [na, nb]; }
      }
      if (best) { a = best[0]; b = best[1]; cur = bv; path.push(toP(a, b)); } else step *= 0.55;
    }
    return { path, value: cur, end: toP(a, b) };
  }

  function describe(e, p) {
    if (isColumn(e)) return (p.y - e.y0) / e.h < 0.5 ? "found: base of column, largest axial force" : "found: top of column, load enters from the slab";
    if (!e.slab) return "found: near the wall end at the base, stress concentration";
    const r = STR.res.get(e);
    if (e.y0 < 0.01) { let n = null, bd = Infinity; r.points.forEach(q => { const d = Math.hypot(p.x - q.x, p.z - q.z); if (d < bd) { bd = d; n = q.from.name; } }); return "found: under " + n; }
    let n = null, bd = Infinity; r.sup.forEach(s => { const d = rectDist(p.x, p.z, s); if (d < bd) { bd = d; n = s.name; } });
    return bd < 0.8 ? "found: over " + n + ", hogging moment" : "found: mid-span, largest sagging moment";
  }

  const MOB = { running: false, crawlers: [], t: 0, steps: 0 };
  const crawlGeo = new THREE.SphereGeometry(0.11, 12, 8);
  function clearCrawlers() {
    MOB.crawlers.forEach(c => {
      scene.remove(c.m); scene.remove(c.trail);
      c.m.material.dispose(); c.trail.geometry.dispose(); c.trail.material.dispose();
    });
    MOB.crawlers = []; MOB.running = false;
  }

  function deployMobile() {
    if (!STR.on) return;
    clearCrawlers();
    STR.sensors.forEach(s => { s.m.visible = false; });
    const rand = rng(20261018);
    for (const e of elements.filter(formed)) {
      if (/^Parapet/.test(e.name)) continue;
      const D = domain(e);
      const n = isColumn(e) ? 1 : e.slab ? 4 : 2;
      for (let i = 0; i < n; i++) {
        const fa = isColumn(e) ? 0.5 : (i + 0.5) / n, fb = e.slab ? rand() : 0.5;
        const start = [D.amin + (D.amax - D.amin) * fa, D.b ? D.bmin + (D.bmax - D.bmin) * fb : 0];
        const res = climb(e, start, rand);
        const m = new THREE.Mesh(crawlGeo, new THREE.MeshBasicMaterial({ color: 0x00e5ff, depthTest: false, transparent: true }));
        m.renderOrder = 23; scene.add(m);
        const trailGeometry = new THREE.BufferGeometry();
        trailGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array((res.path.length + 1) * 3), 3));
        trailGeometry.setDrawRange(0, 0);
        const trail = new THREE.Line(trailGeometry, new THREE.LineBasicMaterial({ color: 0x00b8e6, transparent: true, opacity: 0.8, depthTest: false }));
        trail.renderOrder = 22; scene.add(trail);
        MOB.crawlers.push({ e, path: res.path.map(q => new THREE.Vector3(q.x, q.y, q.z)), value: res.value, end: res.end, m, trail });
      }
    }
    if (!MOB.crawlers.length) { setSensorStatus("No formed elements to search."); return; }
    MOB.t = 0; MOB.steps = Math.max(...MOB.crawlers.map(c => c.path.length));
    MOB.running = true;
    setSensorStatus(`Searching… ${MOB.crawlers.length} mobile sensors climb towards the highest local stress.`);
  }

  function finishMobile() {
    MOB.running = false;
    // merge crawlers that ended at the same spot of the same element
    const found = [];
    for (const c of MOB.crawlers) {
      const dup = found.find(f => f.e === c.e && f.pos.distanceTo(c.path[c.path.length - 1]) < 0.4);
      if (dup) { if (c.value > dup.score) { dup.score = c.value; dup.pos = c.path[c.path.length - 1].clone(); } continue; }
      found.push({ e: c.e, pos: c.path[c.path.length - 1].clone(), score: c.value, what: describe(c.e, c.end), m: null, mobile: true });
    }
    placeSensors(found);
    chipCard(NET.selected);
    setSensorStatus(`Done: ${MOB.crawlers.length} mobile sensors settled at ${found.length} hotspots (${MOB.steps} search steps). Trails show the route each sensor took.`);
  }

  function animateMobile(dt) {
    if (!MOB.crawlers.length) return;
    if (MOB.running) MOB.t += dt / 0.35;
    const k = Math.min(MOB.t, MOB.steps - 1);
    for (const c of MOB.crawlers) {
      const vis = STR.on;
      c.m.visible = vis && MOB.running; c.trail.visible = vis;
      if (!MOB.running) continue;
      const i = Math.min(Math.floor(k), c.path.length - 1), f = Math.min(1, k - i);
      const j = Math.min(i + 1, c.path.length - 1);
      c.m.position.lerpVectors(c.path[i], c.path[j], i === j ? 0 : f);
      const positions = c.trail.geometry.attributes.position;
      for (let n = 0; n <= i; n++) positions.setXYZ(n, c.path[n].x, c.path[n].y, c.path[n].z);
      positions.setXYZ(i + 1, c.m.position.x, c.m.position.y, c.m.position.z);
      positions.needsUpdate = true;
      c.trail.geometry.setDrawRange(0, i + 2);
      c.trail.geometry.computeBoundingSphere();
      const v = localStress(c.e, c.m.position);
      c.m.material.color.copy(stressColor(v));
    }
    if (MOB.running && MOB.t >= MOB.steps - 1) finishMobile();
  }

  function setSensorStatus(t) { const el = document.getElementById("sensor-status"); if (el) el.textContent = t; }

  // ================= DAMAGE AND LOAD-PLAN RESPONSE (v0.4-C) =================
  const SCEN = {
    impact: { label: "Impact", el: "Column G5", kind: "fail", text: "an impact destroys column G5 (front, middle)" },
    crack:  { label: "Crack", el: "Back wall G-left", kind: "crack", cap: 0.35, text: "a crack weakens the back wall (left) to 35 % of its capacity" },
    fire:   { label: "Overheating", el: "Column U3", kind: "fire", cap: 0.45, text: "overheating weakens column U3 (upper, front-left) to 45 %" },
    leak:   { label: "Water leak", el: "First floor slab", kind: "leak", cap: 0.7, text: "a water leak soaks the first floor slab; rebar corrosion risk, 70 % capacity" }
  };
  const DMG = { key: null, phase: -1, t: 0, objs: [], pulses: [], robotGoal: null, snap: {}, rows: [], log: [] };
  const redMat = new THREE.MeshBasicMaterial({ color: 0xff2d55, depthTest: false, transparent: true });
  const propMat = new THREE.MeshStandardMaterial({ color: 0xf2b200, roughness: 0.4, metalness: 0.5 });
  const el = n => elements.find(e => e.name === n);

  function addObj(o) { scene.add(o); DMG.objs.push(o); return o; }
  function removeDamageObjects(predicate = () => true) {
    const removed = DMG.objs.filter(predicate), kept = DMG.objs.filter(o => !removed.includes(o));
    const geometries = new Set(), materials = new Set();
    removed.forEach(o => { scene.remove(o); if (o.geometry) geometries.add(o.geometry); if (o.material) materials.add(o.material); });
    kept.forEach(o => { geometries.delete(o.geometry); materials.delete(o.material); });
    geometries.delete(pulseGeo); materials.delete(redMat); materials.delete(propMat);
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
    DMG.objs = kept; DMG.pulses = DMG.pulses.filter(p => !removed.includes(p.m));
  }
  function snapshot() { const m = new Map(); elements.forEach(e => { const r = STR.res.get(e); if (r && r.util !== undefined && formed(e)) m.set(e.name, r.util); }); return m; }
  function recompute() { STR.sig = ""; clearCrawlers(); update(T, false); }

  function logStep(t) { DMG.log.push(t); renderDamage(); }

  function startDamage(key) {
    resetDamage(true);
    stop(); setT(T_MAX);
    document.getElementById("lay-stress").checked = true; layersChanged();
    const s = SCEN[key], e = el(s.el);
    DMG.key = key; DMG.phase = 0; DMG.t = 0; DMG.e = e; DMG.log = [];
    recompute(); DMG.snap.before = snapshot();
    logStep(`<b>Event</b>: ${s.text}.`);
    // visual of the event
    if (s.kind === "fail") {
      e.failed = true; e.mesh.visible = false;
      const stub = new THREE.Mesh(new THREE.BoxGeometry(e.w, e.h * 0.3, e.d), new THREE.MeshStandardMaterial({ color: 0x5b5753, roughness: 1 }));
      stub.position.set(e.cx, e.y0 + e.h * 0.15, e.cz); stub.castShadow = true; stub.userData.stub = true; addObj(stub);
      for (let i = 0; i < 9; i++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.15 + Math.random() * 0.25, 0.12 + Math.random() * 0.15, 0.15 + Math.random() * 0.2), new THREE.MeshStandardMaterial({ color: 0x8d8780, roughness: 1 }));
        b.position.set(e.cx + (Math.random() - 0.5) * 2, e.y0 + 0.08, e.cz + (Math.random() - 0.3) * 1.6); b.rotation.set(Math.random(), Math.random(), Math.random()); b.castShadow = true; b.userData.debris = true; addObj(b);
      }
    } else if (s.kind === "crack") {
      e.cap = s.cap;
      const zf = [e.z0 - 0.02, e.z1 + 0.02];
      zf.forEach(z => { let x = e.x0 + e.w * 0.3, y = e.y0 + 0.1; const pts = [V(x, y, z)];
        for (let i = 0; i < 9; i++) { x += 0.2 + Math.random() * 0.2; y += 0.28; pts.push(V(x + (i % 2 ? 0.12 : -0.12), Math.min(y, e.y1 - 0.1), z)); }
        for (let i = 0; i < pts.length - 1; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 6).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({ color: 0x3a0a0a })); between(c, pts[i], pts[i + 1]); c.userData.crack = true; addObj(c); } });
    } else if (s.kind === "fire") {
      e.cap = s.cap;
      const glow = new THREE.Mesh(new THREE.SphereGeometry(1.1, 20, 14), new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.28, depthWrite: false }));
      glow.position.set(e.cx, e.y0 + e.h / 2, e.cz); glow.userData.flicker = true; addObj(glow);
      const light = new THREE.PointLight(0xff7a1a, 2.2, 6); light.position.copy(glow.position); light.userData.flicker = true; addObj(light);
    } else if (s.kind === "leak") {
      e.cap = s.cap;
      const puddle = new THREE.Mesh(new THREE.CircleGeometry(1.4, 32), new THREE.MeshBasicMaterial({ color: 0x2f6fde, transparent: true, opacity: 0.45, depthWrite: false }));
      puddle.rotation.x = -Math.PI / 2; puddle.position.set(1.2, e.y1 + 0.02, -2.2); puddle.userData.puddle = true; addObj(puddle);
      for (let i = 0; i < 14; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0x5b8ff0 })); d.position.set(1.2 + (Math.random() - 0.5) * 1.6, e.y0 - Math.random() * 3, -2.2 + (Math.random() - 0.5) * 1.4); d.userData.drip = e.y0; d.userData.puddle = true; addObj(d); }
    }
    addMarker(); renderDamage();
  }

  // alarm wave: breadth-first over the nervous links, starting at the damaged element's chip
  function alarmWave(e) {
    const level = new Map([[e, 0]]); const q = [e]; const waves = [];
    while (q.length) {
      const a = q.shift(), k = level.get(a);
      for (const L of a.chip.links) {
        const b = L.hub ? null : (L.ea === a ? L.eb : L.ea);
        const from = a.chip.mesh.position, to = L.hub ? L.hub.mesh.position : b.chip.mesh.position;
        waves.push({ from, to, delay: k * 0.35 });
        if (b && !level.has(b) && k < 4) { level.set(b, k + 1); q.push(b); }
      }
    }
    DMG.pulses = waves.map(w => { const m = new THREE.Mesh(pulseGeo, redMat); m.renderOrder = 24; m.visible = false; addObj(m); return Object.assign(w, { m, t: -w.delay }); });
    return Math.max(...level.values());
  }

  function respond() {
    const s = SCEN[DMG.key], e = DMG.e;
    // 1) temporary prop next to the damaged support (except for the slab leak)
    const slabAbove = elements.find(x => x.slab && Math.abs(x.y0 - e.y1) < 0.05);
    let propAt = null;
    if (s.kind === "fail" || s.kind === "fire") propAt = { x: e.cx * 0.85, z: e.cz * 0.85 };
    if (s.kind === "crack") propAt = { x: e.cx, z: e.z1 + 0.6 };
    if (propAt) {
      const P = { name: "Temporary prop", x0: propAt.x - 0.12, x1: propAt.x + 0.12, y0: e.y0, y1: e.y1, z0: propAt.z - 0.12, z1: propAt.z + 0.12, slab: false, pf: 1, prop: true };
      Object.assign(P, { w: 0.24, h: e.y1 - e.y0, d: 0.24, cx: propAt.x, cz: propAt.z });
      STR.props = [P];
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.24, P.h, 0.24), propMat); m.position.set(P.cx, e.y0 + P.h / 2, P.cz); m.castShadow = true; m.scale.y = 0.001; m.userData.grow = true; addObj(m);
      const ri = propAt.x <= 0 ? 0 : 1;
      DMG.robotGoal = []; DMG.robotGoal[ri] = { base: new THREE.Vector3(P.cx + (ri ? 1.2 : -1.2) * 0.6, e.y0, P.cz - 1.2), head: new THREE.Vector3(P.cx, e.y1 - 0.2, P.cz), e: null };
      logStep(`<b>Response</b>: robot c${ri + 1} installs a temporary steel prop next to ${e.name}.`);
    }
    // 2) restricted zone on the slab above (or on the leaking slab itself): use load set to zero there
    const zoneSlab = s.kind === "leak" ? e : slabAbove;
    if (zoneSlab) {
      const zx = s.kind === "leak" ? 1.2 : e.cx, zz = s.kind === "leak" ? -2.2 : e.cz;
      const zone = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.06, 3.2), new THREE.MeshBasicMaterial({ color: 0xff2d55, transparent: true, opacity: 0.28, depthWrite: false }));
      zone.position.set(Math.max(zoneSlab.x0 + 1.6, Math.min(zoneSlab.x1 - 1.6, zx)), zoneSlab.y1 + 0.05, Math.max(zoneSlab.z0 + 1.6, Math.min(zoneSlab.z1 - 1.6, zz))); addObj(zone);
      zoneSlab.liveZone = { x0: zone.position.x - 1.6, x1: zone.position.x + 1.6, z0: zone.position.z - 1.6, z1: zone.position.z + 1.6 };
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(zone.geometry), new THREE.LineBasicMaterial({ color: 0xff2d55 })); edges.position.copy(zone.position); addObj(edges);
      logStep(`<b>Load plan</b>: zone on ${zoneSlab.name} closed, use load set to 0 there.`);
    }
    // 3) neighbours stiffen within their DNA range (+20 % capacity), shown with cyan outlines
    const dpt = s.kind === "leak" ? { x: 1.2, z: -2.2 } : { x: e.cx, z: e.cz };
    const nb = e.chip.links.filter(L => !L.hub).map(L => (L.ea === e ? L.eb : L.ea))
      .filter(x => formed(x) && !/^Parapet/.test(x.name) && x.y0 > 0.01 && rectDist(dpt.x, dpt.z, x) < 3.5);
    nb.forEach(x => {
      x.cap = (x.cap || 1) * 1.2;
      const o = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(x.w + 0.06, x.h + 0.06, x.d + 0.06)), new THREE.LineBasicMaterial({ color: 0x00e5ff, depthTest: false, transparent: true }));
      o.position.set(x.cx, x.y0 + x.h / 2, x.cz); o.renderOrder = 23; addObj(o);
    });
    if (nb.length) logStep(`<b>Adaptation</b>: ${nb.length} neighbouring elements stiffen within their DNA range (+20 % capacity, cyan outlines).`);
    if (s.kind === "leak") logStep("<b>Utilities</b>: water branch in the slab closed by the controller; drying started.");
  }

  function animateDamage(dt, now) {
    if (DMG.phase < 0) return;
    DMG.t += dt;
    DMG.objs.forEach(o => {
      if (o.userData.flicker) { if (o.isLight) o.intensity = 1.6 + Math.random() * 1.4; else o.material.opacity = 0.2 + Math.random() * 0.15; }
      if (o.userData.drip !== undefined) { o.position.y -= dt * 3; if (o.position.y < 0.55) o.position.y = o.userData.drip; }
      if (o.userData.grow && DMG.phase >= 3) o.scale.y = Math.min(1, o.scale.y + dt * 0.6);
    });
    DMG.pulses.forEach(p => { p.t += dt; const f = p.t / 0.35; p.m.visible = f > 0 && f < 1; if (p.m.visible) p.m.position.lerpVectors(p.from, p.to, f); });
    if (DMG.phase === 0 && DMG.t > 1.5) {
      DMG.phase = 1; DMG.t = 0;
      const hops = alarmWave(DMG.e);
      logStep(`<b>Detection</b>: the chip of ${DMG.e.name} raises an alarm; it reaches both controllers in ${hops} hops over the nervous network.`);
    } else if (DMG.phase === 1 && DMG.t > 2.2) {
      DMG.phase = 2; DMG.t = 0;
      recompute(); DMG.snap.after = snapshot();
      const over = [...DMG.snap.after].filter(([, u]) => u > 1).map(([n]) => n);
      logStep(`<b>Redistribution</b>: loads recalculated without / with reduced ${DMG.e.name}. ` + (over.length ? `Over capacity: ${over.join(", ")}.` : "No element exceeds its capacity, but the margins shrink."));
    } else if (DMG.phase === 2 && DMG.t > 2.2) {
      DMG.phase = 3; DMG.t = 0;
      respond(); recompute(); DMG.snap.resp = snapshot();
    } else if (DMG.phase === 3 && DMG.t > 2.5 && !DMG.done) {
      DMG.done = true;
      logStep("<b>Stable</b>: new load plan in force. Choose the centre to repair from (★ = lowest cost J).");
      renderRepair();
    }
    animateRepair(dt);
    if (DMG.robotGoal || DMG.rec) update(T, true);
    if (DMG.e && !DMG.finished) { const cm = DMG.e.chip.mesh; cm.visible = true; cm.material = redMat; cm.scale.setScalar(1.6 + 0.5 * Math.sin(now / 150)); }
  }

  function resetDamage(silent) {
    removeDamageObjects(); DMG.focus = null;
    elements.forEach(e => { delete e.failed; delete e.cap; delete e.liveF; delete e.liveZone; e.mesh.visible = e.pf > 0; });
    if (DMG.e) { DMG.e.chip.mesh.material = chipMat; DMG.e.chip.mesh.scale.setScalar(1); }
    elements.forEach(e => { delete e.rebuild; delete e.rebuilding; });
    STR.props = []; DMG.robotGoal = null; DMG.key = null; DMG.phase = -1; DMG.e = null; DMG.done = false; DMG.rec = null; DMG.finished = false; DMG.snap = {}; DMG.log = [];
    if (document.getElementById("rep-box")) renderRepair();
    if (!silent) recompute();
    renderDamage();
  }

  function renderDamage() {
    renderPhases();
    const box = document.getElementById("dmg-log"); if (!box) return;
    box.innerHTML = DMG.log.map(t => `<li>${t}</li>`).join("");
    const tb = document.getElementById("dmg-table");
    const S = DMG.snap;
    if (!S.after) { tb.innerHTML = ""; return; }
    const names = [...S.after.keys()].sort((a, b) => (S.after.get(b) - (S.before.get(b) || 0)) - (S.after.get(a) - (S.before.get(a) || 0))).slice(0, 5);
    const pct = v => v === undefined ? "—" : Math.round(v * 100) + " %";
    const cls = v => v === undefined ? "" : v > 1 ? "bad" : v > 0.8 ? "warn" : "";
    tb.innerHTML = `<tr><th>Element</th><th>Before</th><th>After damage</th><th>After response</th><th>After repair</th></tr>` +
      names.map(n => `<tr><td>${n}</td><td>${pct(S.before.get(n))}</td><td class="${cls(S.after.get(n))}">${pct(S.after.get(n))}</td><td class="${cls(S.resp && S.resp.get(n))}">${S.resp ? pct(S.resp.get(n)) : "…"}</td><td>${S.rep ? pct(S.rep.get(n)) : "…"}</td></tr>`).join("");
  }

  // ================= RECOVERY FROM A CENTRE (v0.5-D) =================
  const LESSON = {
    impact: "The open front span relied on one middle column. Next generation: add redundancy at the open front (a second column or a deeper slab edge).",
    crack: "The crack started at the wall end over its support. Next generation: more reinforcement at wall ends and a sensor there from the start.",
    fire: "An upper column near the facade lost strength from heat. Next generation: fire-resistant cover for upper columns at the facade.",
    leak: "The leak came from the riser near the core. Next generation: water risers in a drained shaft with leak sensors at slab level."
  };
  const MATERIAL = { impact: 4, crack: 1.5, fire: 2, leak: 2.5 };
  function damagePoint() { const s = SCEN[DMG.key], e = DMG.e; return s.kind === "leak" ? { x: 1.2, y: e.y1, z: -2.2 } : { x: e.cx, y: e.y0, z: e.cz }; }

  function repairOptions() {
    const p = damagePoint();
    const opts = CENTRES.map((c, i) => {
      const dist = Math.hypot(p.x - c.x, p.z - c.z), climb = p.y;
      const reach = dist <= 7.5;
      const time = dist + climb * 1.5 + 3;
      const J = Math.round((0.4 * time + MATERIAL[DMG.key] + 1.5 * (dist / 4)) * 10) / 10;
      return { i, label: "c" + (i + 1), dist, climb, time, J, ok: reach };
    });
    const ok = opts.filter(o => o.ok); const best = ok.reduce((a, b) => (b.J < a.J ? b : a), ok[0]);
    if (best) best.best = true;
    return opts;
  }

  function renderRepair() {
    const box = document.getElementById("rep-box");
    if (!DMG.done || DMG.rec) { box.hidden = !DMG.rec; if (DMG.rec) box.querySelector(".rep-opts").innerHTML = ""; return; }
    box.hidden = false;
    box.querySelector(".rep-opts").innerHTML = repairOptions().map(o =>
      `<button data-rep="${o.i}" ${o.ok ? "" : "disabled"}>${o.best ? "★ " : ""}Repair from ${o.label} · J ${o.J}${o.ok ? "" : " · out of reach"}</button>`).join("");
    box.querySelectorAll("[data-rep]").forEach(b => b.addEventListener("click", () => startRepair(+b.dataset.rep)));
  }

  function startRepair(ci) {
    if (DMG.rec || !DMG.done) return;
    const s = SCEN[DMG.key], e = DMG.e, p = damagePoint(), o = repairOptions()[ci];
    DMG.rec = { ci, phase: 0, t: 0 }; addRoute(ci);
    document.getElementById("net-repair").checked = true; layersChanged();
    logStep(`<b>Recovery</b>: centre c${ci + 1} selected (cost J ${o.J}: ${o.dist.toFixed(1)} m away, ${o.climb.toFixed(1)} m up). Robot c${ci + 1} drives to the damage; repair material flows from the tanks through the red network and the hose.`);
    const stand = { x: p.x + (p.x < CENTRES[ci].x ? 1.3 : -1.3), z: p.z + (p.z > 0 ? -1.3 : 1.3) };
    DMG.robotGoal = []; DMG.robotGoal[ci] = { base: new THREE.Vector3(stand.x, s.kind === "leak" ? e.y1 : e.y0, stand.z), head: new THREE.Vector3(p.x, (s.kind === "leak" ? e.y1 : e.y0) + 0.6, p.z), e: null };
    renderRepair();
  }

  function animateRepair(dt) {
    const R = DMG.rec; if (!R) return;
    const s = SCEN[DMG.key], e = DMG.e, p = damagePoint();
    R.t += dt;
    const goal = DMG.robotGoal && DMG.robotGoal[R.ci];
    if (R.phase === 0 && R.t > 2.5) {
      R.phase = 1; R.t = 0;
      removeDamageObjects(o => o.userData.stub || o.userData.debris || o.userData.flicker);
      if (s.kind === "fail") { e.failed = false; e.rebuilding = true; e.rebuild = 0.3; }
      else e.rebuilding = true;
      logStep(s.kind === "fail" ? `<b>Re-formation</b>: debris cleared; ${e.name} is formed again layer by layer from the remaining stub, around a new cage.`
        : s.kind === "crack" ? `<b>Re-formation</b>: the crack is opened, cleaned and injected with repair material; the wall end is locally re-formed.`
        : s.kind === "fire" ? `<b>Re-formation</b>: the overheated cover of ${e.name} is removed and re-formed with new material.`
        : `<b>Re-formation</b>: the slab is dried; the corroded zone is opened and re-formed; the water branch is repaired.`);
    } else if (R.phase === 1) {
      const k = Math.min(1, R.t / 5); R.k = k;
      if (s.kind === "fail") {
        e.rebuild = 0.3 + 0.7 * k;
        if (goal) goal.head.set(e.cx + Math.sin(R.t * 6) * 0.15, e.y0 + e.h * e.rebuild + 0.3, e.cz);
      } else {
        if (goal) goal.head.set(p.x + Math.sin(R.t * 4) * 0.8, p.y + (s.kind === "leak" ? 0.3 : 0.4 + 2.4 * k), p.z + Math.cos(R.t * 3) * 0.3);
        DMG.objs.forEach(o => { if (o.userData.crack || o.userData.puddle) o.scale.setScalar(Math.max(0.001, 1 - k)); });
      }
      if (k >= 1) {
        R.phase = 2; R.t = 0;
        delete e.rebuild; delete e.rebuilding; delete e.cap; e.failed = false;
        logStep(`<b>Restored</b>: ${e.name} is back to full capacity.`);
      }
    } else if (R.phase === 2) {
      DMG.objs.forEach(o => { if (o.userData.grow) o.scale.y = Math.max(0.001, o.scale.y - dt * 0.8); });
      if (R.t > 1.6) {
        R.phase = 3; R.t = 0;
        removeDamageObjects(o => !o.userData.keep);
        STR.props = [];
        elements.forEach(x => { delete x.cap; delete x.liveF; delete x.liveZone; });
        DMG.robotGoal = null; recompute(); DMG.snap.rep = snapshot();
        logStep("<b>Load plan restored</b>: temporary prop removed, zone reopened, neighbours relax to their normal state.");
        logStep(`<b>Experience → Cloud DNA</b>: ${LESSON[DMG.key]}`);
        DMG.e.chip.mesh.material = chipMat; DMG.e.chip.mesh.scale.setScalar(1);
        DMG.finished = true; renderDamage();
      }
    }
  }

  // ================= ARCHITECTURAL PROJECT OVERLAY (v0.6) =================
  // A real project (glTF/GLB or OBJ) is laid over the scheme and fitted to it.
  // Affine fit = separate scale factors for x, y, z (straight lines and parallels stay); proportional fit = one factor.
  const PRJ = { root: null, rot: null, model: null, name: "", ref: null, groundY: null, turn: 0, mode: "affine", opacity: 1, visible: true, source: "", H: 1e6,
    clipBelow: new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6), clipAbove: new THREE.Plane(new THREE.Vector3(0, 1, 0), -1e6) };
  const ghostMat = new THREE.LineBasicMaterial({ color: 0x6b7a80, transparent: true, opacity: 0.35, depthWrite: false, clippingPlanes: [PRJ.clipAbove] });
  const TARGET = { x: 10.0, z: 8.0, y0: 0.5, h: 6.8 }; // the scheme: columns from x −5…5, z −4…4, from the foundation top to the roof top
  function b64ToBuf(b64) { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u.buffer; }

  function removeProject() {
    if (PRJ.root) scene.remove(PRJ.root);
    PRJ.root = PRJ.rot = PRJ.model = null; PRJ.name = ""; PRJ.source = "";
    renderProject();
  }

  function useModel(obj, name, source, groundY) {
    removeProject();
    PRJ.model = obj; PRJ.name = name; PRJ.source = source || ""; PRJ.groundY = groundY;
    PRJ.rot = new THREE.Group(); PRJ.rot.add(obj);
    PRJ.root = new THREE.Group(); PRJ.root.add(PRJ.rot); scene.add(PRJ.root);
    obj.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow = true; o.receiveShadow = true;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(m => { m.userData.baseOpacity = m.opacity === undefined ? 1 : m.opacity; m.side = THREE.DoubleSide; m.clippingPlanes = [PRJ.clipBelow]; });
    });
    // outline of the whole project: shown above the current formation height as the "target" the body grows into
    const meshes = []; obj.traverse(o => { if (o.isMesh) meshes.push(o); });
    meshes.forEach(o => { const g = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 25), ghostMat); g.userData.ghost = true; o.add(g); });
    // reference = walls if the file has them (by node name), otherwise the whole model
    const walls = []; obj.traverse(o => { if (o.isMesh && /wall/i.test(o.name || (o.parent && o.parent.name) || "")) walls.push(o); });
    PRJ.refObjs = walls.length ? walls : [obj];
    const b = refBox(); PRJ.turn = (b.max.z - b.min.z) > (b.max.x - b.min.x) ? 1 : 0; // long side along x like the scheme
    fitProject(); updateProjectClip();
  }

  function refBox() {
    PRJ.root && PRJ.root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(PRJ.root ? PRJ.root.matrixWorld : new THREE.Matrix4()).invert();
    const box = new THREE.Box3();
    PRJ.refObjs.forEach(o => { o.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(o); box.union(bb); });
    return box.applyMatrix4(inv); // in root-local space (after rotation, before scale/position)
  }

  function fitProject() {
    if (!PRJ.root) return;
    PRJ.rot.rotation.y = PRJ.turn * Math.PI / 2;
    PRJ.root.scale.set(1, 1, 1); PRJ.root.position.set(0, 0, 0);
    const b = refBox();
    const gy = PRJ.groundY === null || PRJ.groundY === undefined ? b.min.y : PRJ.groundY;
    const sx0 = b.max.x - b.min.x, sz0 = b.max.z - b.min.z, sy0 = Math.max(0.1, b.max.y - gy);
    let k;
    if (PRJ.mode === "affine") k = { x: TARGET.x / sx0, y: TARGET.h / sy0, z: TARGET.z / sz0 };
    else { const s = Math.min(TARGET.x / sx0, TARGET.z / sz0); k = { x: s, y: s, z: s }; }
    PRJ.k = k; PRJ.size = { x: sx0, y: sy0, z: sz0 };
    PRJ.root.scale.set(k.x, k.y, k.z);
    const cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2;
    PRJ.root.position.set(-cx * k.x, TARGET.y0 - gy * k.y, -cz * k.z);
    applyProjectLook(); renderProject();
  }

  // the project is shown up to the current height of the forming body; above it only its outline
  function updateProjectClip() {
    if (!PRJ.root) return;
    let H = 0; elements.forEach(e => { if (e.pf > 0) H = Math.max(H, e.y0 + e.h * e.pf); });
    if (T >= T_MAX - 0.001) H = 1e6;
    PRJ.H = H; PRJ.clipBelow.constant = H; PRJ.clipAbove.constant = -H;
    const lbl = document.getElementById("prj-grow");
    if (lbl) lbl.textContent = H >= 1e6 ? "Project complete: the body has reached the full height of the project." : `Grows with construction: real project shown up to ${H.toFixed(1)} m (current formation height); above it, its outline.`;
  }

  function applyProjectLook() {
    if (!PRJ.root) return;
    PRJ.root.visible = PRJ.visible;
    PRJ.root.traverse(o => {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
        const op = Math.min(m.userData.baseOpacity, PRJ.opacity);
        m.transparent = op < 1; m.opacity = op; m.depthWrite = op >= 1; m.needsUpdate = true;
      });
    });
  }

  function renderProject() {
    const info = document.getElementById("prj-info"); if (!info) return;
    const on = !!PRJ.root;
    document.querySelectorAll(".prj-on").forEach(x => { x.disabled = !on; });
    if (!on) { info.innerHTML = "No project loaded. The scheme is a relational model: it can be fitted to any real project."; return; }
    const f = v => v.toFixed(2);
    info.innerHTML = `<b>${PRJ.name}</b><br>Project size (reference${PRJ.refObjs.length > 1 || PRJ.refObjs[0] !== PRJ.model ? ": walls" : ""}): ${PRJ.size.x.toFixed(1)} × ${PRJ.size.z.toFixed(1)} m, height ${PRJ.size.y.toFixed(1)} m<br>` +
      `${PRJ.mode === "affine" ? "Affine fit" : "Proportional fit"}: x × ${f(PRJ.k.x)} · y × ${f(PRJ.k.y)} · z × ${f(PRJ.k.z)} · turned ${PRJ.turn * 90}°` +
      `<br><span id="prj-grow"></span>` + (PRJ.source ? `<br><span class="src">${PRJ.source}</span>` : "");
    document.getElementById("prj-mode").textContent = PRJ.mode === "affine" ? "Fit: affine" : "Fit: proportional";
    document.getElementById("prj-show").textContent = PRJ.visible ? "Hide" : "Show";
    updateProjectClip();
  }

  function loadSample() {
    const b64 = window.SAMPLE_PROJECTS && window.SAMPLE_PROJECTS.duplex;
    if (!b64) { document.getElementById("prj-info").textContent = "Sample file projects/duplex.glb.js is missing."; return; }
    new THREE.GLTFLoader().parse(b64ToBuf(b64), "", g => useModel(g.scene, "Duplex Apartment · Revit 2011, two storeys",
      'Source: BSI (2020) "Duplex Apartment Test Files", buildingSMART International · <a href="https://github.com/buildingsmart-community/Community-Sample-Test-Files" target="_blank" rel="noopener noreferrer">GitHub ↗</a> · CC BY 4.0 · converted from IFC, furniture removed (see projects/ATTRIBUTION.md)', 0),
      err => { document.getElementById("prj-info").textContent = "Could not read the sample: " + err; });
  }

  function loadFile(file) {
    const name = file.name, ext = name.split(".").pop().toLowerCase();
    const rd = new FileReader();
    rd.onerror = () => { document.getElementById("prj-info").textContent = "Could not read the file."; };
    if (ext === "obj") {
      rd.onload = () => { const o = new THREE.OBJLoader().parse(rd.result); o.traverse(m => { if (m.isMesh) m.material = new THREE.MeshStandardMaterial({ color: 0xd9d4c8, roughness: 0.85 }); }); useModel(o, name + " · OBJ", "Your file", null); };
      rd.readAsText(file);
    } else if (ext === "glb" || ext === "gltf") {
      rd.onload = () => new THREE.GLTFLoader().parse(rd.result, "", g => useModel(g.scene, name + " · glTF", "Your file", null),
        err => { document.getElementById("prj-info").textContent = "Could not read the file (a .gltf with separate .bin/texture files will not work; export as .glb): " + err; });
      rd.readAsArrayBuffer(file);
    } else document.getElementById("prj-info").textContent = "Use a .glb, .gltf or .obj file (export from Revit, ArchiCAD, SketchUp, Blender…).";
  }

  // ================= DAMAGE CLARITY: phases, 3D label, marker, route, camera (v0.7) =================
  const PHASES = ["Event", "Detection", "Redistribution", "Response", "Repair", "Restored"];
  const KIND_WORD = { fail: "destroyed", crack: "cracked", fire: "overheated", leak: "leaking" };
  function phaseIndex() { if (DMG.finished) return 5; if (DMG.rec) return 4; return DMG.phase; }
  function renderPhases() {
    const ol = document.getElementById("phases"); if (!ol) return;
    const k = DMG.key ? phaseIndex() : -1;
    ol.innerHTML = PHASES.map((p, i) => `<li class="${i < k || (k === 5 && i === 5) ? "done" : i === k ? "now" : ""}">${i < k || (k === 5 && i === 5) ? "✓ " : ""}${p}</li>`).join("");
  }
  function addMarker() {
    const p = damagePoint();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.07, 10, 48), new THREE.MeshBasicMaterial({ color: 0xff2d55, depthTest: false, transparent: true }));
    ring.rotation.x = Math.PI / 2; ring.position.set(p.x, p.y + 0.05, p.z); ring.renderOrder = 25; ring.userData.marker = true; addObj(ring);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), ring.material);
    pin.position.set(p.x, p.y + 0.6, p.z); pin.renderOrder = 25; pin.userData.marker = true; addObj(pin);
    DMG.focus = new THREE.Vector3(p.x, p.y + 1, p.z);
  }
  function addRoute(ci) {
    const c = CENTRES[ci], p = damagePoint();
    const pts = [V(c.x, 0.6, c.z), V((c.x + p.x) / 2, Math.max(0.6, p.y) + 1.2, (c.z + p.z) / 2), V(p.x, p.y + 0.2, p.z)];
    const curve = new THREE.QuadraticBezierCurve3(pts[0], pts[1], pts[2]);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), new THREE.LineDashedMaterial({ color: 0x1f8a5b, dashSize: 0.25, gapSize: 0.15, depthTest: false, transparent: true }));
    line.computeLineDistances(); line.renderOrder = 25; line.userData.route = true; addObj(line);
  }
  function labelText() {
    const s = SCEN[DMG.key], e = DMG.e, R = DMG.rec;
    if (DMG.finished) return ["✓ " + e.name + " restored", "ok"];
    if (R) {
      if (R.phase === 0) return [`Robot c${R.ci + 1} on the way to ${e.name}`, "ok"];
      if (R.phase === 1) return [`Re-forming ${e.name}: ${Math.round((R.k || 0) * 100)} %`, "ok"];
      return ["Removing the temporary prop", "ok"];
    }
    if (DMG.phase === 0) return [`⚠ ${e.name} ${KIND_WORD[s.kind]}`, "bad"];
    if (DMG.phase === 1) return [`⚠ ${e.name}: alarm on the nervous network`, "bad"];
    if (DMG.phase === 2) {
      const worst = DMG.snap.after ? [...DMG.snap.after].sort((a, b) => b[1] - a[1])[0] : null;
      return [`⚠ Loads moved · ${worst ? worst[0] + " " + Math.round(worst[1] * 100) + " %" : ""}`, "bad"];
    }
    return [DMG.done ? `⚠ ${e.name}: secured, waiting for repair` : `⚠ ${e.name}: prop and zone being set`, "warn"];
  }
  function updateDamageView() {
    const lab = document.getElementById("dmg-label");
    if (!DMG.e || MODE !== "dmg") { lab.hidden = true; return; }
    const p = damagePoint(); const v = new THREE.Vector3(p.x, p.y + 1.4, p.z).project(camera);
    const r = canvas.getBoundingClientRect();
    const [txt, cls] = labelText();
    lab.hidden = v.z > 1; lab.className = "dmg-label " + cls; lab.textContent = txt;
    lab.style.left = (r.left + (v.x + 1) / 2 * r.width) + "px"; lab.style.top = (r.top + (1 - v.y) / 2 * r.height) + "px";
    const green = DMG.rec || DMG.finished;
    DMG.objs.forEach(o => { if (o.userData.marker) { o.material.color.setHex(green ? 0x1f8a5b : 0xff2d55); if (o.geometry.type === "TorusGeometry") o.scale.setScalar(1 + 0.15 * Math.sin(performance.now() / 200)); } });
    if (DMG.focus && !drag) {
      target.lerp(DMG.focus, 0.05); orbit.radius += (26 - orbit.radius) * 0.05; placeCamera();
      if (target.distanceTo(DMG.focus) < 0.03 && Math.abs(orbit.radius - 26) < 0.1) DMG.focus = null;
    }
  }

  // ================= MODES (v0.7) =================
  let MODE = "build";
  const HINT = {
    build: "Watch the body form from the centres: drag the time slider or press Play. You can lay a real architectural project over the scheme.",
    mon: "The finished building in use: its nervous system (control), utility networks and stress map. Use the integrity sensors to find the risk points.",
    dmg: "Break one part and follow the building's response: where it broke, how the loads move, how it is secured, repaired, and what it learns."
  };
  function setMode(m) {
    if (MODE === "dmg" && m !== "dmg") resetDamage(false);
    MODE = m; stop();
    document.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.mode === m)));
    document.querySelectorAll("[data-m]").forEach(el => el.classList.toggle("mode-off", !el.dataset.m.split(" ").includes(m)));
    document.getElementById("mode-hint").textContent = HINT[m];
    if (m === "build") { document.getElementById("lay-stress").checked = false; clearCrawlers(); layersChanged(); }
    else setT(T_MAX);
    if (m === "dmg") { document.getElementById("lay-stress").checked = true; layersChanged(); }
    renderPhases();
  }

  // ---------------- time evaluation ----------------
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const prog = (T, [a, b]) => clamp01((T - a) / (b - a));
  let showRebar = true;

  function robotGoal(r, T) {
    // active element for this robot
    for (const e of elements) {
      const p = prog(T, e.fill);
      if (p <= 0 || p >= 1) continue;
      if (e.robot !== "both" && e.robot !== r.i) continue;
      const top = e.y0 + e.h * p;
      let hx, hz, bx, bz, by;
      if (e.robot === "both") {
        const xa = r.i === 0 ? e.x0 + 0.6 : e.cx + 0.3, xb = r.i === 0 ? e.cx - 0.3 : e.x1 - 0.6;
        hx = xa + (xb - xa) * p;
        hz = e.z0 + 0.8 + (e.d - 1.6) * (0.5 + 0.5 * Math.sin(p * 26 + r.i * 2));
        bx = hx; bz = hz > 0 ? hz - 1.7 : hz + 1.7; by = e.y1;
        return { head: new THREE.Vector3(hx, e.y1 + 0.25, hz), base: new THREE.Vector3(bx, by, bz), e };
      }
      const s = 0.5 + 0.5 * Math.sin(p * 22);
      if (e.w >= e.d) { hx = e.x0 + 0.2 + (e.w - 0.4) * s; hz = e.cz; } else { hx = e.cx; hz = e.z0 + 0.2 + (e.d - 0.4) * s; }
      const dir = new THREE.Vector2(-hx, -hz); if (dir.length() < 0.01) dir.set(0, 1); dir.normalize();
      bx = hx + dir.x * 1.7; bz = hz + dir.y * 1.7; by = e.y0;
      return { head: new THREE.Vector3(hx, top + 0.3, hz), base: new THREE.Vector3(bx, by, bz), e };
    }
    return null;
  }

  function update(T, smooth) {
    for (const e of elements) {
      const pr = prog(T, e.rebar), pf = prog(T, e.fill); e.pr = pr; e.pf = pf;
      // rebar
      e.cage.visible = showRebar && pr > 0 && (pf < 1 || T < T_MAX - 0.02);
      if (e.slab) { e.cage.geometry.setDrawRange(0, Math.floor(e.segs * pr / 2) * 2); }
      else { e.cage.scale.y = Math.max(pr, 0.001); }
      // concrete
      e.mesh.visible = pf > 0 && !e.failed;
      const kr = e.rebuild === undefined ? 1 : e.rebuild;
      e.mesh.scale.y = Math.max(pf * kr, 0.001);
      e.front.visible = (pf > 0 && pf < 1) || (kr < 1 && !e.failed);
      e.front.position.set(e.cx, e.y0 + e.h * pf * kr + 0.005, e.cz);
    }
    // substrate
    const p0 = prog(T, [0, 0.7]);
    tankMeshes.forEach(m => { m.scale.y = Math.max(p0, 0.001); m.visible = p0 > 0; });
    pipes.forEach(m => { m.visible = T > 0.6; });
    centreRings.forEach(r => { r.visible = T > 0.8; r.position.y = T >= 2 ? 0.53 : 0.53 * prog(T, [1.3, 2]) + 0.03; });
    // robots
    const robotsOn = T > 0.8;
    for (const r of robots) {
      r.parts.forEach(p => { p.visible = robotsOn; });
      if (!robotsOn) continue;
      const goal = DMG.robotGoal && DMG.robotGoal[r.i] ? DMG.robotGoal[r.i] : robotGoal(r, T);
      let tb, th;
      if (goal) { tb = goal.base; th = goal.head; }
      else {
        // idle: stay on the highest finished level near the centre
        const lvl = T >= 6.8 ? 7.3 : T >= 5 ? 3.9 : T >= 2 ? 0.5 : 0;
        const c = CENTRES[r.i];
        tb = new THREE.Vector3(c.x, lvl, c.z); th = tb.clone().add(new THREE.Vector3(r.i ? -0.7 : 0.7, 1.35, 0));
      }
      const k = smooth ? 0.18 : 1;
      r.pos.lerp(tb, k); r.headPos.lerp(th, k);
      r.base.position.copy(r.pos);
      r.base.rotation.y = Math.atan2(r.headPos.x - r.pos.x, r.headPos.z - r.pos.z);
      const shoulder = r.pos.clone().add(new THREE.Vector3(0, 0.9, 0));
      const head = r.headPos.clone().add(new THREE.Vector3(0, 0.35, 0));
      const mid = shoulder.clone().lerp(head, 0.5);
      const span = shoulder.distanceTo(head);
      const elbow = mid.add(new THREE.Vector3(0, Math.max(0.3, 2.4 - span * 0.5), 0));
      between(r.upper, shoulder, elbow); between(r.fore, elbow, head);
      r.elbowJ.position.copy(elbow); r.head.position.copy(head);
      between(r.nozzle, head, r.headPos.clone().add(new THREE.Vector3(0, 0.05, 0)));
      // hose from a tank to the robot
      const t = TANKS[r.i];
      const pts = [
        new THREE.Vector3(t.x, -0.75, t.z), new THREE.Vector3(t.x, 0.6, t.z - 0.5),
        new THREE.Vector3(r.pos.x * 0.5 + t.x * 0.5, 0.9, 5.3),
        new THREE.Vector3(r.pos.x, Math.max(r.pos.y, 0) + 1.4, 5.1),
        new THREE.Vector3(r.pos.x, Math.max(r.pos.y, 0) + 1.1, Math.min(r.pos.z + 1.2, 4.9)),
        r.pos.clone().add(new THREE.Vector3(0, 0.55, 0))
      ];
      r.hose.geometry.dispose();
      r.hose.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.07, 6, false);
      r.hose.visible = T > 1;
    }
    updateNetworks(T);
    updateStress();
    updateProjectClip();
    chipCard(NET.selected);
  }

  // ---------------- camera orbit (drag / wheel / right-drag pan) ----------------
  const target = new THREE.Vector3(0, 2.0, 0.6);
  const orbit = { theta: 0.62, phi: 1.05, radius: 38 };
  function placeCamera() {
    const { theta, phi, radius } = orbit;
    camera.position.set(target.x + radius * Math.sin(phi) * Math.sin(theta), target.y + radius * Math.cos(phi), target.z + radius * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(target);
  }
  let drag = null;
  canvas.addEventListener("pointerdown", e => { drag = { x: e.clientX, y: e.clientY, pan: e.button === 2 || e.shiftKey }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
    if (drag.pan) {
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      const s = orbit.radius * 0.0016;
      target.addScaledVector(right, -dx * s).addScaledVector(up, dy * s);
    } else {
      orbit.theta -= dx * 0.006;
      orbit.phi = Math.min(1.5, Math.max(0.25, orbit.phi - dy * 0.005));
    }
    placeCamera();
  });
  canvas.addEventListener("pointerup", () => { drag = null; });
  canvas.addEventListener("contextmenu", e => e.preventDefault());
  canvas.addEventListener("wheel", e => { e.preventDefault(); orbit.radius = Math.min(80, Math.max(12, orbit.radius * (1 + Math.sign(e.deltaY) * 0.08))); placeCamera(); }, { passive: false });

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // On narrow screens move the model up, away from the bottom panel.
    camera.setViewOffset(w, h, w > 760 ? Math.round(w * 0.1) : 0, w > 760 ? 0 : Math.round(h * 0.18), w, h);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);

  // ---------------- UI ----------------
  const slider = document.getElementById("time"), playBtn = document.getElementById("play");
  const list = document.getElementById("stages");
  const stageBtns = STAGES.map((s, i) => {
    const li = document.createElement("li"); const b = document.createElement("button");
    b.innerHTML = `<b>${i + 1}</b><span>${s.title}</span>`;
    b.addEventListener("click", () => { stop(); setT(i + 0.999); });
    li.appendChild(b); list.appendChild(li); return b;
  });
  function refLink(r) {
    const a = document.createElement("a"); a.href = r.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.innerHTML = `<span class="where">${r.where}</span>${r.label} ↗`; return a;
  }
  const allRefs = document.getElementById("all-refs");
  Object.values(REFS).forEach(r => allRefs.appendChild(refLink(r)));
  let T = 0, playing = false, last = 0;
  function setT(v, smooth) {
    T = Math.max(0, Math.min(T_MAX, v)); slider.value = Math.round(T * 1000);
    const si = Math.min(STAGES.length - 1, Math.floor(T));
    stageBtns.forEach((b, i) => { b.className = i < si || T >= T_MAX ? "done" : i === si ? "now" : ""; });
    document.getElementById("st-num").textContent = `Stage ${si + 1} of ${STAGES.length}`;
    document.getElementById("st-title").textContent = STAGES[si].title;
    document.getElementById("st-text").textContent = STAGES[si].text;
    const rb = document.getElementById("st-refs"); rb.innerHTML = "";
    if (STAGES[si].refs) {
      const h = document.createElement("p"); h.className = "refs-title"; h.textContent = "See it in reality"; rb.appendChild(h);
      STAGES[si].refs.forEach(k => rb.appendChild(refLink(REFS[k])));
    }
    document.getElementById("clock").textContent = `t = ${T.toFixed(2)} / ${T_MAX}`;
    update(T, smooth);
  }
  function stop() { playing = false; playBtn.textContent = "▶ Play"; }
  slider.addEventListener("input", () => { stop(); setT(slider.value / 1000); });
  playBtn.addEventListener("click", () => {
    if (playing) return stop();
    if (T >= T_MAX) setT(0);
    playing = true; playBtn.textContent = "❚❚ Pause"; last = performance.now();
  });
  document.getElementById("rebar").addEventListener("change", e => { showRebar = e.target.checked; update(T, false); });
  const xrayBox = document.getElementById("lay-xray");
  function layersChanged() { NET.nervous = document.getElementById("lay-nerv").checked; STR.on = document.getElementById("lay-stress").checked; Object.keys(NETS).forEach(k => { NETS[k].on = document.getElementById("net-" + k).checked; }); NET.xray = xrayBox.checked; setXray(NET.xray); update(T, false); }
  document.getElementById("lay-stress").addEventListener("change", layersChanged);
  document.getElementById("prj-sample").addEventListener("click", loadSample);
  document.getElementById("prj-file").addEventListener("change", ev => { const f = ev.target.files[0]; if (f) loadFile(f); ev.target.value = ""; });
  document.getElementById("prj-mode").addEventListener("click", () => { PRJ.mode = PRJ.mode === "affine" ? "proportional" : "affine"; fitProject(); });
  document.getElementById("prj-turn").addEventListener("click", () => { PRJ.turn = (PRJ.turn + 1) % 4; fitProject(); });
  document.getElementById("prj-show").addEventListener("click", () => { PRJ.visible = !PRJ.visible; applyProjectLook(); renderProject(); });
  document.getElementById("prj-remove").addEventListener("click", removeProject);
  document.getElementById("prj-opacity").addEventListener("input", ev => { PRJ.opacity = +ev.target.value / 100; applyProjectLook(); });
  renderProject();
  document.querySelectorAll("[data-dmg]").forEach(b => b.addEventListener("click", () => startDamage(b.dataset.dmg)));
  document.getElementById("btn-dmg-reset").addEventListener("click", () => resetDamage(false));
  document.getElementById("btn-mobile").addEventListener("click", () => { stop(); deployMobile(); });
  document.getElementById("btn-rules").addEventListener("click", () => { clearCrawlers(); STR.sig = ""; update(T, false); });
  ["lay-nerv", ...Object.keys(NETS).map(k => "net-" + k)].forEach(id => document.getElementById(id).addEventListener("change", ev => { if (ev.target.checked) xrayBox.checked = true; layersChanged(); }));
  xrayBox.addEventListener("change", layersChanged);
  // click on a chip
  const ray = new THREE.Raycaster(); let downAt = null;
  canvas.addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener("pointerup", e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5 || !(NET.nervous || STR.on)) return;
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
    let hit = ray.intersectObjects(chips.filter(m => m.visible).concat(STR.sensors.filter(s => s.m.visible).map(s => s.m)), false)[0];
    let el = hit ? (hit.object.userData.el || hit.object.userData.sensor.e) : null;
    if (!el && STR.on) { const h2 = ray.intersectObjects(elements.filter(x => x.mesh.visible).map(x => x.mesh), false)[0]; if (h2) el = elements.find(x => x.mesh === h2.object); }
    NET.selected = el; chipCard(NET.selected); update(T, false);
  });

  function loop(now) {
    if (playing) {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      setT(T + dt * 0.2 * +document.getElementById("speed").value, true);
      if (T >= T_MAX) stop();
    }
    animateNetworks(now);
    updateDamageView();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
  resize(); placeCamera(); setT(0);
  // read the real checkbox state at start (browsers may restore it on reload)
  showRebar = document.getElementById("rebar").checked; layersChanged(); setMode("build");
  // expose for testing
  window.__lba = { setT, startDamage, startRepair, loadSample, PRJ };
  requestAnimationFrame(loop);
})();
