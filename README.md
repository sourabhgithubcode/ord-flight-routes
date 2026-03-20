# ORD Flight Routes — Chicago O'Hare 2025

Real-time flight route visualization for Chicago O'Hare (ORD) using live AeroDataBox data on an interactive Mapbox globe.

![Arrivals and departures rendered as colored arcs on a dark globe map]

## What it shows

- **Teal arcs** — arrivals into ORD
- **Pink arcs** — departures from ORD
- Arc thickness scaled by flight frequency
- Hover any airport for airline breakdown and flight counts
- Filter by month, route type (domestic / international), and airline
- Color arcs by airline brand

## Stack

| Layer | Tech |
|---|---|
| Map | Mapbox GL JS v3 (globe projection) |
| Flight data | AeroDataBox via RapidAPI |
| Backend | Node.js + Express |
| Auth | Tokens served from backend — never exposed in frontend |

## Setup

### 1. Clone

```bash
git clone https://github.com/sourabhgithubcode/ord-flight-routes.git
cd ord-flight-routes
npm install
```

### 2. Environment

Create a `.env` file:

```
AERODATABOX_KEY=your_rapidapi_key
MAPBOX_TOKEN=pk.your_mapbox_public_token
PORT=3001
```

- **AeroDataBox** — get a free key at [rapidapi.com](https://rapidapi.com/aedbx-aedbx/api/aerodatabox)
- **Mapbox** — get a free public token at [mapbox.com](https://mapbox.com) (must start with `pk.`)

### 3. Run

```bash
node server.js
```

Open `http://localhost:3001/ord-simulation.html`

## Data notes

- Data is fetched for the **15th of each month, 06:00–17:59 local time**
- Only **commercial passenger flights** — cargo, private, and cancelled excluded
- Codeshares de-duplicated (operating carrier only)
- Months available: **April – December 2025** (Jan–Mar exceed AeroDataBox's 365-day window)
- Results cached in memory per session

## Files

```
server.js            — Express backend, AeroDataBox proxy, token delivery
ord-simulation.html  — Main visualization (Mapbox globe + airline filters)
index.html           — US airport operations canvas simulation
.env                 — API keys (not committed)
```
