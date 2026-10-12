/* ============================================================
   MODEL TEMPLATE — Egregor Cloud
   ------------------------------------------------------------
   Draft. Does not touch models.js.
   Copy the TEMPLATE block, fill it in, put it in models.js.

   A model is not a description of an idea. It is a CONTRACT with
   whoever takes it: what to build, what to measure, what counts
   as success, and what to send back.

   REVISION 12.10.2026, after experiments 15-19 on the thermal
   bench. Measured on 40 donors and 200 receivers, 21 climates.
   Code and data: doi:10.5281/zenodo.23012010

   1. Copying a finished body is harmful. Giving an Israeli
      dwelling the Swedish body costs +70 % of the hours outside
      the norm; the other way round, +34 %. So what sits in the
      cloud is a RULE, not a set of numbers. Field: rules.

   2. Every rule has a reach, and the reach is a number.
      Interaction share: 6 % inside a uniform Europe, 39 % between
      Israel and Sweden. Field: applies.

   3. The weight between metrics is set by whoever takes the
      model, not by its author. The same body is best in Stockholm
      and worst in Tel Aviv only because the weight of summer is
      0.02 against 0.70. metrics now carries NO weights; they come
      from outside. Field: weighting.

   4. A rule must travel together with the list of what was NOT
      measured while deriving it. Our bench has no shutters, no
      roof reflectance, no moisture — which is why its numbers for
      hot climates are overstated. Field: blindspots.
   ============================================================ */

