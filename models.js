window.EGREGOR_MODELS = [
  {
    id: "heat-where-it-goes",
    title: "Heat: finding where it actually goes",
    type: "Heat",
    stage: "Open problem",
    track: "Energy",
    origin: "Egregor Cloud",
    summary:
      "A building pays a heating bill without knowing which share is envelope loss, which is overheating, and which is schedule. Four sensors separate the three.",
    tags: ["heat", "energy", "cheap entry", "first step"],
    genome: [
      "Indoor and outdoor temperature on the same clock",
      "Supply and return temperature at the heating riser",
      "One heating season of records, nothing installed, nothing changed",
      "Only after that: a recommendation with a number attached"
    ],
    links: ["Comfort: what people actually complain about", "Structural sensors: minimal entry"],
    sensors: [
      { id: "t-out",    what: "Outdoor temperature",  unit: "°C", rate: "1/hour", where: "north facade, in shade",            why: "nothing else is comparable without it" },
      { id: "t-in",     what: "Indoor temperature",   unit: "°C", rate: "1/hour", where: "three rooms, 1.5 m, different sides", why: "one room tells you nothing about the building" },
      { id: "t-supply", what: "Supply temperature",   unit: "°C", rate: "1/hour", where: "heating riser, supply side",       why: "separates overheating from envelope loss" },
      { id: "t-return", what: "Return temperature",   unit: "°C", rate: "1/hour", where: "heating riser, return side",       why: "the supply-return gap is how much the building actually took" }
    ],
    metrics: [
      { id: "heat-per-m2",  name: "Heat used per square metre per season", unit: "kWh / m²", better: "lower" },
      { id: "overheat-hrs", name: "Hours above 24 °C in heating season", unit: "hours", better: "lower" },
      { id: "spread",       name: "Spread between warmest and coldest room", unit: "°C", better: "lower" }
    ],
    conditions: {
      climate: "Any climate with a heating season",
      size: "From a single block of flats upward",
      use: "Residential, office, institutional",
      occupancy: "Recorded, not assumed",
      notes: "No refurbishment required. Measurement only in the first season."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "The most common finding in the first season is not poor insulation. It is overheating with the windows open.",
      "A prediction has to be written down before the season starts, or the whole record is worthless afterwards."
    ]
  },
  {
    id: "structural-sensors-minimal",
    title: "Structural sensors: minimal entry",
    type: "Structure",
    stage: "Being tested",
    track: "Structure",
    origin: "Egregor Cloud",
    summary:
      "Five points on one building: vibration, wall humidity, crack opening, two temperatures. One year of records. The cheapest way to start accumulating evidence.",
    tags: ["sensors", "structure", "first step"],
    genome: [
      "Five measurement points on load-bearing elements",
      "Autonomous power, one upload per day",
      "Records tied to conditions, never stored bare",
      "Observation only — no control at this stage"
    ],
    links: ["Structural sensors 1.1: after the first year"],
    sensors: [
      { id: "vib-1", what: "Floor slab vibration",  unit: "mm/s", rate: "1/min",  where: "mid-span, 2nd floor",    why: "movement grows before cracks appear" },
      { id: "hum-1", what: "Humidity inside wall",  unit: "%",    rate: "1/hour", where: "north wall, +1.0 m",     why: "freezing and mould start here" },
      { id: "def-1", what: "Crack opening",         unit: "mm",   rate: "1/day",  where: "on an existing crack",   why: "direct sign of structural movement" },
      { id: "t-out", what: "Outdoor temperature",   unit: "°C", rate: "1/hour", where: "north facade, in shade", why: "nothing else is comparable without it" },
      { id: "t-in",  what: "Indoor temperature",    unit: "°C", rate: "1/hour", where: "living space, 1.5 m",    why: "the gradient explains wall behaviour" }
    ],
    metrics: [
      { id: "vib-growth", name: "Vibration growth per year",        unit: "% / year", better: "lower" },
      { id: "wet-days",   name: "Days above 80 % wall humidity",    unit: "days",     better: "lower" },
      { id: "crack-rate", name: "Crack opening rate",               unit: "mm / year", better: "lower" }
    ],
    conditions: {
      climate: "Hot dry, mild winter",
      size: "4 floors, about 1800 m²",
      use: "Residential",
      occupancy: "About 60 people",
      notes: "1970s building, no major refurbishment"
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "Start with observation, not control. There is nothing to control until there is something to compare.",
      "The most valuable field is surprise. Expectations that came true teach nothing."
    ]
  },
  {
    id: "structural-sensors-v11",
    title: "Structural sensors 1.1: after the first year",
    type: "Structure",
    stage: "Has instances",
    track: "Structure",
    origin: "Egregor Cloud",
    summary:
      "The same points, corrected by one year of real records. A worked example of how a method inherits from its previous version.",
    tags: ["sensors", "structure", "versions", "inheritance"],
    genome: [
      "Four measurement points instead of five",
      "Humidity sensor moved to the base of the wall",
      "Vibration sampled every 10 minutes, not every minute",
      "Observation only — still no control"
    ],
    links: ["Structural sensors: minimal entry"],
    sensors: [
      { id: "vib-1", what: "Floor slab vibration", unit: "mm/s", rate: "1/10 min", where: "mid-span, 2nd floor",     why: "1/min produced noise, not signal" },
      { id: "hum-1", what: "Humidity inside wall", unit: "%",    rate: "1/hour",   where: "north wall, +0.3 m",      why: "moisture enters at the base, not mid-height" },
      { id: "t-out", what: "Outdoor temperature",  unit: "°C", rate: "1/hour", where: "north facade, in shade",  why: "nothing else is comparable without it" },
      { id: "t-in",  what: "Indoor temperature",   unit: "°C", rate: "1/hour", where: "living space, 1.5 m",     why: "the gradient explains wall behaviour" }
    ],
    metrics: [
      { id: "wet-days",   name: "Days above 80 % wall humidity", unit: "days",     better: "lower" },
      { id: "vib-growth", name: "Vibration growth per year",     unit: "% / year", better: "lower" }
    ],
    conditions: {
      climate: "Hot dry, mild winter",
      size: "4 floors, about 1800 m²",
      use: "Residential",
      occupancy: "About 60 people",
      notes: "Same building type as the previous version"
    },
    lineage: {
      parent: "structural-sensors-minimal",
      version: "1.1",
      changed: [
        "Crack sensor removed — no crack moved measurably in twelve months",
        "Humidity sensor moved from +1.0 m to +0.3 m",
        "Vibration rate reduced from 1/min to 1/10 min",
        "Crack opening rate dropped as a metric"
      ]
    },
    instances: [
      {
        id: "rehovot-01",
        where: "Rehovot, first test building",
        started: "2026-10",
        status: "Recording",
        months: 12,
        result: "All five points survived a year. Data volume turned out far smaller than expected.",
        surprise: "The crack never moved. But wall humidity at floor level was double the value at +1.0 m — the sensor had been in the wrong place all along."
      }
    ],
    thoughts: [
      "Version 1.1 exists only because one building was actually instrumented. Nothing here could have been guessed."
    ]
  },
  {
    id: "control-transfer",
    title: "Does a trained controller transfer to another building?",
    type: "Operations",
    stage: "Open problem",
    track: "Operations",
    origin: "Egregor Cloud",
    summary:
      "Training an operating policy for one facility is expensive. Published work reaches near-optimal performance for a single facility after roughly 9.8 million training steps. The question is how much of that a second building has to pay again.",
    tags: ["control", "transfer", "reinforcement learning", "cost"],
    genome: [
      "Building A trains from scratch, record the steps to threshold",
      "Building B trains from scratch, record the steps to threshold",
      "Building B starts warm from A's policy, record the steps again",
      "Vary the difference in configuration between A and B and repeat",
      "Look for where the saving vanishes, and where it goes negative"
    ],
    links: ["Heat: finding where it actually goes"],
    sensors: [
      { id: "steps",  what: "Training steps to threshold", unit: "steps", rate: "per run", where: "simulation log",     why: "this is the cost being saved or wasted" },
      { id: "perf",   what: "Performance at threshold",    unit: "% of optimum", rate: "per run", where: "simulation log", why: "a faster result at a worse level is not a saving" },
      { id: "confdist", what: "Configuration distance A to B", unit: "index", rate: "per pair", where: "defined per building pair", why: "the axis the whole answer sits on" }
    ],
    metrics: [
      { id: "saving",   name: "Saving from warm start, 1 − M/N", unit: "share",  better: "higher" },
      { id: "negshare", name: "Share of pairs with negative transfer", unit: "%",   better: "lower" },
      { id: "breakpt",  name: "Configuration distance where saving reaches zero", unit: "index", better: "higher" }
    ],
    conditions: {
      climate: "Not a factor in simulation; becomes one in real buildings",
      size: "Facilities of comparable scale in the first pass",
      use: "Mission-critical facilities are the published case; ordinary buildings are the open question",
      occupancy: "Modelled",
      notes: "Existing work transfers a ventilation controller between similar offices. Whether that survives structurally different facilities is unanswered."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "The interesting result is not that sharing helps. It is the distance at which it stops helping and starts harming.",
      "This is the same question as inheritance between robots, with layout difference in place of body difference."
    ]
  },
  {
    id: "comfort-complaints",
    title: "Comfort: what people actually complain about",
    type: "Comfort",
    stage: "Open problem",
    track: "Comfort",
    origin: "Egregor Cloud",
    summary:
      "Complaints about a building are treated as opinion. Logged against temperature, humidity and CO₂ at the same moment, they become the cheapest diagnostic instrument a building has.",
    tags: ["comfort", "ergonomics", "air", "occupants"],
    genome: [
      "A one-tap complaint log: too hot, too cold, stuffy, draught, noise",
      "Every entry stamped with time and place",
      "Temperature, humidity and CO₂ recorded on the same clock",
      "No survey, no questionnaire — those measure patience, not the building"
    ],
    links: ["Heat: finding where it actually goes"],
    sensors: [
      { id: "t-in",  what: "Indoor temperature", unit: "°C", rate: "1/10 min", where: "each zone with complaints", why: "the complaint is meaningless without it" },
      { id: "rh-in", what: "Indoor humidity",    unit: "%",       rate: "1/10 min", where: "same point",                why: "same temperature feels different at different humidity" },
      { id: "co2",   what: "CO₂",           unit: "ppm",     rate: "1/10 min", where: "breathing height",          why: "stuffiness is usually ventilation, not heat" },
      { id: "cmpl",  what: "Complaint events",   unit: "count",   rate: "as they happen", where: "one tap, per zone",   why: "the only signal that comes from the people" }
    ],
    metrics: [
      { id: "cmpl-rate",  name: "Complaints per person per month", unit: "count", better: "lower" },
      { id: "co2-hours",  name: "Hours above 1000 ppm CO₂",   unit: "hours", better: "lower" },
      { id: "explained",  name: "Share of complaints explained by a measured value", unit: "%", better: "higher" }
    ],
    conditions: {
      climate: "Any",
      size: "From one floor upward",
      use: "Office, school, clinic, residential",
      occupancy: "Must be known per zone",
      notes: "The cheapest of all the problems here. No structural work at all."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "The share of complaints that no measurement explains is itself a finding: it says the sensors are in the wrong places."
    ]
  },
  {
    id: "water-losses",
    title: "Water: finding the loss nobody sees",
    type: "Water",
    stage: "Open problem",
    track: "Water",
    origin: "Egregor Cloud",
    summary:
      "A building's water bill is a single number at the end of the month. Split by riser and read at night, it separates real consumption from a leak that has been running for years.",
    tags: ["water", "losses", "cheap entry"],
    genome: [
      "Meter at the inlet plus one per riser",
      "Night minimum flow, between 02:00 and 04:00, as the key reading",
      "Nothing replaced until a month of records exists",
      "Only then a recommendation, with the expected saving stated in advance"
    ],
    links: ["Heat: finding where it actually goes"],
    sensors: [
      { id: "q-main",  what: "Inlet flow",       unit: "m³/h", rate: "1/15 min", where: "building inlet",        why: "the total everything is checked against" },
      { id: "q-riser", what: "Flow per riser",   unit: "m³/h", rate: "1/15 min", where: "each riser",            why: "locates the loss instead of just proving it exists" },
      { id: "p-in",    what: "Inlet pressure",   unit: "bar",       rate: "1/15 min", where: "after the inlet valve", why: "excess pressure produces losses on its own" }
    ],
    metrics: [
      { id: "night-min", name: "Night minimum flow", unit: "m³/h", better: "lower" },
      { id: "per-person", name: "Water per person per day", unit: "litres", better: "lower" },
      { id: "unaccounted", name: "Share unaccounted for", unit: "%", better: "lower" }
    ],
    conditions: {
      climate: "Any; matters most where water is expensive",
      size: "From one block of flats upward",
      use: "Residential, hotel, campus",
      occupancy: "Required, otherwise per-person figures are meaningless",
      notes: "Night minimum flow is the single most informative reading and the cheapest to obtain."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "A night minimum that never reaches zero means a leak. The building has usually been paying for it for years."
    ]
  }
];
