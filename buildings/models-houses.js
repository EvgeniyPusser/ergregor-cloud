/* ============================================================
   ВЕТКА ДОМОВ — Egregor Cloud
   ------------------------------------------------------------
   Семь моделей. Формат как в models.js: по-английски, те же поля.
   Вставлять в window.EGREGOR_MODELS, в конец массива.

   track: "Living House" — если ветка называется иначе, заменить
   во всех семи.

   ПОРЯДОК НЕ СЛУЧАЙНЫЙ. Он по времени отклика, как у тела:

     0   тело           общий дом, к которому крепится остальное
     1   нервы          секунды-минуты: почувствовать
     2   кровь          часы-дни: перераспределить тепло
     3   кожа           часы: лестница мер в холод, от дешёвых к дорогим
     4   заживление     дни-недели: закрыть трещину
     5   кость          месяцы-годы: нарастить там, где давит
     6   одна сеть      замкнуть петлю: та же сеть чувствует и отвечает

   Во всех instances пустые. Ни один дом не построен, и выдумывать
   возвращённый опыт нельзя: instances заполняется только с объекта.
   Единственная модель с измеренным результатом — про наследование
   зимы, и там прямо сказано, что доказательство численное, не
   построенное.
   ============================================================ */

window.EGREGOR_MODELS_HOUSES = [

  /* =========================================================
     0. ТЕЛО
     ========================================================= */
  {
    id: "house-body-from-stock",
    title: "A house body taken from the real stock",
    type: "Structure",
    stage: "Open problem",
    track: "Living House",
    origin: "Egregor Cloud",
    summary:
      "Every living-house model needs a body to attach to. Inventing one makes models incomparable: each author describes a different house and nothing can be inherited. This model fixes the body — one dwelling drawn from the published US residential stock, with its vintage, insulation, heating system and climate zone taken as given.",
    tags: ["house", "stock", "shared body", "baseline"],
    genome: [
      "One dwelling taken from the ResStock characteristics set, not designed",
      "Vintage, wall and roof insulation, window type, air tightness, heating system as published",
      "Climate zone recorded with the dwelling and never separated from it",
      "The same body reused by every model in this branch, so results can be compared",
      "A second body from a different vintage and zone, so one house is never the whole answer"
    ],
    links: ["Heat: finding where it actually goes"],
    sensors: [
      { id: "t-in",   what: "Indoor air temperature",      unit: "°C",  rate: "hourly", where: "living space, 1.5 m above floor", why: "everything else is read against it" },
      { id: "t-out",  what: "Outdoor air temperature",     unit: "°C",  rate: "hourly", where: "north facade, shaded",            why: "the building's own weather record, not a nearby station's" },
      { id: "energy", what: "Energy delivered to heating", unit: "kWh", rate: "hourly", where: "at the heat source",              why: "the bill, separated from the tariff" },
      { id: "occ",    what: "Occupied or not",             unit: "0/1", rate: "hourly", where: "any presence signal",             why: "comfort counted when nobody is home is not comfort" }
    ],
    metrics: [
      { id: "kwh-m2",   name: "Heating energy per floor area, season",               unit: "kWh/m²", better: "lower" },
      { id: "degree-h", name: "Degree-hours below the comfort norm, occupied hours", unit: "K·h",    better: "lower" },
      { id: "worst-72", name: "Coldest 72 hours: temperature reached indoors",       unit: "°C",     better: "higher" }
    ],
    conditions: {
      climate: "Stated per body, by climate zone of the stock record",
      size: "Single dwelling, as published",
      use: "Dwelling",
      occupancy: "As published in the stock record",
      notes: "A generator produces the spread its author assumed. A published stock produces the spread that exists. That difference is the whole reason for taking the body from outside."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "A model library without a shared body collects descriptions, not experience.",
      "The body is deliberately ordinary. A living house has to begin as an existing house, or nobody can check the claim."
    ]
  },

  /* =========================================================
     1. НЕРВЫ — секунды и минуты
     ========================================================= */
  {
    id: "walls-that-feel",
    title: "Walls that feel: the reinforcement as a nervous system",
    type: "Structure",
    stage: "Open problem",
    track: "Living House",
    origin: "Egregor Cloud",
    summary:
      "Concrete with conductive additions changes its resistance when it cracks, wets or is loaded, and current can be passed along the reinforcement itself. The wall becomes its own sensor with nothing mounted on it. The open question is not whether the effect exists — laboratories agree that it does — but how much signal is left after several years of weather, once temperature and moisture are taken out of it.",
    tags: ["self-sensing", "concrete", "nerves", "no added sensors"],
    genome: [
      "Concrete made conductive by carbon fibre or nanotube addition",
      "Existing reinforcement used as the electrode pair; no separate probes cast in",
      "Resistance measured across defined wall sections, four-point, on a fixed schedule",
      "Temperature and moisture measured in the same section, because both move resistance on their own",
      "One section left plain as a control: same wall, same weather, no addition"
    ],
    links: ["A house body taken from the real stock", "Structural sensors: minimal entry"],
    sensors: [
      { id: "res",    what: "Section resistance",          unit: "Ω",  rate: "hourly",           where: "between two reinforcement bars of the section", why: "the wall's own signal; a rising trend precedes a visible crack" },
      { id: "t-wall", what: "Temperature inside the wall", unit: "°C", rate: "hourly",           where: "mid-thickness of the section",                  why: "resistance moves with temperature; without this the signal is unreadable" },
      { id: "moist",  what: "Moisture in the wall",        unit: "%",  rate: "hourly",           where: "mid-thickness, same section",                   why: "wet concrete conducts, so rain would otherwise look like damage" },
      { id: "crack",  what: "Visible crack width",         unit: "mm", rate: "monthly, by hand", where: "on any crack that appears",                     why: "the ground truth the resistance signal is checked against" },
      { id: "load",   what: "Strain in the section",       unit: "µε", rate: "hourly",           where: "one gauge per section",                         why: "separates load from damage" }
    ],
    metrics: [
      { id: "lead-time", name: "Days between resistance trend and visible crack",     unit: "days",       better: "higher" },
      { id: "false-pos", name: "False alarms per year",                               unit: "count",      better: "lower" },
      { id: "drift",     name: "Resistance drift of the undamaged control section",   unit: "% per year", better: "lower" }
    ],
    conditions: {
      climate: "Stated per body. Freeze-thaw and driving rain change the answer completely",
      size: "One wall, three sections and one control",
      use: "Dwelling",
      occupancy: "Not a factor",
      notes: "Laboratory results are strong and consistent. What is unestablished is the same wall after several winters, and how much signal survives once temperature and moisture are removed from it."
    },
    lineage: { parent: "structural-sensors-minimal", version: "1.0", changed: [
      "The wall itself is the sensor; the parent model mounts sensors on the wall",
      "Adds a control section, so drift can be told from damage"
    ] },
    instances: [],
    thoughts: [
      "A sensor mounted on a wall is the first thing removed when money runs short. A wall that is its own sensor cannot be removed.",
      "The cheapest honest version is one wall with four sections. Not a building."
    ]
  },

  /* =========================================================
     2. КРОВЬ — часы и дни
     ========================================================= */
  {
    id: "one-circulation-for-the-house",
    title: "One circulation for the whole house",
    type: "Heat",
    stage: "Open problem",
    track: "Living House",
    origin: "Egregor Cloud",
    summary:
      "Water pipes cast into concrete floors already turn the building mass into a radiator or a cooler. Such systems exist and work. What they are not is connected: the pipe network knows nothing about the sensing network, nothing about where damage is, and nothing about which rooms are occupied. This model joins them and measures what the joining is worth.",
    tags: ["thermal mass", "circulation", "TABS", "heat distribution"],
    genome: [
      "Water circuits cast into floor and wall concrete, zone by zone",
      "Flow to each zone controlled separately, not one loop for the building",
      "The sensing network of the walls decides where heat goes, not a thermostat in the hall",
      "Core zones and peripheral zones declared in advance, because the ladder model will need them",
      "A conventional control kept as the comparison: same house, same weather, dumb loop"
    ],
    links: ["Walls that feel: the reinforcement as a nervous system", "A house body taken from the real stock", "Heat: finding where it actually goes"],
    sensors: [
      { id: "t-supply", what: "Supply water temperature",   unit: "°C",   rate: "5 minutes", where: "at the manifold, per zone", why: "the input the whole distribution is judged against" },
      { id: "t-return", what: "Return water temperature",   unit: "°C",   rate: "5 minutes", where: "per zone",                   why: "supply minus return is the heat that actually entered the slab" },
      { id: "flow",     what: "Flow rate",                  unit: "m³/h", rate: "5 minutes", where: "per zone",                   why: "without it the temperature difference is not energy" },
      { id: "t-slab",   what: "Temperature inside the slab", unit: "°C",  rate: "hourly",    where: "mid-depth, one per zone",    why: "the store; it lags the water by hours and that lag is the asset" },
      { id: "t-room",   what: "Room air temperature",       unit: "°C",   rate: "15 minutes", where: "each zone, 1.5 m",          why: "what the person feels, which is not the slab" }
    ],
    metrics: [
      { id: "zone-spread", name: "Spread of room temperatures across zones", unit: "K",     better: "lower" },
      { id: "store-hours", name: "Hours the slab holds comfort with the source off", unit: "h", better: "higher" },
      { id: "vs-dumb",     name: "Season energy against the conventional loop", unit: "ratio", better: "lower" }
    ],
    conditions: {
      climate: "Stated per body",
      size: "Single dwelling, three to five zones",
      use: "Dwelling",
      occupancy: "Recorded per zone; the point of zoning is that occupancy differs between them",
      notes: "Thermally active building systems are established technology. The claim under test is not that they work, but that connecting them to the sensing network is worth its cost."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "Heavy concrete already stores heat. The only thing missing is that the same network should decide where it goes.",
      "The honest comparison is against a good conventional system, not against a bad one."
    ]
  },

  /* =========================================================
     3. КОЖА — лестница мер. Здесь живёт открытый вопрос
        из нашей измеренной работы.
     ========================================================= */
  {
    id: "house-that-regulates-like-skin",
    title: "A house that regulates like skin: a ladder of responses, cheapest first",
    type: "Operations",
    stage: "Open problem",
    track: "Living House",
    origin: "Egregor Cloud",
    summary:
      "A body does not meet cold with one measure. It narrows the vessels, raises the hair, burns its reserve, shivers, and only then curls up — cheap before expensive, and each step has a trigger. A house has the same steps available and uses none of them in order. This model defines the ladder, its thresholds and its prices, and asks what the ordering is worth.",
    tags: ["thermoregulation", "crisis", "reserve", "staged response"],
    genome: [
      "Step 1, vasoconstriction: stop sending heat to outer walls and peripheral rooms, hold the core",
      "Step 2, piloerection: hold a still layer of air — shutters, an inflatable cavity, a closable gap in the wall",
      "Step 3, brown fat: a store charged in advance and spent only in crisis — phase-change material or a hot store",
      "Step 4, shivering: active heat, the expensive step, last",
      "Step 5, behaviour: close rooms and heat a smaller volume",
      "Each step declared with a trigger and a price before the season starts, not tuned during it",
      "The trigger is a leading indicator: outdoor temperature and its rate of fall, both available and both unused today"
    ],
    links: ["A house inherits someone else's winter", "One circulation for the whole house", "A house body taken from the real stock"],
    sensors: [
      { id: "t-out",   what: "Outdoor air temperature",             unit: "°C",   rate: "hourly",     where: "north facade, shaded",     why: "the leading signal; the ladder is triggered from it, not from the room" },
      { id: "dt-out",  what: "Rate of fall of outdoor temperature", unit: "K/h",  rate: "hourly",     where: "computed from t-out",      why: "a body reacts to the onset of cold, not to being already cold" },
      { id: "t-core",  what: "Temperature of the core zone",        unit: "°C",   rate: "15 minutes", where: "living space",             why: "what is being protected" },
      { id: "t-perif", what: "Temperature of peripheral zones",     unit: "°C",   rate: "15 minutes", where: "corridor, store room",     why: "what is being sacrificed, and how far it is allowed to fall" },
      { id: "store",   what: "Charge left in the store",            unit: "kWh",  rate: "hourly",     where: "at the phase-change store", why: "a reserve that is never spent is a reserve that was never needed" },
      { id: "step",    what: "Which step is active",                unit: "1-5",  rate: "15 minutes", where: "control log",              why: "the record of what the house chose, which is the inheritable part" }
    ],
    metrics: [
      { id: "degree-h",  name: "Degree-hours below the norm in the core during the event", unit: "K·h",  better: "lower" },
      { id: "kwh",       name: "Energy over the season",                                   unit: "kWh",  better: "lower" },
      { id: "reserve-c", name: "Cost of holding the reserve outside the event",            unit: "kWh",  better: "lower" },
      { id: "step-cost", name: "Energy per degree-hour avoided, by step",                  unit: "kWh/K·h", better: "lower" }
    ],
    conditions: {
      climate: "Measured record, not a typical year. The event is the coldest 72 hours of the house's own year, located by search, not chosen",
      size: "Single dwelling with declared core and periphery",
      use: "Dwelling",
      occupancy: "Ten hours a day",
      notes: "This model exists because of a defect found in a measured result. In that work the house held its reserve all winter and was repaid for three days: 42 % of the benefit fell inside 1.4 % of the season. A ladder triggered by a leading indicator should get most of the benefit at a fraction of the cost. That has not been tested."
    },
    lineage: { parent: "house-inherits-a-winter", version: "1.0", changed: [
      "One continuous policy is replaced by an ordered set of responses with thresholds",
      "The trigger moves from the indoor temperature to the outdoor one and its rate of fall",
      "Each step carries its own price, so the ordering can be checked rather than assumed"
    ] },
    instances: [],
    thoughts: [
      "The order matters more than any single step. Cheap measures first is not an engineering preference, it is what every warm-blooded animal does.",
      "The bench for this exists and is calibrated. This is the next experiment, not a distant one.",
      "The same ladder runs backwards in heat: evaporation through porous walls is sweating."
    ]
  },

  /* =========================================================
     4. ЗАЖИВЛЕНИЕ — дни и недели
     ========================================================= */
  {
    id: "wall-that-closes-its-cracks",
    title: "A wall that closes its own cracks, and what that costs",
    type: "Structure",
    stage: "Open problem",
    track: "Living House",
    origin: "Egregor Cloud",
    summary:
      "Self-healing concrete is reported as a share of crack width closed. That is not the number an owner needs. The numbers are what a repaired metre costs, how much strength comes back, and how many times the same place can heal before the supply is spent. This model measures those three and compares them against a person with a tube of sealant.",
    tags: ["self-healing", "concrete", "electrodeposition", "cost"],
    genome: [
      "One wall in three strips: vascular healing, electrodeposition, and plain concrete as control",
      "Vascular strip: hollow channels carrying a healing agent, broken open by the crack itself",
      "Electrodeposition strip: the reinforcement as cathode, an external anode, minerals deposited into the crack",
      "Polarity monitored and interlocked, because reversed current corrodes the reinforcement instead of healing it",
      "Cracks induced under controlled load at a recorded width, not waited for",
      "The same crack reopened and rehealed until the strip stops recovering",
      "Every repair event costed: agent, current, labour, disruption"
    ],
    links: ["Walls that feel: the reinforcement as a nervous system", "A house body taken from the real stock"],
    sensors: [
      { id: "crack-w",  what: "Crack width",                     unit: "mm",            rate: "daily during healing",       where: "across each induced crack", why: "the quantity everyone reports; kept for comparability" },
      { id: "perm",     what: "Water permeability of the strip",  unit: "m/s",           rate: "before and after each event", where: "over the cracked zone",     why: "a crack closed at the surface may still pass water" },
      { id: "strength", what: "Recovered load capacity",          unit: "% of original", rate: "after each event",           where: "strip test",                why: "closing is not repairing; this is the difference" },
      { id: "supply",   what: "Healing agent remaining",          unit: "% of initial",  rate: "after each event",           where: "reservoir",                 why: "finds the number of repairs the wall actually has" },
      { id: "charge",   what: "Charge passed, electrodeposition", unit: "A·h",           rate: "per event",                  where: "at the electrode",          why: "the energy bill of healing" },
      { id: "polarity", what: "Sign of the reinforcement potential", unit: "V",          rate: "continuous",                 where: "reinforcement against reference electrode", why: "the failure mode of this whole idea; wrong sign eats the steel" }
    ],
    metrics: [
      { id: "cost-per-m", name: "Cost per repaired metre of crack",          unit: "EUR/m", better: "lower" },
      { id: "recovery",   name: "Load capacity recovered",                   unit: "%",     better: "higher" },
      { id: "repeats",    name: "Repairs before the strip stops recovering", unit: "count", better: "higher" },
      { id: "vs-manual",  name: "Cost against ordinary manual repair",       unit: "ratio", better: "lower" }
    ],
    conditions: {
      climate: "Stated per body. Healing chemistry depends on temperature and moisture; a cold dry wall is the hard case",
      size: "One wall, three strips",
      use: "Dwelling",
      occupancy: "Not a factor",
      notes: "Electrodeposition works best where the solution is free, which is why marine structures are its home. In a dry wall the solution has to be supplied, and that cost belongs in the comparison."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "Almost every published result reports crack width closed. Almost none reports the cost of a repair or how many repairs the wall has left in it.",
      "A wall with a finite supply of healing agent has a lifespan of self-repair. That number is the interesting one and it is missing.",
      "The comparison that matters is not healed against unhealed. It is healed against a person with a tube of sealant, counted in money and in disruption."
    ]
  },

  /* =========================================================
     5. КОСТЬ — месяцы и годы
     ========================================================= */
  {
    id: "structure-that-grows-where-it-is-loaded",
    title: "Structure that grows where it is loaded",
    type: "Structure",
    stage: "Open problem",
    track: "Living House",
    origin: "Egregor Cloud",
    summary:
      "Bone thickens where load presses and thins where it does not. Mineral can already be grown onto a steel frame by passing a weak current through sea water — the method is fifty years old and is used to grow coral bases. Nobody has grown it where the structure itself reports the load. This model tests the slowest and least established of the living-house functions, at the smallest honest scale.",
    tags: ["growth", "electrodeposition", "biocement", "bone", "slow"],
    genome: [
      "A steel frame element as the skeleton, mineral grown onto it by imposed current",
      "Growth rate controlled per segment, not uniformly over the element",
      "The segment that reports the highest sustained strain receives the most current",
      "A segment with no load feedback grown at a fixed rate, as control",
      "Growth measured in thickness and in recovered stiffness, not only in mass deposited",
      "Run for at least two years, because the honest objection to this idea is that it is too slow"
    ],
    links: ["Walls that feel: the reinforcement as a nervous system", "A wall that closes its own cracks, and what that costs"],
    sensors: [
      { id: "thick",  what: "Deposited layer thickness", unit: "mm",  rate: "monthly",    where: "five fixed points per segment", why: "the growth itself" },
      { id: "strain", what: "Sustained strain",          unit: "µε",  rate: "hourly",     where: "one gauge per segment",         why: "the signal that is supposed to steer growth" },
      { id: "stiff",  what: "Segment stiffness",         unit: "kN/mm", rate: "quarterly", where: "load test per segment",        why: "mass deposited is not strength gained" },
      { id: "charge", what: "Charge passed",             unit: "A·h", rate: "continuous", where: "per segment",                   why: "the energy price of every millimetre" },
      { id: "steel",  what: "Reinforcement potential",   unit: "V",   rate: "continuous", where: "against reference electrode",   why: "the same polarity trap as in healing" }
    ],
    metrics: [
      { id: "mm-year",   name: "Growth rate",                                       unit: "mm/year",  better: "higher" },
      { id: "kwh-mm",    name: "Energy per millimetre grown",                       unit: "kWh/mm",   better: "lower" },
      { id: "targeting", name: "Growth in the loaded segment against the control",  unit: "ratio",    better: "higher" },
      { id: "stiff-gain", name: "Stiffness gained per millimetre",                  unit: "kN/mm/mm", better: "higher" }
    ],
    conditions: {
      climate: "Immersed or continuously wetted; the process needs a solution",
      size: "One frame element, four segments",
      use: "Laboratory or marine, not a dwelling in the first pass",
      occupancy: "Not a factor",
      notes: "Growth is too slow to help during an earthquake and nobody should claim otherwise. What it can do is come after: the network maps the damage immediately, then thickens over months the places that took the blow. A bone does not survive the fall by growing; it grows because it fell."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "The honest objection is speed, and it is fatal for a house and not fatal for a repair. Repairing a loaded joint over one winter is a real use; growing a wall is not.",
      "The single interesting claim here is targeting: growth steered by measured load rather than applied evenly. That is what makes it bone rather than plating.",
      "If targeting does not beat the uniform control, this model should be marked dead and left in the library as a dead branch. A library that only keeps successes teaches nothing."
    ]
  },

  /* =========================================================
     6. ОДНА СЕТЬ — замкнутая петля. Это и есть исходная мысль.
     ========================================================= */
  {
    id: "one-network-senses-and-answers",
    title: "One network that both senses and answers",
    type: "Operations",
    stage: "Open problem",
    track: "Living House",
    origin: "Egregor Cloud",
    summary:
      "Each part of this branch exists somewhere already: conductive concrete senses, pipes in slabs move heat, current deposits mineral into cracks. All of them are separate networks with separate owners. The idea under test is that one network does all of it — the same reinforcement that reports a crack is the one that carries the current that closes it. Closing that loop is the part nobody has built.",
    tags: ["closed loop", "one network", "reinforcement", "integration"],
    genome: [
      "One conductive network: reinforcement plus cast channels, serving sensing, heating and repair",
      "Time-shared rather than duplicated: measure, then act, on the same conductors",
      "A written protection rule: no action may drive the reinforcement anodic, checked before every actuation",
      "Three separate conventional systems kept in a second, identical house as the comparison",
      "Every action logged with what triggered it, because the log is the inheritable object",
      "A declared failure mode: what the house does when the network itself is damaged"
    ],
    links: [
      "Walls that feel: the reinforcement as a nervous system",
      "One circulation for the whole house",
      "A wall that closes its own cracks, and what that costs",
      "A house that regulates like skin: a ladder of responses, cheapest first"
    ],
    sensors: [
      { id: "net-res",  what: "Resistance of the network as a whole", unit: "Ω",   rate: "hourly",     where: "across the network",          why: "the health of the network itself, separate from the wall's" },
      { id: "action",   what: "Action taken and its trigger",         unit: "log", rate: "per event",  where: "control log",                 why: "the inheritable record; without it nothing transfers to the next house" },
      { id: "polarity", what: "Reinforcement potential",              unit: "V",   rate: "continuous", where: "against reference electrode", why: "the one thing that can turn this whole idea into accelerated corrosion" },
      { id: "downtime", what: "Time the network is unavailable",      unit: "h",   rate: "per event",  where: "control log",                 why: "a shared network fails for all three functions at once; that is its price" }
    ],
    metrics: [
      { id: "vs-three",  name: "Cost against three separate systems",                 unit: "ratio", better: "lower" },
      { id: "loop-time", name: "Time from detection to action",                        unit: "h",     better: "lower" },
      { id: "shared-fail", name: "Functions lost per network failure",                 unit: "count", better: "lower" },
      { id: "steel-loss", name: "Reinforcement section lost to stray current per year", unit: "%",    better: "lower" }
    ],
    conditions: {
      climate: "Stated per body",
      size: "One dwelling, or one wall in the first pass",
      use: "Dwelling",
      occupancy: "As per body",
      notes: "The obvious argument against a shared network is that one failure takes out three functions at once. That argument is not answered by enthusiasm; it is answered by the shared-failure metric above. If it loses, the branch should say so."
    },
    lineage: { parent: "", version: "1.0", changed: [] },
    instances: [],
    thoughts: [
      "This is the whole branch stated as one claim: the house is one organism, not four systems in the same envelope.",
      "It is also the claim most likely to lose on cost. A shared network is cheaper in material and more expensive in consequence.",
      "The three timescales run on the same wires: seconds to sense, hours to move heat, months to grow. A body does this. A building is not known to."
    ]
  },

  /* =========================================================
     7. ИЗМЕРЕННОЕ. Версия 1.1 — потому что посчитано,
        а не потому что придумано.
     ========================================================= */
  {
    id: "house-inherits-a-winter",
    title: "A house inherits someone else's winter",
    type: "Operations",
    stage: "Being tested",
    track: "Living House",
    origin: "Egregor Cloud",
    summary:
      "A house that has already learned how to heat itself can hand that policy to a new house. We measured whether it helps to choose which house it comes from. It does not. Across 8000 ordered pairs no similarity measure predicts the value of a transfer, and a perfect choice made with hindsight would be worth one per cent.",
    tags: ["inheritance", "control", "transfer", "measured", "negative result"],
    genome: [
      "Forty source houses, each having lived one winter and tuned its own heating policy",
      "Two hundred new houses, nineteen measured climates, thirty-two city-years",
      "Each new house loses half its heating capacity for 72 hours, in the coldest window of its own weather record",
      "Every source policy tried on every new house: the full 40 x 200 matrix, no sampling",
      "Two similarity measures tested: ten building parameters, and a resilience trait — indoor temperature after three days with the heating off at −10 °C"
    ],
    links: ["Does a trained controller transfer to another building?", "A house that regulates like skin: a ladder of responses, cheapest first", "A house body taken from the real stock"],
    sensors: [
      { id: "t-in",     what: "Indoor air temperature",  unit: "°C", rate: "15 minutes", where: "living space",                      why: "the comfort measure is built from it" },
      { id: "t-out",    what: "Outdoor air temperature", unit: "°C", rate: "hourly",     where: "the house's own record",            why: "the event is located by this record, not chosen" },
      { id: "power",    what: "Heat delivered",          unit: "kW", rate: "15 minutes", where: "at the heat pump",                  why: "capacity shortfall is visible only here" },
      { id: "capacity", what: "Capacity available",      unit: "kW", rate: "hourly",     where: "computed from outdoor temperature", why: "an air-source heat pump loses output exactly when it is needed" }
    ],
    metrics: [
      { id: "degree-h", name: "Degree-hours below 21 °C during the event", unit: "K·h", better: "lower" },
      { id: "kwh",      name: "Electricity over the season",               unit: "kWh", better: "lower" },
      { id: "concord",  name: "Agreement between sources across targets",  unit: "r",   better: "lower" }
    ],
    conditions: {
      climate: "Nineteen measured locations, Rome to Chicago, 32 city-years",
      size: "Single dwellings, 5 to 9 m by 6 to 10 m, one to three storeys",
      use: "Dwelling",
      occupancy: "Ten hours a day, starting hour varies by house",
      notes: "Evidence is simulated, not built. The bench is a reduced three-capacity model calibrated against BuilDa on eight buildings and checked on four held out in another city and month: 2 % on heat demand, 0.23 K on mean indoor temperature. No instance has been constructed, and instances stays empty until one is."
    },
    lineage: { parent: "control-transfer", version: "1.1", changed: [
      "The question is answered, not posed: no similarity measure predicts transfer value",
      "Inherited object is a control policy, not network weights",
      "Outcome is degree-hours and kilowatt-hours, not training steps",
      "A failure is introduced: heating capacity halved for 72 hours at the coldest window",
      "Adds the explanation the parent lacked: sources agree with each other at +0.94"
    ] },
    instances: [],
    thoughts: [
      "Of the benefit a transfer brings, 67 % is which house received it, 26 % is which house produced it, and 6 % is their combination. Only that 6 % is available to any similarity measure, and neither of ours found it.",
      "Enriching the inherited policy from five numbers to twenty-six raised the agreement between sources to +0.978. The richer the thing you inherit, the less there is to match.",
      "What replaces selection is trial: test a source on a population and keep the winner. In 200 random splits that finds the best available source exactly.",
      "The defect this result leaves behind is the reason the skin model exists: the reserve is paid for all winter and repaid in three days.",
      "Code, data and the full matrix: https://doi.org/10.5281/zenodo.23012010"
    ]
  }

];