window.EGREGOR_MODEL_TEMPLATE = {

  /* --- 1. WHAT IT IS. The site already reads these. ------- */

  id: "",            // latin, hyphenated: living-water-system
  title: "",         // how people see it
  type: "",          // Living House | Living Mobility | Sensor System | Infrastructure | Platform
  stage: "",         // Draft | Seed model | Technical branch | System concept
  track: "",         // branch: Alive Things | Construction | Water | Waste
  origin: "",        // where it came from
  summary: "",       // one sentence: what this is and what for
  image: "",         // "./assets/xxx.webp" or empty
  imageCaption: "",
  tags: [],          // ["water", "closed loop"]

  /* --- 2. WHAT IT IS MADE OF. Already read by the site. --- */

  genome: [],        // devices and principles, one per line
  links: [],         // titles of related models

  /* --- 2b. RULES. NEW 12.10. ----------------------------- *
   * A gene is not a number. It is a rule of the form "under   *
   * such a condition, such a value". A number written without *
   * its condition turns harmful the moment it crosses a       *
   * climate.                                                  *
   *                                                           *
   * Experiment 18: the body that is best for Sweden costs an  *
   * Israeli dwelling +70 % discomfort. Cloning is out; only   *
   * the rule can be inherited.                                */

  rules: [
    {
      param: "",     // what is being set: wall U-value, window share, setpoint
      unit: "",      // W/m2K, fraction, degC
      depends: "",   // on what: share of cooling degree-days
      rule: "",      // in words or as a formula: "share of heat > 0.5 -> take 0.5-0.7"
      checked: "",   // on what it was checked: "21 climates, 400 bodies"
      kind: ""       // "body" — built once | "distro" — changes daily
    }
  ],

  /* --- 2c. WHERE THIS WORKS. NEW 12.10. ------------------ *
   * Not in words, in a number. The interaction share tells    *
   * how much of the outcome depends on the PAIR of rule and   *
   * receiver.                                                 *
   *                                                           *
   *   low  (< 10 %)  one rule fits everyone, nothing to match *
   *   high (> 30 %)  addressed rule, wrong address is costly  */

  applies: {
    tested_on: "",      // "21 climates, share of heat from 0.02 to 0.70"
    interaction: null,  // interaction share, 0..1. Experiment 18 gave 0.39
    misfit_cost: "",    // cost of the wrong address: "+70 % when the climate sign flips"
    not_tested: ""      // where it was NOT checked: "tropics, high altitude, humid"
  },

  /* --- 2d. WHAT WAS NOT MEASURED. NEW 12.10. ------------- *
   * Every rule quietly carries an assumption: that the        *
   * processes nobody named behaved the same way at both ends. *
   * Here that assumption is said out loud.                    *
   *                                                           *
   * Our own case: the bench has no shutters, and in Israel    *
   * they are closed every day. So our hot-climate numbers are *
   * overstated, and we say so rather than hide it.            */

  blindspots: [],    // one per line: "shutters", "roof reflectance", "moisture"

  /* --- 3. WHAT TO MEASURE. ------------------------------- *
   * Without this nothing comes back from the object.         *
   * This is the most important part of the model.            */

  sensors: [
    {
      id: "",        // short name: t-supply
      what: "",      // what is measured: supply temperature
      unit: "",      // degC, m3/h, mm, Hz
      rate: "",      // how often: every 5 minutes
      where: "",     // where to put it: on the supply riser, level +0.000
      why: ""        // what for: without it overheating is invisible
    }
  ],

  /* --- 4. WHAT COUNTS AS SUCCESS. ------------------------ *
   * Otherwise there is nothing to compare and nothing to     *
   * inherit.                                                 */

  metrics: [
    {
      id: "",        // heat-per-m2
      name: "",      // heat use per square metre
      unit: "",      // kWh / m2 / year
      better: ""     // "lower" — smaller is better | "higher"
      // THERE IS NO WEIGHT HERE AND THERE MUST NOT BE. The model lists
      // what to measure. How much one thing matters against another is
      // decided by whoever takes it: their climate, their money, their
      // taste. Experiment 18: the same body is best in Stockholm and
      // worst in Tel Aviv purely because of the weight of summer,
      // 0.02 against 0.70.
    }
  ],

  /* --- 4b. WHERE THE WEIGHTS COME FROM. NEW 12.10. ------- *
   * Filled in NOT by the author of the model but by whoever   *
   * applies it. Part is computed from the site, part is       *
   * declared by the owner.                                    */

  weighting: {
    by_place: "",    // computed automatically: "share of heat = CDD/(HDD+CDD)"
    by_owner: [],    // declared by the owner: "the view matters more than the saving"
    note: ""         // "taste and a plain preference are weights like any other"
  },

  /* --- 5. UNDER WHAT CONDITIONS. ------------------------- *
   * Experience without conditions is useless: what saved heat *
   * in Rehovot can freeze a building in St Petersburg.        */

  conditions: {
    climate: "",     // hot dry | temperate | cold
    size: "",        // 4 storeys, 1800 m2
    use: "",         // housing | office | workshop | hospital
    occupancy: "",   // 60 people, around the clock
    notes: ""        // everything else that matters
  },

  /* --- 6. WHERE IT CAME FROM. ---------------------------- *
   * This is where inheritance lives.                          */

  lineage: {
    parent: "",      // id of the parent model. Empty means first in its line
    version: "1.0",
    changed: []      // what changed against the parent, one per line
  },

  /* --- 7. WHAT CAME BACK FROM THE OBJECTS. --------------- *
   * Filled in during operation. This is the gene pool.        */

  instances: [
    {
      id: "",        // rehovot-01
      where: "",     // Rehovot, such and such street
      started: "",   // 2026-10
      status: "",    // building | running | stopped
      months: 0,     // months of records accumulated
      result: "",    // briefly: what came out
      surprise: "",  // what went differently than expected. MOST IMPORTANT
      weights: "",   // weights used here: "summer 0.7, winter 0.3, the view matters"
      outside: ""    // how conditions fell outside applies.tested_on. Empty = within
    }
  ],

  thoughts: []       // notes. Already read by the site
};


/* ============================================================
   EXAMPLE — the cheapest way in.
   One building, five sensors, one year of records.
   ============================================================ */

