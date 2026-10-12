# How a model is built

Draft. A walk through the fields of `model-template.js`.
Russian copy: `MODELS.ru.md`.

---

## The main idea

A model is **not a description of an idea**. It is a contract with whoever
takes it:

```
what to build         ->  genome
by what rule          ->  rules         new 12.10
where it was tested   ->  applies       new 12.10
what was not measured ->  blindspots    new 12.10
what to measure       ->  sensors
what counts as success->  metrics
who sets the weights  ->  weighting     new 12.10
under what conditions ->  conditions
where it came from    ->  lineage
what came back        ->  instances
```

Only the first line used to exist. With no sensor contract nothing returns
from a building, and no gene pool accumulates.

---

## The older fields

### sensors — what to measure

The most important part. Without a list of sensors a person builds from the
model and sends nothing back: they do not know what to measure or where to
put it.

Each sensor has five fields, and `why` is not decoration. A sensor whose
purpose nobody wrote down is the first thing removed when money gets tight.

### metrics — what counts as success

Otherwise there is nothing to compare and nothing to inherit. Two buildings
from one model — which is better? Without a metric there is no answer.

`better` says which direction is good: lower or higher.

### conditions — under what conditions

**Experience without conditions is harmful.** A schedule that saved heat in
Rehovot can freeze a building in St Petersburg.

### lineage — where it came from

This is where inheritance lives:

```
parent    id of the parent model
version   1.0 -> 1.1 -> 2.0
changed   what exactly changed against the parent
```

A model with no parent is first in its line. A model with a parent and a list
of changes is a descendant. A tree is built from that later.

### instances — what came back from the objects

Filled in during operation. This is the accumulated corpus.

`surprise` matters more than everything else: **expectations that came true
teach nothing.** Only what went differently teaches.

---

# Revision, 12 October 2026

Four fields were added — not from general reasoning, but after experiments on
the thermal bench: 40 donors, 200 receivers, 21 climates from Stockholm to
Beer Sheva. Code and numbers: `doi:10.5281/zenodo.23012010`. A worked example
of the new fields is `EGREGOR_MODEL_ENVELOPE` at the end of
`model-template.js`.

## rules — a gene is a rule, not a number

We tried inheriting a finished body: take a donor dwelling and build the
receiver from its drawing. Result:

```
give an Israeli dwelling the Swedish body     +70 % of hours outside the norm
give a Swedish dwelling the Israeli body      +34 %
```

Copying is out. The body that is best for Sweden — thick walls — collects heat
through an Israeli day and will not release it at night.

So what sits in the cloud is not a set of numbers but a rule: **under such a
climate, such walls**. From one rule a different body grows in Stockholm and
in Beer Sheva. The body is built anew on site.

The `kind` field splits what is inherited into two:

```
body     built once: walls, windows, mass
distro   changes daily: shutters, ventilation, setpoints
```

The split is not cosmetic. Sweden has no summer lever; in winter the body
decides. Israel barely needs the body in winter; in summer the daily routine
decides — shutters closed by day, open at night. **What to inherit depends on
the climate.**

## applies — a rule has a reach, and the reach is measurable

Conditions used to be written in words: "hot dry". Now a number stands beside
them — the interaction share. It says how much of the outcome depends on the
*pair* of rule and receiver, rather than on the rule alone.

```
inside a uniform Europe              6 %     nothing to match
between Israel and Sweden           39 %     matching decides
```

The rule of thumb: **below 10 % one rule fits everyone; above 30 % the rule is
addressed, and the wrong address is expensive.** It is computed from a single
matrix of runs, before any matching method is built.

`not_tested` matters separately. A rule without stated limits travels further
than it was checked, and does damage there.

## blindspots — what was not measured

Every rule quietly carries an assumption: that the processes nobody named
behaved the same way at both ends. Here that assumption is said out loud.

Our own case. The bench has no shutters. In Israel they are closed every day
on every window. So our summer numbers are overstated, and the pair
"window share x air change rate", which came out strongest, works differently
in real life.

Admitting the gap is part of the model, not an appendix to it. Whoever takes
the rule must see what is missing from it.

## weighting — the weights come from outside

The least familiar part. Ordinary systems bake the criterion in: "minimise
consumption". Cloud DNA cannot.

The same body is best in Stockholm and worst in Tel Aviv. Not because the
bodies differ, but because the weight of summer is 0.02 there and 0.70 here.

So `metrics` lists what to measure and **carries no weights**. Whoever takes
the model fills those in:

```
by_place    computed automatically from the weather record of the site
by_owner    declared by the owner: horizon, the price of discomfort,
            the view from the window, how the facade should look
```

Taste, aesthetics and a plain personal preference enter `by_owner` on the same
footing as climate. The model does not judge them and does not argue with
them. It takes them as input and returns a different answer.

This is what separates a store of inheritable things from an optimiser. An
optimiser knows what "better" means. Cloud DNA does not, and must not.

## What follows for `instances`

Two fields added:

```
weights   which weights were used on this object
outside   how its conditions fell outside applies.tested_on
```

The second is the most valuable field after `surprise`. An object beyond the
tested range teaches more than ten inside it.

---

## What still does not exist

- the fields are filled for one model only, `heat-where-it-goes`
- there is no page showing the version tree
- `supabase.config.js` is broken
- **the portal does not compute the interaction share itself**: the number
  comes from an experiment and is typed in by hand. To compute it the portal
  needs to run the rule against a population — that is, a bench inside the
  portal
