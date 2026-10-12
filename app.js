const models = window.EGREGOR_MODELS || [];

const modelGrid = document.querySelector("#model-grid");
const filtersContainer = document.querySelector("#filters");
const searchInput = document.querySelector("#search-input");
const template = document.querySelector("#model-card-template");
const modelCount = document.querySelector("#model-count");
const trackCount = document.querySelector("#track-count");
const runtimeTitle = document.querySelector("#runtime-title");
const runtimeSummary = document.querySelector("#runtime-summary");
const runtimeGenome = document.querySelector("#runtime-genome");
const runtimeLinks = document.querySelector("#runtime-links");
const runtimeStatus = document.querySelector("#runtime-status");
const runtimeFigure = document.querySelector("#runtime-figure");
const runtimeImage = document.querySelector("#runtime-image");
const runtimeCaption = document.querySelector("#runtime-caption");
const runtimeFlow = document.querySelector("#runtime-flow");
const runtimeSensorsBlock = document.querySelector("#runtime-sensors-block");
const runtimeSensors = document.querySelector("#runtime-sensors");
const runtimeMetricsBlock = document.querySelector("#runtime-metrics-block");
const runtimeMetrics = document.querySelector("#runtime-metrics");
const runtimeConditionsBlock = document.querySelector("#runtime-conditions-block");
const runtimeConditions = document.querySelector("#runtime-conditions");
const runtimeLineageBlock = document.querySelector("#runtime-lineage-block");
const runtimeLineage = document.querySelector("#runtime-lineage");
const runtimeInstancesBlock = document.querySelector("#runtime-instances-block");
const runtimeInstances = document.querySelector("#runtime-instances");
const runtimeRulesBlock = document.querySelector("#runtime-rules-block");
const runtimeRules = document.querySelector("#runtime-rules");
const runtimeAppliesBlock = document.querySelector("#runtime-applies-block");
const runtimeApplies = document.querySelector("#runtime-applies");
const runtimeBlindBlock = document.querySelector("#runtime-blind-block");
const runtimeBlind = document.querySelector("#runtime-blind");
const runtimeWeightBlock = document.querySelector("#runtime-weight-block");
const runtimeWeight = document.querySelector("#runtime-weight");
const thoughtList = document.querySelector("#thought-list");
const thoughtForm = document.querySelector("#thought-form");
const thoughtInput = document.querySelector("#thought-input");
const connectionForm = document.querySelector("#connection-form");
const connectionStatus = document.querySelector("#connection-status");
const supabaseUrlInput = document.querySelector("#supabase-url");
const supabaseKeyInput = document.querySelector("#supabase-key");
const clearConnectionButton = document.querySelector("#clear-connection");
const activityList = document.querySelector("#activity-list");
const activityCount = document.querySelector("#activity-count");
const ideaGroups = document.querySelector("#idea-groups");
const ideaCount = document.querySelector("#idea-count");
const showcaseGrid = document.querySelector("#showcase-grid");

let activeFilter = "All";
let query = "";
let selectedModelId = "heat-where-it-goes";
let supabaseClient = null;
let remoteEnabled = false;
let remoteModels = null;
let remoteThoughts = new Map();
let remoteThoughtEntries = [];
let selectedModelDbId = null;
const configStorageKey = "egregor-supabase-config";

const runtimeFlowScenarios = {
  "heat-where-it-goes": {
    title: "How one physical house feeds the cloud",
    summary:
      "A person builds a simplified living house branch from this model. The house does not stay private and silent. Its behavior becomes part of the shared memory of the model.",
    steps: [
      {
        label: "Physical house",
        body:
          "A workshop, school, or family assembles one house branch from the cloud drawing: shell, sensors, valves, water lines, vibration points."
      },
      {
        label: "Life events",
        body:
          "Every event is fixed: wall vibration, water pulse, humidity jump, heat stress, valve reaction, human override, small failure, repair."
      },
      {
        label: "Cloud memory",
        body:
          "Each event goes to the cloud with time, model version, sensor source, what happened, and what the house did in response."
      },
      {
        label: "New branch",
        body:
          "If one house survives better or learns a better response, the cloud keeps it as a stronger branch that the next builder can take."
      }
    ],
    chips: ["sensor stream", "repair history", "behavior log", "branch mutation"]
  }
};