window.EGREGOR_MODEL_EXAMPLE = {

  id: "structural-sensors-minimal",
  title: "Structural sensors — minimal entry",
  type: "Sensor System",
  stage: "Technical branch",
  track: "Construction",
  origin: "Alive Things",
  summary:
    "Five points on one building: vibration, moisture, deformation. One year of records. The cheapest way to start accumulating experience.",
  tags: ["sensors", "structure", "first step"],

  genome: [
    "Five measurement points on load-bearing elements",
    "Self-powered, reports once a day",
    "Written to a common log tied to conditions",
    "No control at all — observation only"
  ],
  links: ["House Egregor Concept"],

  rules: [],
  applies: {
    tested_on: "",
    interaction: null,
    misfit_cost: "",
    not_tested: "nothing has been built from this model yet"
  },
  blindspots: [
    "no load measurement — only its consequences",
    "no record of what people did in the building"
  ],

  sensors: [
    { id: "vib-1",  what: "floor vibration",      unit: "mm/s", rate: "every minute", where: "mid-span, 2nd floor",             why: "mobility grows before cracks appear" },
    { id: "hum-1",  what: "moisture inside wall", unit: "%",    rate: "hourly",       where: "north wall, level +1.0",          why: "freezing and mould start here" },
    { id: "def-1",  what: "crack opening",        unit: "mm",   rate: "daily",        where: "on the crack, if there is one",   why: "direct sign of structural movement" },
    { id: "t-out",  what: "outdoor temperature",  unit: "degC", rate: "hourly",       where: "north facade, in shade",          why: "without it nothing else can be compared" },
    { id: "t-in",   what: "indoor temperature",   unit: "degC", rate: "hourly",       where: "living space, 1.5 m above floor", why: "the gradient explains the wall's behaviour" }
  ],

  metrics: [
    { id: "vib-growth", name: "vibration growth per year",     unit: "% / year",  better: "lower" },
    { id: "wet-days",   name: "days above 80 % wall moisture", unit: "days",      better: "lower" },
    { id: "crack-rate", name: "crack opening rate",            unit: "mm / year", better: "lower" }
  ],

  weighting: {
    by_place: "",
    by_owner: ["how much a year of safety margin is worth against the cost of sensors"],
    note: "Until something has been built, the weights are whatever the first owner declares."
  },

  conditions: {
    climate: "hot dry, mild winter",
    size: "4 storeys, about 1800 m2",
    use: "housing",
    occupancy: "about 60 people",
    notes: "1970s building, never refurbished"
  },

  lineage: { parent: "", version: "1.0", changed: [] },
  instances: [],

  thoughts: [
    "Start with observation, not control. There is nothing to control while there is nothing to compare.",
    "The most valuable field is surprise. Expectations that came true teach nothing."
  ]
};


/* ============================================================
   SECOND EXAMPLE — filled with real numbers.
   Experiments 13-19 on the thermal bench, 12.10.2026.
   Code and data: doi:10.5281/zenodo.23012010
   This is what the new fields look like when they hold
   measurements rather than words.
   ============================================================ */

