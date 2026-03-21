# ORD Flight Routes — United vs American at Chicago O'Hare

**Where do UA and AA compete, avoid each other, and price differently out of ORD?**

Interactive globe map of every flight route at Chicago O'Hare (2025), with fare intelligence and side-by-side airline comparison.

---

## What it does

- **UA vs AA comparison** — isolate either airline or run side-by-side to see where networks overlap and diverge
- **Fare Intelligence** — routes colored by competition level (contested / partial / monopoly) with estimated fares and savings
- **Live flight data** — real AeroDataBox schedules, sampled 3 days/month and averaged to a per-day figure
- **Month range picker** — select any window from Apr–Dec 2025
- **Filters** — route type (domestic / international), time of day, view level (airport / state / region)
- **Insights panel** — top routes, top airlines, monthly trend, BTS cross-validation

## Stack

| Layer | Tech |
|---|---|
| Map | Mapbox GL JS v3 (globe projection) |
| Flight data | AeroDataBox via RapidAPI |
| Backend | Node.js + Express |
| Tokens | Served from backend — never exposed in frontend |

## Setup

```bash
git clone https://github.com/sourabhgithubcode/ord-flight-routes.git
cd ord-flight-routes
npm install
```

Create `.env`:

```
AERODATABOX_KEY=your_rapidapi_key
MAPBOX_TOKEN=pk.your_mapbox_public_token
PORT=3001
```

```bash
node server.js
```

Open `http://localhost:3001/ord-simulation.html`

## Data notes

- Sampled from the 5th, 15th, and 25th of each month — KPIs shown as per-day averages
- Commercial passenger flights only — cargo, private, and cancelled excluded
- Codeshares de-duplicated (operating carrier only)
- Months available: **April – December 2025**
- Flight data cached to disk — survives server restarts
