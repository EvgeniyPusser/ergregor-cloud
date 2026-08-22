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
let selectedModelId = "house-egregor-concept";
let supabaseClient = null;
let remoteEnabled = false;
let remoteModels = null;
let remoteThoughts = new Map();
let remoteThoughtEntries = [];
let selectedModelDbId = null;
const configStorageKey = "egregor-supabase-config";

const runtimeFlowScenarios = {
  "house-egregor-concept": {
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
    chips: ["sensor stream", "repair history", "behavior log", "branch mutation"],
    ctaLabel: "Open full house runtime",
    ctaHref: "./house-runtime.html"
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
    "house-egregor-concept",
    "living-car-concept",
    "living-aircraft-concept"
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
        model.id === "house-egregor-concept"
          ? "Best first hook for schools, ecology groups, architects, and people dreaming about future habitats."
          : model.id === "living-car-concept"
            ? "Best hook for makers, Arduino circles, robotics clubs, and movement studies."
            : "Best hook for futurists, aircraft dreamers, engineers, and AI mobility imagination.";

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

  const cta = scenario.ctaHref
    ? `<div class="runtime-flow-action"><a class="button button-secondary" href="${scenario.ctaHref}">${scenario.ctaLabel || "Open runtime"}</a></div>`
    : "";

  runtimeFlow.innerHTML = `
    <div class="runtime-flow-header">
      <h4>${scenario.title}</h4>
      <p>${scenario.summary}</p>
    </div>
    <div class="runtime-flow-grid">${cards}</div>
    <div class="runtime-flow-meta">${chips}</div>
    ${cta}
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