window.EGREGOR_MODEL_ENVELOPE = {

  id: "envelope-rule-by-climate",
  title: "Building envelope: a rule instead of a drawing",
  type: "Living House",
  stage: "Seed model",
  track: "Construction",
  origin: "Alive Things",
  summary:
    "Not 'here is the wall to build' but 'here is how the wall depends on climate'. Tested by transferring between 21 climates: copying a finished body hurts, transferring the rule does not.",
  tags: ["envelope", "inheritance", "climate", "measured"],

  genome: [
    "The envelope is given by a rule, not by numbers",
    "The rule reads the climate of the site and returns values",
    "The body is built anew on site, never copied",
    "Shutters and ventilation are inherited separately from walls"
  ],
  links: ["House Egregor Concept"],

  rules: [
    {
      param: "External wall U-value",
      unit: "W/m2K",
      depends: "share of cooling degree-days in all degree-days",
      rule: "share of heat < 0.1 -> 0.26...0.30;  0.1-0.4 -> 0.30...0.35;  > 0.5 -> do not insulate past 0.5, shading matters more",
      checked: "200 dwellings, 21 climates, optimum on full cost over 30 years, IWU cost data",
      kind: "body"
    },
    {
      param: "Window U-value",
      unit: "W/m2K",
      depends: "share of heat",
      rule: "in a cold climate down to 1.3; below 1.3 the price rises faster than the saving",
      checked: "IWU Darmstadt cost data, EU cost-optimal methodology",
      kind: "body"
    },
    {
      param: "Shutter position",
      unit: "open / closed",
      depends: "time of day and season",
      rule: "in a hot climate close during the day in summer, open at night",
      checked: "NOT TESTED on the bench — there are no shutters in the model. Rule from practice, not from measurement",
      kind: "distro"
    }
  ],

  applies: {
    tested_on:
      "21 climates, share of heat from 0.02 (Stockholm) to 0.70 (Beer Sheva); dwellings 43-200 m2, 1-3 storeys, TABULA ranges",
    interaction: 0.39,
    misfit_cost:
      "give an Israeli dwelling the Swedish rule: +70 % of hours outside the norm; the other way round: +34 %",
    not_tested:
      "tropics, high altitude, humid climates; dwellings above 200 m2; non-residential buildings"
  },

  blindspots: [
    "shutters and any shading — absent from the model entirely",
    "roof reflectance — the roof is described by a single U-value",
    "moisture and vapour transport",
    "phase-change materials",
    "evaporative cooling",
    "the price of airtightness and of heavy construction — no cost data",
    "one weather year on the Israeli climates: Tel Aviv and Beer Sheva, one year each"
  ],

  sensors: [
    { id: "t-in",   what: "indoor air temperature",  unit: "degC", rate: "every 15 minutes", where: "living room, 1.5 m above floor",          why: "the only thing that ends up in the count" },
    { id: "t-out",  what: "outdoor temperature",     unit: "degC", rate: "hourly",           where: "north facade, in shade",                  why: "without it the indoor value compares to nothing" },
    { id: "e-heat", what: "electricity for heating", unit: "kWh",  rate: "hourly",           where: "heat pump meter",                         why: "the price of the reserve, the second measure" },
    { id: "shut",   what: "shutter position",        unit: "0/1",  rate: "on change",        where: "every window, or at least the south one",  why: "the main summer lever, and it is behavioural" }
  ],

  metrics: [
    { id: "udh-cold", name: "degree-hours below the setpoint, occupied hours", unit: "K.h", better: "lower" },
    { id: "udh-hot",  name: "degree-hours above 26 degC, occupied hours",      unit: "K.h", better: "lower" },
    { id: "kwh",      name: "electricity per year",                            unit: "kWh", better: "lower" },
    { id: "capex",    name: "envelope cost above the minimum",                 unit: "EUR", better: "lower" }
  ],

  weighting: {
    by_place:
      "share of heat = CDD / (HDD + CDD) from the weather record of the site. Stockholm 0.02, Rome 0.30, Tel Aviv 0.69",
    by_owner: [
      "what an hour of discomfort is worth against a kilowatt-hour",
      "horizon: ten years or thirty",
      "the view from the window against the glazed area",
      "how the facade should look"
    ],
    note:
      "Taste and a plain personal preference enter here on the same footing as climate. The model does not judge them and does not argue. It takes them as input and returns a different answer."
  },

  conditions: {
    climate: "any of those tested, see applies.tested_on",
    size: "43-200 m2, 1-3 storeys",
    use: "housing",
    occupancy: "ten hours a day, arrival hour between 5 and 9",
    notes: "the population of dwellings is generated from TABULA ranges, not drawn from a register"
  },

  lineage: { parent: "", version: "1.0", changed: [] },
  instances: [],

  thoughts: [
    "Choosing a donor inside one climate is worth 1 %. Between different climates it is worth 9 %, and the wrong address costs 70 %.",
    "Between-donor concordance does not catch this: it stayed at 0.94 in both cases. The interaction share does: 6 % against 39 %.",
    "In the north the body decides, in the south the daily routine. That is why shutters are inherited separately from walls.",
    "In Stockholm 96 % of a dwelling's quality is explained by its properties taken one at a time. In Tel Aviv, 25 %. There is no simple rule for the south; there, combinations do the work."
  ]
};