function loadConfig() {
  const persisted = window.localStorage.getItem(configStorageKey);
  if (persisted) {
    try {
      return JSON.parse(persisted);
    } catch {
      return window.EGREGOR_SUPABASE_CONFIG || {};
    }
  }

  return window.EGREGOR_SUPABASE_CONFIG || {};
}

function setConnectionStatus(message) {
  connectionStatus.textContent = message;
}

function currentModels() {
  return remoteModels || models;
}

function currentTypes() {
  return ["All", ...new Set(currentModels().map((model) => model.type))];
}

function currentTracks() {
  return new Set(currentModels().map((model) => model.track));
}

function refreshCounts() {
  modelCount.textContent = String(currentModels().length);
  trackCount.textContent = String(currentTracks().size);
}

function renderFilters() {
  filtersContainer.innerHTML = "";
  currentTypes().forEach((type) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${type === activeFilter ? " active" : ""}`;
    button.textContent = type;
    button.addEventListener("click", () => {
      activeFilter = type;
      renderFiltersState();
      renderModels();
    });
    filtersContainer.appendChild(button);
  });
}

function renderFiltersState() {
  [...filtersContainer.children].forEach((child) => {
    child.classList.toggle("active", child.textContent === activeFilter);
  });
}

function matchesQuery(model) {
  const haystack = [
    model.title,
    model.type,
    model.stage,
    model.track,
    model.origin,
    model.summary,
    model.tags.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function renderModels() {
  modelGrid.innerHTML = "";

  const filtered = currentModels().filter((model) => {
    const byType = activeFilter === "All" || model.type === activeFilter;
    const byQuery = !query || matchesQuery(model);
    return byType && byQuery;
  });

  filtered.forEach((model) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".model-card");
    card.dataset.modelId = model.id;
    card.classList.toggle("active", model.id === selectedModelId);
    card.querySelector(".chip-type").textContent = model.type;
    card.querySelector(".chip-stage").textContent = model.stage;
    card.querySelector(".model-title").textContent = model.title;
    card.querySelector(".model-summary").textContent = model.summary;
    card.querySelector(".model-track").textContent = model.track;
    card.querySelector(".model-origin").textContent = model.origin;

    const tags = card.querySelector(".tag-list");
    model.tags.forEach((tag) => {
      const element = document.createElement("span");
      element.className = "tag";
      element.textContent = tag;
      tags.appendChild(element);
    });

    card.addEventListener("click", () => {
      selectedModelId = model.id;
      renderModels();
      renderRuntime();
      document.querySelector("#runtime").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    modelGrid.appendChild(fragment);
  });
}

function renderShowcase() {
  showcaseGrid.innerHTML = "";
  const featuredIds = [
    "heat-where-it-goes",
    "comfort-complaints",
    "water-losses"
  ];

  featuredIds
    .map((id) => getModel(id))
    .filter(Boolean)
    .forEach((model) => {
      const card = document.createElement("article");
      card.className = "showcase-card";

      const image = document.createElement("img");
      image.src = model.image || "./assets/home-structure.png";
      image.alt = model.title;

      const copy = document.createElement("div");
      copy.className = "showcase-copy";

      const title = document.createElement("h3");
      title.textContent = model.title;

      const summary = document.createElement("p");
      summary.textContent = model.summary;

      const audience = document.createElement("p");
      audience.className = "model-summary";
      audience.textContent =
        model.id === "heat-where-it-goes"
          ? "Four sensors, one heating season, nothing installed. The cheapest way to find out where the money goes."
          : model.id === "comfort-complaints"
            ? "No structural work at all. A one-tap complaint log against temperature, humidity and CO2."
            : "One meter per riser and a night reading. Usually finds a leak that has been running for years.";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button-secondary";
      button.textContent = "Open in Cloud";
      button.addEventListener("click", () => {
        selectedModelId = model.id;
        renderModels();
        if (remoteEnabled) {
          loadRemoteThoughts(selectedModelId).then(() => {
            renderRuntime();
            renderActivity();
            renderIdeaGroups();
            document.querySelector("#runtime").scrollIntoView({ behavior: "smooth", block: "start" });
          });
          return;
        }
        renderRuntime();
        renderActivity();
        renderIdeaGroups();
        document.querySelector("#runtime").scrollIntoView({ behavior: "smooth", block: "start" });
      });

      copy.append(title, summary, audience, button);
      card.append(image, copy);
      showcaseGrid.appendChild(card);
    });
}

function storageKey(modelId) {
  return `egregor-thoughts-${modelId}`;
}

function getModel(modelId) {
  return currentModels().find((model) => model.id === modelId);
}

function getThoughts(model) {
  if (remoteEnabled) {
    return remoteThoughts.get(model.id) || [];
  }

  const baseThoughts = Array.isArray(model.thoughts) ? model.thoughts : [];
  const saved = window.localStorage.getItem(storageKey(model.id));

  if (!saved) {
    return baseThoughts;
  }

  try {
    return [...baseThoughts, ...JSON.parse(saved)];
  } catch {
    return baseThoughts;
  }
}

function saveThought(modelId, thought) {
  const saved = window.localStorage.getItem(storageKey(modelId));
  const current = saved ? JSON.parse(saved) : [];
  current.push(thought);
  window.localStorage.setItem(storageKey(modelId), JSON.stringify(current));
}

function localActivityEntries() {
  return currentModels().flatMap((model) =>
    getThoughts(model).map((body, index) => ({
      modelTitle: model.title,
      track: model.track,
      body,
      createdAt: `Seed ${index + 1}`
    }))
  );
}

function renderActivity() {
  const entries = remoteEnabled ? remoteThoughtEntries : localActivityEntries();
  activityList.innerHTML = "";
  activityCount.textContent = `${entries.length} entries`;

  const visibleEntries = entries.slice(0, 12);

  if (!visibleEntries.length) {
    const empty = document.createElement("article");
    empty.className = "activity-item";
    empty.innerHTML = remoteEnabled
      ? "<p>No public thought activity is stored in the cloud yet.</p>"
      : "<p>No public thought activity yet. The first branch will appear here.</p>";
    activityList.appendChild(empty);
    return;
  }

  visibleEntries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "activity-item";

    const meta = document.createElement("div");
    meta.className = "activity-meta";
    meta.innerHTML = `<span>${entry.modelTitle}</span><span>${entry.track || entry.createdAt}</span>`;

    const body = document.createElement("p");
    body.textContent = entry.body;

    item.append(meta, body);
    activityList.appendChild(item);
  });
}

function renderIdeaGroups() {
  ideaGroups.innerHTML = "";
  const grouped = new Map();

  currentModels().forEach((model) => {
    const key = model.track || model.type;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(model);
  });

  ideaCount.textContent = `${grouped.size} tracks`;

  [...grouped.entries()].slice(0, 8).forEach(([groupName, groupModels]) => {
    const item = document.createElement("article");
    item.className = "idea-group";

    const title = document.createElement("strong");
    title.textContent = groupName;

    const summary = document.createElement("p");
    summary.textContent = `${groupModels.length} model branches: ${groupModels
      .map((model) => model.title)
      .slice(0, 3)
      .join(", ")}${groupModels.length > 3 ? "..." : ""}`;

    const tags = document.createElement("div");
    tags.className = "idea-tags";

    [...new Set(groupModels.flatMap((model) => model.tags || []))]
      .slice(0, 6)
      .forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "tag";
        chip.textContent = tag;
        tags.appendChild(chip);
      });

    item.append(title, summary, tags);
    ideaGroups.appendChild(item);
  });
}

async function insertRemoteThought(body) {
  if (!supabaseClient || !selectedModelDbId) {
    return false;
  }

  const { error } = await supabaseClient.from("thoughts").insert({
    model_id: selectedModelDbId,
    body,
    kind: "thought"
  });

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

async function loadRemoteThoughts(modelId) {
  const model = getModel(modelId);
  if (!supabaseClient || !model?.dbId) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("thoughts")
    .select("body, created_at")
    .eq("model_id", model.dbId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  remoteThoughts.set(
    modelId,
    (data || []).map((entry) => entry.body)
  );
}

async function loadRemoteActivity() {
  if (!supabaseClient) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("thoughts")
    .select("body, created_at, models(title, track)")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error(error);
    return;
  }

  remoteThoughtEntries = (data || []).map((entry) => ({
    body: entry.body,
    createdAt: entry.created_at,
    modelTitle: entry.models?.title || "Unknown model",
    track: entry.models?.track || ""
  }));
}

function renderThoughts(model) {
  thoughtList.innerHTML = "";
  const thoughts = getThoughts(model);

  if (!thoughts.length) {
    const empty = document.createElement("article");
    empty.className = "thought-item";
    empty.innerHTML = remoteEnabled
      ? "<p>No cloud thoughts yet for this model.</p>"
      : "<p>No local thoughts yet for this model.</p>";
    thoughtList.appendChild(empty);
    return;
  }

  thoughts.forEach((thought, index) => {
    const item = document.createElement("article");
    item.className = "thought-item";

    const title = document.createElement("strong");
    title.textContent = remoteEnabled
      ? `Cloud thought ${index + 1}`
      : index < (model.thoughts || []).length
        ? "Seed memory"
        : "New branch";

    const body = document.createElement("p");
    body.textContent = thought;

    item.append(title, body);
    thoughtList.appendChild(item);
  });
}

function show(block, on) {
  if (!block) return;
  block.hidden = !on;
}

function renderModelSpec(model) {
  // --- the rule, not the numbers -------------------------------------
  // A copied body hurts: giving an Israeli dwelling a Swedish body costs
  // +70 % of the hours outside the norm. So what travels is the rule.
  const rules = Array.isArray(model.rules) ? model.rules : [];
  show(runtimeRulesBlock, rules.length > 0);
  if (runtimeRules) {
    runtimeRules.innerHTML = rules.length
      ? `<table>
           <thead><tr><th>Parameter</th><th>Depends on</th><th>Rule</th><th>Kind</th><th>Checked on</th></tr></thead>
           <tbody>${rules
             .map((r) => {
               const kind = r.kind === "distro" || r.kind === "распорядок"
                 ? `<span class="spec-kind spec-kind-run">daily routine</span>`
                 : `<span class="spec-kind spec-kind-body">built once</span>`;
               return `<tr>
                 <td><strong>${r.param || ""}</strong>${r.unit ? `, ${r.unit}` : ""}</td>
                 <td>${r.depends || ""}</td>
                 <td>${r.rule || ""}</td>
                 <td>${kind}</td>
                 <td class="spec-why">${r.checked || ""}</td>
               </tr>`;
             })
             .join("")}</tbody>
         </table>`
      : "";
  }

  // --- where this was tested -----------------------------------------
  // The interaction share says how much of the outcome depends on the
  // PAIR rule-and-receiver. Below 10 % one rule fits everyone; above
  // 30 % the rule is addressed and sending it to the wrong place costs.
  const ap = model.applies || {};
  const hasAp = Boolean(ap.tested_on || ap.interaction != null || ap.misfit_cost || ap.not_tested);
  show(runtimeAppliesBlock, hasAp);
  if (runtimeApplies) {
    let band = "", pct = "";
    if (ap.interaction != null) {
      const v = Number(ap.interaction);
      pct = `${Math.round(v * 100)} %`;
      band = v < 0.10
        ? `<span class="spec-band spec-band-low">one rule fits all — nothing to match</span>`
        : v > 0.30
          ? `<span class="spec-band spec-band-high">addressed rule — the wrong address is expensive</span>`
          : `<span class="spec-band spec-band-mid">partly addressed</span>`;
    }
    runtimeApplies.innerHTML = [
      ap.tested_on ? `<dt>Tested on</dt><dd>${ap.tested_on}</dd>` : "",
      pct ? `<dt>Interaction share</dt><dd><strong>${pct}</strong> ${band}</dd>` : "",
      ap.misfit_cost ? `<dt>Cost of the wrong address</dt><dd>${ap.misfit_cost}</dd>` : "",
      ap.not_tested ? `<dt class="spec-warn">Not tested</dt><dd class="spec-warn">${ap.not_tested}</dd>` : ""
    ].join("");
  }

  // --- what we did not measure ---------------------------------------
  // Every rule quietly carries an assumption: that the processes nobody
  // named behaved the same way at both ends. Here it is said out loud.
  const blind = Array.isArray(model.blindspots) ? model.blindspots : [];
  show(runtimeBlindBlock, blind.length > 0);
  if (runtimeBlind) {
    runtimeBlind.innerHTML = blind.map((x) => `<li>${x}</li>`).join("");
  }

  // --- датчики ---
  const sensors = Array.isArray(model.sensors) ? model.sensors : [];
  show(runtimeSensorsBlock, sensors.length > 0);
  if (runtimeSensors) {
    runtimeSensors.innerHTML = sensors.length
      ? `<table>
           <thead><tr><th>Signal</th><th>Unit</th><th>Rate</th><th>Where</th><th>Why</th></tr></thead>
           <tbody>${sensors
             .map(
               (x) => `<tr>
                 <td>${x.what || x.id || ""}</td>
                 <td>${x.unit || ""}</td>
                 <td>${x.rate || ""}</td>
                 <td>${x.where || ""}</td>
                 <td class="spec-why">${x.why || ""}</td>
               </tr>`
             )
             .join("")}</tbody>
         </table>`
      : "";
  }

  // --- метрики ---
  const metrics = Array.isArray(model.metrics) ? model.metrics : [];
  show(runtimeMetricsBlock, metrics.length > 0);
  if (runtimeMetrics) {
    runtimeMetrics.innerHTML = metrics
      .map((m) => {
        const dir = m.better === "lower" ? "lower is better" : m.better === "higher" ? "higher is better" : "";
        return `<li><strong>${m.name || m.id || ""}</strong>${m.unit ? `, ${m.unit}` : ""}${dir ? ` <span class="spec-dir">${dir}</span>` : ""}</li>`;
      })
      .join("");
  }

  // --- who sets the weights ------------------------------------------
  // The model lists what to measure. How much one thing matters against
  // another is decided by whoever takes it: their climate, their money,
  // their taste. The same body is best in Stockholm and worst in Tel Aviv
  // only because the weight of summer is 0.02 against 0.70.
  const wg = model.weighting || {};
  const hasW = Boolean(wg.by_place || (wg.by_owner || []).length || wg.note);
  show(runtimeWeightBlock, hasW);
  if (runtimeWeight) {
    const owner = (wg.by_owner || []).length
      ? `<dt>You declare</dt><dd><ul class="spec-list">${(wg.by_owner || [])
          .map((x) => `<li>${x}</li>`).join("")}</ul></dd>`
      : "";
    runtimeWeight.innerHTML = [
      wg.by_place ? `<dt>Computed from your site</dt><dd>${wg.by_place}</dd>` : "",
      owner,
      wg.note ? `<dt>Note</dt><dd class="spec-note">${wg.note}</dd>` : ""
    ].join("");
  }

  // --- условия ---
  const c = model.conditions || {};
  const rows = [
    ["Climate", c.climate],
    ["Size", c.size],
    ["Use", c.use],
    ["Occupancy", c.occupancy],
    ["Notes", c.notes]
  ].filter(([, v]) => v);
  show(runtimeConditionsBlock, rows.length > 0);
  if (runtimeConditions) {
    runtimeConditions.innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  }

  // --- происхождение ---
  const lin = model.lineage || {};
  const hasLineage = Boolean(lin.version || lin.parent || (lin.changed || []).length);
  show(runtimeLineageBlock, hasLineage);
  if (runtimeLineage) {
    const parentModel = lin.parent ? getModel(lin.parent) : null;
    const parentLabel = lin.parent
      ? parentModel
        ? parentModel.title
        : lin.parent
      : "first in its line";
    const changed = (lin.changed || []).length
      ? `<p class="spec-note">Changed against the parent:</p><ul class="spec-list">${(lin.changed || [])
          .map((x) => `<li>${x}</li>`)
          .join("")}</ul>`
      : "";
    runtimeLineage.innerHTML = `
      <p><span class="spec-key">Version</span> ${lin.version || "1.0"}</p>
      <p><span class="spec-key">Parent</span> ${parentLabel}</p>
      ${changed}`;
  }

  // --- построенные объекты ---
  const inst = Array.isArray(model.instances) ? model.instances : [];
  show(runtimeInstancesBlock, inst.length > 0);
  if (runtimeInstances) {
    runtimeInstances.innerHTML = inst
      .map(
        (i) => `<article class="spec-instance">
          <header><strong>${i.where || i.id || ""}</strong>
            <span class="spec-status">${i.status || ""}</span>
            <span class="spec-months">${i.months ? `${i.months} mo of records` : ""}</span>
          </header>
          ${i.result ? `<p>${i.result}</p>` : ""}
          ${i.surprise ? `<p class="spec-surprise"><span>Surprise</span> ${i.surprise}</p>` : ""}
          ${i.weights ? `<p class="spec-weights"><span>Weights used</span> ${i.weights}</p>` : ""}
          ${i.outside ? `<p class="spec-outside"><span>Outside the tested range</span> ${i.outside}</p>` : ""}
        </article>`
      )
      .join("");
  }
}

function renderRuntimeFlow(model) {
  const scenario = runtimeFlowScenarios[model.id];

  if (!scenario) {
    runtimeFlow.innerHTML = "";
    runtimeFlow.classList.remove("is-visible");
    return;
  }

  const cards = scenario.steps
    .map(
      (step) => `
        <article class="runtime-flow-card">
          <strong>${step.label}</strong>
          <p>${step.body}</p>
        </article>
      `
    )
    .join("");

  const chips = (scenario.chips || [])
    .map((chip) => `<span class="runtime-flow-chip">${chip}</span>`)
    .join("");

  runtimeFlow.innerHTML = `
    <div class="runtime-flow-header">
      <h4>${scenario.title}</h4>
      <p>${scenario.summary}</p>
    </div>
    <div class="runtime-flow-grid">${cards}</div>
    <div class="runtime-flow-meta">${chips}</div>
  `;
  runtimeFlow.classList.add("is-visible");
}

async function initializeSupabase() {
  const config = loadConfig();
  supabaseUrlInput.value = config.url || "";
  supabaseKeyInput.value = config.publishableKey || "";

  if (!config.url || !config.publishableKey || !window.supabase?.createClient) {
    setConnectionStatus("Local mode is active. The site is still using local seed data.");
    refreshCounts();
    return;
  }

  supabaseClient = window.supabase.createClient(config.url, config.publishableKey);

  const { data, error } = await supabaseClient
    .from("models")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    setConnectionStatus("Connection failed. Check the URL or publishable key and try again.");
    refreshCounts();
    return;
  }

  remoteEnabled = true;
  remoteModels = (data || []).map((entry) => ({
    id: entry.slug,
    dbId: entry.id,
    title: entry.title,
    type: entry.type,
    stage: entry.stage,
    track: entry.track,
    origin: entry.origin,
    summary: entry.summary,
    image: entry.image_url || "",
    imageCaption: entry.image_caption || "",
    genome: entry.genome || [],
    links: entry.links || [],
    tags: entry.tags || [],
    thoughts: []
  }));

  if (!remoteModels.find((model) => model.id === selectedModelId) && remoteModels[0]) {
    selectedModelId = remoteModels[0].id;
  }

  setConnectionStatus("Cloud mode is active. Models and thoughts are loading from Supabase.");
  refreshCounts();
  renderFilters();
  renderModels();
  renderShowcase();
  await loadRemoteThoughts(selectedModelId);
  await loadRemoteActivity();
  renderRuntime();
  renderActivity();
  renderIdeaGroups();
}

function renderRuntime() {
  const model = getModel(selectedModelId) || currentModels()[0];
  if (!model) {
    return;
  }

  selectedModelDbId = model.dbId || null;

  runtimeTitle.textContent = model.title;
  runtimeSummary.textContent = model.summary;
  runtimeStatus.textContent = remoteEnabled
    ? model.type === "Living House"
      ? "House branch active in cloud"
      : "Branch active in cloud"
    : model.type === "Living House"
      ? "House branch active"
      : "Branch active";

  if (model.image) {
    runtimeImage.src = model.image;
    runtimeImage.alt = model.title;
    runtimeCaption.textContent = model.imageCaption || "";
    runtimeFigure.classList.remove("is-empty");
  } else {
    runtimeImage.removeAttribute("src");
    runtimeImage.alt = "";
    runtimeCaption.textContent = "";
    runtimeFigure.classList.add("is-empty");
  }

  runtimeGenome.innerHTML = "";
  (model.genome || ["Genome is not defined yet."]).forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    runtimeGenome.appendChild(item);
  });

  runtimeLinks.innerHTML = "";
  (model.links || []).forEach((link) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "linked-chip";
    chip.textContent = link;
    chip.addEventListener("click", () => {
      const linkedModel = currentModels().find((entry) => entry.title === link);
      if (!linkedModel) {
        return;
      }

      selectedModelId = linkedModel.id;
      renderModels();
      if (remoteEnabled) {
        loadRemoteThoughts(selectedModelId).then(() => {
          renderRuntime();
          renderActivity();
          renderIdeaGroups();
        });
        return;
      }
      renderRuntime();
    });
    runtimeLinks.appendChild(chip);
  });

  renderModelSpec(model);
  renderRuntimeFlow(model);
  renderThoughts(model);
}

searchInput.addEventListener("input", (event) => {
  query = event.target.value.trim();
  renderModels();
});

thoughtForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = thoughtInput.value.trim();
  if (!value) {
    return;
  }

  if (remoteEnabled) {
    insertRemoteThought(value).then(async (ok) => {
      if (!ok) {
        return;
      }
      thoughtInput.value = "";
      await loadRemoteThoughts(selectedModelId);
      await loadRemoteActivity();
      renderRuntime();
      renderActivity();
      renderIdeaGroups();
    });
    return;
  }

  saveThought(selectedModelId, value);
  thoughtInput.value = "";
  renderRuntime();
  renderActivity();
  renderIdeaGroups();
});

connectionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const url = supabaseUrlInput.value.trim();
  const publishableKey = supabaseKeyInput.value.trim();

  window.localStorage.setItem(
    configStorageKey,
    JSON.stringify({ url, publishableKey })
  );

  setConnectionStatus("Connection saved locally. Reloading cloud connection...");
  window.location.reload();
});

clearConnectionButton.addEventListener("click", () => {
  window.localStorage.removeItem(configStorageKey);
  setConnectionStatus("Saved connection removed. Reloading local mode...");
  window.location.reload();
});

refreshCounts();
renderFilters();
renderModels();
renderShowcase();
renderRuntime();
renderActivity();
renderIdeaGroups();
initializeSupabase();
