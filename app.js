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
const thoughtList = document.querySelector("#thought-list");
const thoughtForm = document.querySelector("#thought-form");
const thoughtInput = document.querySelector("#thought-input");
const connectionForm = document.querySelector("#connection-form");
const connectionStatus = document.querySelector("#connection-status");
const supabaseUrlInput = document.querySelector("#supabase-url");
const supabaseKeyInput = document.querySelector("#supabase-key");
const clearConnectionButton = document.querySelector("#clear-connection");

let activeFilter = "All";
let query = "";
let selectedModelId = "house-egregor-concept";
let supabaseClient = null;
let remoteEnabled = false;
let remoteModels = null;
let remoteThoughts = new Map();
let selectedModelDbId = null;
const configStorageKey = "egregor-supabase-config";

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
  await loadRemoteThoughts(selectedModelId);
  renderRuntime();
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
        loadRemoteThoughts(selectedModelId).then(renderRuntime);
        return;
      }
      renderRuntime();
    });
    runtimeLinks.appendChild(chip);
  });

  thoughtList.innerHTML = "";
  getThoughts(model).forEach((thought, index) => {
    const item = document.createElement("article");
    item.className = "thought-item";

    const title = document.createElement("strong");
    title.textContent = index < (model.thoughts || []).length ? "Seed memory" : "New branch";

    const body = document.createElement("p");
    body.textContent = thought;

    item.append(title, body);
    thoughtList.appendChild(item);
  });
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
      renderRuntime();
    });
    return;
  }

  saveThought(selectedModelId, value);
  thoughtInput.value = "";
  renderRuntime();
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
renderRuntime();
initializeSupabase();
