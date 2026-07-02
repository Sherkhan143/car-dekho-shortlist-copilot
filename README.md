# Car Shortlist Copilot

A lightweight full-stack MVP that helps a confused car buyer go from **“I don’t know what to buy”** to **“I have a confident shortlist.”**

## Live Demo

<!-- * **Live App:** `https://your-live-url.com` -->
* **Screen Recording:** `https://youtu.be/_QncU_ybRdw`
* **GitHub Repo:** `https://github.com/Sherkhan143/car-dekho-shortlist-copilot.git`

---

## What I built and why

I built **Car Shortlist Copilot** — a web app that asks a buyer for a few key preferences and returns a ranked shortlist of cars with **match scores, reasons, and tradeoffs**.

The core problem in the brief, as I interpreted it, was not “show a lot of cars” — it was **reduce buyer confusion**. A buyer who is overwhelmed by too many options does not need a giant marketplace clone in the first 3 hours. They need a fast way to answer:

* Which cars fit my budget and use case?
* What are the top 3–5 options I should seriously consider?
* Why were these cars recommended?
* What tradeoffs am I making with each option?

So instead of building a generic listing/filtering app, I focused on the **decision-making moment** and built a recommendation flow:

1. The user enters their preferences:

   * budget
   * preferred body type
   * fuel type
   * transmission
   * use case (city / family / highway, etc.)
   * weighted priorities such as safety, mileage, features, maintenance, performance

2. The backend scores cars using a simple weighted recommendation engine.

3. The frontend shows a ranked shortlist with:

   * fit score
   * key specs
   * why each car was recommended
   * tradeoffs / limitations
   * ability to save cars to a shortlist

4. The shortlist is persisted so the user can revisit saved recommendations later.

I deliberately chose this scope because it felt like the **highest-value interpretation of the brief within 2–3 hours**.

---

## What I deliberately cut

I intentionally did **not** try to build a full car marketplace. I cut several things on purpose to stay focused on the core user problem and the time-box.

### Things I deliberately cut

* **Authentication / sign-up / login**

  * I used a **guest shortlist** model instead. Each user gets a locally generated guest/session ID, and saved recommendations are tied to that ID.
  * This preserved persistence without spending a large chunk of the time-box on auth flows.

* **Massive filtering / browsing UI**

  * I did not build a CarDekho-style inventory browser with dozens of filters and deep navigation.
  * The goal was shortlist generation, not endless browsing.

* **Live data ingestion / scraping / third-party APIs**

  * I used a curated seed dataset instead of integrating with a live automotive data source.
  * For the time-box, recommendation quality and end-to-end flow mattered more than perfect data freshness.

* **LLM chat assistant**

  * I considered a conversational “help me choose a car” interface, but skipped it because the deterministic recommendation flow was the fastest way to deliver a working, useful product.

* **Advanced review analysis / sentiment / personalization**

  * User reviews are present in the dataset conceptually, but I did not build a full review summarization or sentiment pipeline in this version.

* **Production-grade polish**

  * No admin tooling, no advanced caching, no exhaustive tests, no design system-level UI polish.

The tradeoff I made was very intentional: **I optimized for a clear, working buyer decision flow over breadth.**

---

## Tech stack and why I picked it

### Frontend

* **React + TypeScript**

  * Fast to build with, easy to structure, and good for a dynamic form/results flow.
* **Vite**

  * Minimal setup and fast iteration in a time-boxed assignment.
* **CSS / utility-first styling (depending on your implementation)**

  * Enough to create a clean interface without spending time on design infrastructure.

### Backend

* **Node.js + Express + TypeScript**

  * Quick to ship, flexible for custom scoring logic, and easy to structure as a small recommendation API.
* **MongoDB**

  * Used for persistence of seeded car data and saved shortlists.
  * Simple fit for a lightweight full-stack MVP.

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

I chose this stack because I wanted the fastest path to a deployed, working full-stack app without spending the assignment on infrastructure.

---

## How the recommendation system works

The recommendation engine is intentionally simple and deterministic.

The user provides:

* budget range
* preferred body type
* fuel type
* transmission
* use cases (e.g. city, family, highway)
* weighted priorities like safety, mileage, features, maintenance, performance

Each car in the dataset has normalized attributes / scores such as:

* price
* body type
* fuel type
* mileage
* safety rating / safety score
* maintenance score
* feature score
* performance score
* use-case fit scores

The backend computes a **match score** by combining:

* hard filters / preference matches
* weighted scores for the priorities selected by the user
* use-case fit (e.g. family-friendly, city-friendly, highway-friendly)
* budget fit

The top results are then returned along with a short explanation layer:

* **Why this car was recommended**
* **What tradeoffs it has**

That explanation layer is important because a shortlist without reasoning is just a ranked list, not a decision tool.

---

## Data model / persistence choices

I used a **guest shortlist** approach rather than authentication.

### Why

Authentication would have added significant overhead for a 2–3 hour build:

* signup/login UI
* protected routes
* user session management
* validation / edge cases

Instead, on first visit the app generates a local guest/session ID and uses that to persist the user’s shortlist in the backend. This allowed me to keep **saved recommendations** as part of the product experience without spending the assignment on auth.

This felt like the right tradeoff for an MVP focused on the core recommendation problem.

---

## What I delegated to AI tools vs. what I did manually

I used AI tools heavily, but not as a “build everything blindly” shortcut. I used them mainly as accelerators for scaffolding, iteration, and generating first drafts of code or data structures.

### Things I delegated to AI tools

* generating an initial seed dataset shape for cars
* scaffolding backend route and model boilerplate
* drafting the first version of the recommendation scoring function
* generating repetitive UI component scaffolding
* suggesting README structure and project framing
* helping refactor repeated code / interfaces

### Things I did manually

* deciding the **actual product scope**
* choosing to build a shortlist recommender instead of a marketplace clone
* simplifying the recommendation logic so it stayed deterministic and explainable
* cleaning up inconsistent generated data / code
* shaping the response structure for “reasons” and “tradeoffs”
* wiring the full flow end-to-end and making sure the app actually worked as a product

In other words, AI helped me move faster, but the key decisions around **what to build, what to cut, and how to keep it coherent** were manual.

---

## Where the AI tools helped most

The biggest value came from using AI as a **speed multiplier for boilerplate and iteration**.

### Most useful areas

1. **Boilerplate generation**

   * quick model / route / component scaffolding
   * TypeScript interface drafts
   * API response shape suggestions

2. **Recommendation engine draft**

   * generating a first-pass weighted scoring function that I could then simplify and tune

3. **Seed data structure**

   * quickly creating a consistent starting shape for a car dataset so I could focus on the product flow

4. **UI scaffolding**

   * speeding up the initial form/results layout instead of building every component from scratch

5. **Documentation and explanation support**

   * helping structure README content and articulate tradeoffs clearly

---

## Where the AI tools got in the way

AI was useful, but it also created friction in predictable places.

### Main issues

1. **Overengineering**

   * some generated solutions were more complex than the assignment needed
   * I had to simplify code to stay aligned with the 2–3 hour time-box

2. **Inconsistent data assumptions**

   * generated sample datasets can look realistic at a glance but still contain inconsistent fields or values
   * I had to normalize the shape and keep the data model simple

3. **Generic UI output**

   * some generated UI code was technically functional but not opinionated enough for the actual user flow I wanted

4. **Recommendation logic drift**

   * AI tends to produce a “smart sounding” scoring function quickly, but it still needs human judgment to keep it explainable and aligned to the product goal

The main lesson for me was: **AI is excellent at accelerating implementation, but still needs a human to constrain scope and keep the product coherent.**

---

## If I had another 4 hours, what I would add

If I had another 4 hours, I would focus on making the app more useful as a real car research assistant rather than just expanding surface area.

### 1) Better recommendation explanations

I would improve the reasoning layer so the app can explain:

* why one car ranks above another
* which tradeoffs matter most for the user’s stated priorities
* “best all-rounder” vs “best safety pick” vs “best value pick”

### 2) Conversational preference capture

Instead of a static form, I’d add a lightweight conversational assistant that can ask follow-up questions like:

* “Will you mostly drive in the city or on highways?”
* “Do you care more about safety or maintenance cost?”
* “Do you need rear-seat comfort for family use?”

### 3) Richer compare view

I would add a dedicated compare screen for the shortlisted cars with:

* side-by-side specs
* score breakdown by category
* recommendation rationale per category

### 4) More realistic data enrichment

I would improve the dataset by adding:

* richer variant-level details
* better safety / mileage / maintenance normalization
* review snippets and ownership-cost signals

### 5) Shareable shortlist

I’d add a shareable shortlist link so a user could send their saved recommendations to a family member or friend before making a purchase decision.

### 6) Better persistence / accounts

If this were moving beyond MVP, I would replace guest shortlist storage with authenticated accounts and cross-device shortlist sync.

---

## Run instructions

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Environment variables

#### Frontend

Create a `.env` file in `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

#### Backend

Create a `.env` file in `server/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

---

## Product summary

If I had to summarize the project in one sentence:

> **I’m not building a marketplace — I’m building a shortlist recommender, because in a 2–3 hour window that felt like the highest-value way to help a confused buyer make progress.**
