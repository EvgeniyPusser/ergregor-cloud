/* A design sketch for Cloud DNA. All quantities and scenario rules are synthetic. */
window.EGREGOR_URBAN = {
  id: "urban-quarter-01", version: "0.1.0", title: "Parkside Quarter",
  evidence: "Illustrative example; no measurements or calibration against a real site",
  boundary: "A neighbourhood, park and supporting networks. External supplies and maintenance are included as dependencies.",
  context: { areaHa: 12, inhabitants: 1200, buildings: 8, climate: "Assumed Mediterranean climate", date: null },
  constitution: ["Preserve access to essential services", "Distinguish unknown conditions from confirmed working conditions", "Changing priorities requires a decision by an authorised person"],
  scenarios: [
    { id: "baseline", name: "Baseline model", description: "Design assumptions. Functional availability is illustrative and has not been confirmed by observations." },
    { id: "rain", name: "Heavy rain", description: "Assumption: drainage is overloaded and the lower street section is flooded. Related functions are highlighted; water levels are not calculated." },
    { id: "power", name: "Power outage", description: "Assumption: grid power is lost, with no backup for the pump or lighting. Gravity drainage and physical pedestrian connections remain." },
    { id: "heat", name: "Heat and dry soil", description: "Assumption: prolonged heat and low soil moisture. Shade remains, but cooling from vegetation is limited. Temperature is not calculated." }
  ],
  capabilities: [
    { id: "water", label: "Water and rainfall", kind: "Capability", summary: "Supply water and manage rainfall while keeping the neighbourhood accessible.", members: ["houses", "roof", "tank", "pump", "drain", "soil", "street"], metrics: ["Water reserves, m³", "Drainage capacity, L/s", "Flooded area, m²"], rule: "Water delivery requires a source, a working pump and power. Runoff depends on slopes, permeability and drainage condition." },
    { id: "climate", label: "Microclimate", kind: "Capability", summary: "Maintain suitable conditions in buildings and public spaces.", members: ["houses", "roof", "trees", "soil", "tank", "pump"], metrics: ["Shaded route coverage, %", "Heat stress", "Soil moisture, %"], rule: "Shade and evaporation work differently. Reduced irrigation does not mean an immediate loss of shade." },
    { id: "access", label: "Accessibility", kind: "Capability", summary: "Connect homes, services and recreation through accessible routes.", members: ["houses", "street", "path", "trees", "lights"], metrics: ["Route availability", "Travel time to services, min", "Continuity of accessible routes"], rule: "At least one suitable route is needed. Passability, lighting and heat stress are assessed separately." },
    { id: "energy", label: "Energy supply", kind: "Capability", summary: "Power essential equipment and allocate limited resources.", members: ["grid", "pump", "lights", "houses"], metrics: ["Available power, kW", "Backup duration, h", "Unserved energy, kWh"], rule: "This example has no backup supply. Dependence on the external grid remains explicit." },
    { id: "ecology", label: "Living environment", kind: "Capability", summary: "Sustain soil, vegetation and habitat connectivity.", members: ["trees", "soil", "park", "path"], metrics: ["Habitat connectivity", "Vegetation condition", "Permeable area, m²"], rule: "Condition is assessed through several indicators. A connected park alone does not establish biodiversity." },
    { id: "care", label: "Recovery", kind: "Capability", summary: "Detect failures, enable maintenance access and verify recovery.", members: ["sensor", "service", "street", "pump", "drain"], metrics: ["Detection time, min", "Recovery time, h", "Verified condition coverage, %"], rule: "Recovery requires damage information, a service provider, materials and access. Autonomous repair is not assumed." }
  ],
  objects: [
    { id: "houses", label: "Residential buildings", kind: "Object group", summary: "Eight illustrative buildings. Each can later expand into its own house graph.", children: ["Envelope", "Spaces", "Internal networks"], metrics: ["Essential service availability", "Envelope condition" ] },
    { id: "roof", label: "Roofs", kind: "Object group", summary: "Collect rainfall and exchange heat. A shared object can support several capabilities.", children: ["Roof covering", "Downpipes", "Insulation"], metrics: ["Catchment area, m²", "Watertightness"] },
    { id: "tank", label: "Water tank", kind: "Object", summary: "Assumed capacity: 80 m³. Actual fill level is unknown; potable water quality is not assumed.", metrics: ["Water level — no data", "Water quality — no data"] },
    { id: "pump", label: "Pump", kind: "Object", summary: "Delivers non-potable water for irrigation. Requires electricity, inlet water and maintenance.", metrics: ["Flow rate, L/s — no data", "Operating condition — no observations"] },
    { id: "drain", label: "Drainage", kind: "Network", summary: "A gravity drainage network. Requires clear passages and suitable conditions at the external outfall.", metrics: ["Capacity — not specified", "Blockage — no data"] },
    { id: "soil", label: "Soil", kind: "Distributed object", summary: "A shared resource for infiltration, vegetation and evaporation.", metrics: ["Moisture — no data", "Permeability — no data"] },
    { id: "trees", label: "Trees", kind: "Object group", summary: "Provide shade, participate in the water cycle and create habitats.", metrics: ["Canopy area — no data", "Condition — no data"] },
    { id: "street", label: "Street", kind: "Space", summary: "The main access route; its lower section is assumed to be vulnerable to flooding.", metrics: ["Passability", "Maintenance access"] },
    { id: "path", label: "Park path", kind: "Space", summary: "An alternative pedestrian route. Accessibility for different user groups needs verification.", metrics: ["Passability", "Accessibility — not verified"] },
    { id: "lights", label: "Lighting", kind: "Network", summary: "Lights public routes. This example has no independent power supply.", metrics: ["Illuminance — no data"] },
    { id: "grid", label: "External power grid", kind: "External dependency", summary: "A power source outside the neighbourhood boundary. No backup is specified in this illustrative design.", metrics: ["Power availability", "Power limit — not specified"] },
    { id: "park", label: "Park", kind: "Space", summary: "A shared space for recreation and habitats. Spatial boundaries differ from functional boundaries.", metrics: ["Human use — no data", "Species composition — no data"] },
    { id: "sensor", label: "Observations", kind: "Information system", summary: "Planned data sources for water level, moisture, power and accessibility. Sensors are not connected yet.", metrics: ["Observation age — unknown", "Confidence — unknown"] },
    { id: "service", label: "Maintenance service", kind: "External dependency", summary: "People, materials and equipment for recovery. Inclusion in the graph does not confirm service readiness.", metrics: ["Arrival time — unknown", "Spare parts availability — unknown"] }
  ],
  relations: [
    ["roof", "tank", "Rainwater collection", "flow"], ["tank", "pump", "Inlet water", "flow"],
    ["pump", "soil", "Irrigation", "flow"], ["soil", "trees", "Root moisture", "flow"],
    ["street", "drain", "Surface runoff", "flow"], ["roof", "drain", "Rainwater drainage", "flow"],
    ["grid", "pump", "Power supply", "supply"], ["grid", "lights", "Power supply", "supply"],
    ["grid", "houses", "Power supply", "supply"], ["trees", "path", "Shade", "effect"],
    ["trees", "houses", "Shade", "effect"], ["park", "trees", "Contains", "contains"],
    ["park", "soil", "Contains", "contains"], ["park", "path", "Contains", "contains"],
    ["street", "houses", "Access", "access"], ["path", "houses", "Pedestrian access", "access"],
    ["sensor", "tank", "Monitors level (planned)", "observe"], ["sensor", "soil", "Monitors moisture (planned)", "observe"],
    ["service", "pump", "Maintains", "repair"], ["service", "drain", "Maintains", "repair"],
    ["street", "service", "Vehicle access requirement", "access"]
  ].map(([source, target, label, type]) => ({ source, target, label, type })),
  capabilityRelations: [
    ["energy", "water", "Pump power"], ["water", "climate", "Water for evaporation"],
    ["ecology", "climate", "Vegetation and soil"], ["water", "access", "Route flooding"],
    ["energy", "access", "Lighting"], ["access", "care", "Repair access"],
    ["care", "water", "Network recovery"], ["climate", "access", "Route conditions"]
  ].map(([source, target, label]) => ({ source, target, label, type: "dependency" })),
  states: {
    baseline: {},
    rain: { water: ["limited", "Drainage overload is assumed in this scenario"], access: ["limited", "Main route partly flooded; alternative needs verification"], care: ["limited", "Access to the damaged area is restricted"], drain: ["limited", "Capacity is assumed to be exceeded"], street: ["limited", "Lower section is flooded"] },
    power: { energy: ["lost", "Grid supply unavailable; no backup"], grid: ["lost", "Grid disconnection is specified by the scenario"], pump: ["lost", "No power from the external grid"], lights: ["lost", "No power from the external grid"], water: ["limited", "Pumped irrigation unavailable; gravity drainage remains"], access: ["limited", "Lighting unavailable; physical routes remain"], houses: ["limited", "No grid power; internal effects have not yet been modelled"] },
    heat: { climate: ["limited", "Evaporative cooling limited; shade remains"], ecology: ["limited", "Moisture shortage is specified by the scenario"], soil: ["limited", "Dry soil is assumed in this scenario"], trees: ["limited", "Water stress; canopy remains"], access: ["limited", "Heat stress is assumed on exposed routes"] }
  }
};
