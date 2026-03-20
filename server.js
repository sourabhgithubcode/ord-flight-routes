'use strict';
require('dotenv').config();

const express = require('express');
const axios   = require('axios');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;
const AERODATABOX_KEY = process.env.AERODATABOX_KEY;
const MAPBOX_TOKEN    = process.env.MAPBOX_TOKEN;

app.use(cors());
app.use(express.static(path.join(__dirname)));

// Static airport coordinates (IATA → [lat, lon])
const AIRPORT_COORDS = {
  ABE:[40.6521,-75.4408],ABQ:[35.0402,-106.6090],ACY:[39.4576,-74.5772],ADD:[8.9779,38.7993],
  ALB:[42.7483,-73.8017],ALO:[42.5571,-92.4003],AMM:[31.7226,35.9932],AMS:[52.3086,4.7639],
  ANC:[61.1744,-149.9961],ATL:[33.6407,-84.4277],ATW:[44.2581,-88.1196],AUA:[12.5014,-70.0152],
  AUH:[24.4330,54.6511],AUS:[30.1975,-97.6664],AVL:[35.4362,-82.5418],AVP:[41.3385,-75.7234],
  AZO:[42.2350,-85.5521],BCN:[41.2971,2.0785],BDL:[41.9389,-72.6832],BEG:[44.8184,20.3091],
  BFI:[47.5300,-122.3017],BHM:[33.5629,-86.7535],BIS:[46.7727,-100.7467],BMI:[40.4771,-88.9159],
  BNA:[36.1245,-86.6782],BOI:[43.5644,-116.2228],BOS:[42.3656,-71.0096],BRL:[40.7832,-91.1255],
  BRU:[50.9014,4.4844],BTV:[44.4720,-73.1533],BUF:[42.9405,-78.7322],BWI:[39.1754,-76.6682],
  BZE:[17.5391,-88.3082],BZN:[45.7775,-111.1528],CAE:[33.9389,-81.1195],CAK:[40.9161,-81.4422],
  CDG:[49.0097,2.5479],CGI:[37.2253,-89.5708],CHA:[35.0353,-85.2038],CHO:[38.1386,-78.4529],
  CHS:[32.8986,-80.0405],CID:[41.8847,-91.7108],CLE:[41.4117,-81.8498],CLT:[35.2140,-80.9431],
  CMH:[39.9980,-82.8919],CMI:[40.0399,-88.2781],CMX:[47.1684,-88.4891],COS:[38.8059,-104.7008],
  COU:[38.8181,-92.2196],CPH:[55.6181,12.6560],CRW:[38.3731,-81.5932],CUN:[21.0365,-86.8771],
  CVG:[39.0488,-84.6678],CWA:[44.7776,-89.6668],CZM:[20.5224,-86.9256],DAL:[32.8471,-96.8517],
  DAY:[39.9024,-84.2194],DBQ:[42.4020,-90.7095],DCA:[38.8512,-77.0402],DEC:[39.8346,-88.8657],
  DEN:[39.8561,-104.6737],DFW:[32.8998,-97.0403],DLH:[46.8421,-92.1936],DOH:[25.2731,51.6081],
  DSM:[41.5340,-93.6631],DTW:[42.2162,-83.3554],DUB:[53.4213,-6.2700],DXB:[25.2532,55.3657],
  ELP:[31.8072,-106.3779],EVV:[38.0369,-87.5324],EWR:[40.6895,-74.1745],EYW:[24.5561,-81.7596],
  FAR:[46.9207,-96.8158],FAT:[36.7762,-119.7182],FCA:[48.3105,-114.2560],FCO:[41.8003,12.2389],
  FLL:[26.0726,-80.1527],FNT:[42.9654,-83.7436],FOD:[42.5512,-94.1926],FRA:[50.0379,8.5622],
  FSD:[43.5820,-96.7419],FWA:[40.9785,-85.1951],GCM:[19.2928,-81.3577],GDL:[20.5218,-103.3111],
  GEG:[47.6199,-117.5339],GRB:[44.4851,-88.1296],GRR:[42.8808,-85.5228],GRU:[-23.4356,-46.4731],
  GSO:[36.0978,-79.9373],GSP:[34.8957,-82.2189],GUA:[14.5833,-90.5275],HKG:[22.3080,113.9185],
  HND:[35.5494,139.7798],HNL:[21.3245,-157.9251],HPN:[41.0670,-73.7076],HSV:[34.6372,-86.7751],
  IAD:[38.9531,-77.4565],IAH:[29.9902,-95.3368],ICN:[37.4602,126.4407],ICT:[37.6499,-97.4331],
  IND:[39.7173,-86.2944],IRK:[39.5385,-92.5449],IST:[41.2753,28.7519],JAX:[30.4941,-81.6879],
  JFK:[40.6413,-73.7781],JLN:[37.1518,-94.4983],JST:[40.3162,-78.8336],KEF:[63.9850,-22.6056],
  KIX:[34.4272,135.2440],LAN:[42.7787,-84.5874],LAS:[36.0840,-115.1537],LAX:[33.9425,-118.4081],
  LEX:[38.0365,-84.6059],LGA:[40.7772,-73.8726],LHR:[51.4775,-0.4614],LIR:[10.5933,-85.5444],
  LIT:[34.7294,-92.2243],LNK:[40.8510,-96.7592],LSE:[43.8790,-91.2567],MAD:[40.4936,-3.5668],
  MBJ:[18.5037,-77.9134],MBL:[44.2723,-86.2469],MBS:[43.5329,-84.0797],MCI:[39.2976,-94.7139],
  MCO:[28.4312,-81.3081],MCW:[43.1578,-93.3313],MDT:[40.1935,-76.7634],MEM:[35.0424,-89.9767],
  MEX:[19.4363,-99.0721],MGW:[39.6429,-80.0787],MHK:[39.1410,-96.6708],MIA:[25.7959,-80.2870],
  MKE:[42.9472,-87.8966],MKG:[43.1695,-86.2382],MKL:[35.5999,-88.9156],MLI:[41.4485,-90.5075],
  MQT:[46.5354,-87.5954],MSN:[43.1399,-89.3375],MSP:[44.8848,-93.2223],MSY:[29.9934,-90.2580],
  MTY:[25.7785,-100.1069],MUC:[48.3538,11.7861],MWA:[37.7550,-89.0112],MXP:[45.6306,8.7281],
  NAS:[25.0390,-77.4662],NGO:[34.8583,136.8050],NRT:[35.7653,140.3857],OGG:[20.8986,-156.4305],
  OKC:[35.3931,-97.6007],OMA:[41.3032,-95.8941],ONT:[34.0560,-117.6012],ORD:[41.9742,-87.9073],
  ORF:[36.8976,-76.0132],OWB:[37.7401,-87.1668],PBI:[26.6832,-80.0956],PDX:[45.5898,-122.5951],
  PHL:[39.8744,-75.2424],PHX:[33.4373,-112.0078],PIA:[40.6642,-89.6933],PIE:[27.9102,-82.6874],
  PIT:[40.4915,-80.2329],PLS:[21.7737,-72.2659],PNS:[30.4734,-87.1866],PSP:[33.8297,-116.5067],
  PTY:[9.0714,-79.3835],PUJ:[18.5674,-68.3634],PVD:[41.7243,-71.4281],PVG:[31.1434,121.8052],
  PVR:[20.6801,-105.2544],PWM:[43.6462,-70.3093],RAP:[44.0453,-103.0574],RDU:[35.8776,-78.7875],
  RIC:[37.5052,-77.3197],RNO:[39.4991,-119.7681],ROA:[37.3255,-79.9754],ROC:[43.1189,-77.6724],
  RST:[43.9083,-92.5001],RSW:[26.5362,-81.7552],SAN:[32.7336,-117.1897],SAT:[29.5337,-98.4698],
  SAV:[32.1276,-81.2021],SBN:[41.7087,-86.3173],SCE:[40.8493,-77.8487],SCL:[-33.3930,-70.7858],
  SDF:[38.1744,-85.7360],SEA:[47.4502,-122.3088],SFO:[37.6213,-122.3790],SGF:[37.2457,-93.3886],
  SJC:[37.3626,-121.9290],SJD:[23.1518,-109.7210],SJO:[9.9939,-84.2088],SJU:[18.4394,-66.0018],
  SLC:[40.7884,-111.9778],SLN:[38.7910,-97.6522],SMF:[38.6954,-121.5908],SNA:[33.6757,-117.8682],
  SPI:[39.8441,-89.6779],SRQ:[27.3954,-82.5544],STL:[38.7487,-90.3700],STR:[48.6900,9.2220],
  STT:[18.3373,-64.9733],SUN:[43.5044,-114.2958],SUX:[42.4026,-96.3844],SXM:[18.0410,-63.1089],
  SYR:[43.1112,-76.1063],TPA:[27.9755,-82.5332],TUL:[36.1984,-95.8881],TUS:[32.1161,-110.9410],
  TVC:[44.7414,-85.5822],TYS:[35.8110,-83.9940],UIN:[39.9427,-91.1946],UVF:[13.7332,-60.9526],
  VIE:[48.1103,16.5697],VPS:[30.4832,-86.5254],XNA:[36.2819,-94.3068],YOW:[45.3225,-75.6692],
  YQB:[46.7911,-71.3933],YUL:[45.4706,-73.7408],YVR:[49.1967,-123.1815],YWG:[49.9100,-97.2398],
  YYC:[51.1215,-114.0127],YYZ:[43.6777,-79.6248],ZRH:[47.4647,8.5492],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const pad = n => String(n).padStart(2, '0');

const AERO_PARAMS = {
  withLeg:'true', direction:'Both', withCancelled:'false',
  withCodeshared:'false', withCargo:'false', withPrivate:'false',
};

// Fetch one 12-hour window from AeroDataBox
async function fetchWindow(from, to) {
  const { data } = await axios.get(
    `https://aerodatabox.p.rapidapi.com/flights/airports/iata/ORD/${from}/${to}`,
    { headers: { 'X-RapidAPI-Key': AERODATABOX_KEY, 'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com' },
      params: AERO_PARAMS, timeout: 15000 }
  );
  return data;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Fetch full 24-hour day (two 12-hour windows, sequential with delay)
async function fetchDay(date) {
  console.log(`  ↓ Fetching 24h: ${date}`);
  const am = await fetchWindow(`${date}T00:00`, `${date}T11:59`);
  await sleep(1500);
  const pm = await fetchWindow(`${date}T12:00`, `${date}T23:59`);

  const dedupe = flights => {
    const seen = new Set();
    return (flights || []).filter(f => {
      const key = f.number || `${f.departure?.airport?.iata}-${f.arrival?.airport?.iata}-${f.departure?.scheduledTime?.local}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  };

  return {
    arrivals:   dedupe([...(am.arrivals  ||[]), ...(pm.arrivals  ||[])]),
    departures: dedupe([...(am.departures||[]), ...(pm.departures||[])]),
  };
}

// Normalize raw AeroDataBox flight → clean object, enriched with coords
function normalize(flights, side, date) {
  return (flights || [])
    .filter(f => {
      const apt = side === 'arr' ? f.departure?.airport : f.arrival?.airport;
      return apt?.iata && AIRPORT_COORDS[apt.iata];
    })
    .map(f => {
      const apt = side === 'arr' ? f.departure.airport : f.arrival.airport;
      const [lat, lon] = AIRPORT_COORDS[apt.iata];
      return {
        code:    apt.iata,
        name:    apt.name || apt.iata,
        lat, lon,
        country: apt.countryCode || '',
        intl:    apt.countryCode !== 'us' && apt.countryCode !== 'US',
        airline: f.airline?.name || '',
        flight:  f.number || '',
        date,
      };
    });
}

// Confidence: coefficient of variation across daily totals → 0-100 score
function calcConfidence(dailyTotals) {
  const counts = Object.values(dailyTotals).map(d => d.arr + d.dep);
  if (counts.length < 2) return 70;
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
  const variance = counts.reduce((s, v) => s + (v - mean) ** 2, 0) / counts.length;
  const cv = mean > 0 ? (Math.sqrt(variance) / mean) * 100 : 50;
  return Math.round(Math.min(97, Math.max(50, 100 - cv * 2.5)));
}

// ── In-memory cache ───────────────────────────────────────────────────────────
const cache = new Map();

// ── Token endpoint ────────────────────────────────────────────────────────────
app.get('/api/config', (_req, res) => {
  res.json({ mapboxToken: MAPBOX_TOKEN });
});

// ── Main flight data endpoint — 3 sample days × 24h ──────────────────────────
// Sample days: 5th, 15th, 25th of each month (covers weekday variety)
app.get('/api/flights/:month', async (req, res) => {
  const month = parseInt(req.params.month, 10);
  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Month must be 1–12' });
  }
  if (cache.has(month)) {
    console.log(`Cache hit — month ${month}`);
    return res.json(cache.get(month));
  }

  const sampleDays = [5, 15, 25].map(d => `2025-${pad(month)}-${pad(d)}`);
  const allArrivals = [], allDepartures = [];
  const dailyTotals = {};

  try {
    // Fetch each sample day sequentially with delay between days
    for (const date of sampleDays) {
      const day = await fetchDay(date);
      await sleep(1500);
      const arr = normalize(day.arrivals,   'arr', date);
      const dep = normalize(day.departures, 'dep', date);
      allArrivals.push(...arr);
      allDepartures.push(...dep);
      dailyTotals[date] = { arr: arr.length, dep: dep.length };
      console.log(`    ${date}: arr=${arr.length} dep=${dep.length}`);
    }

    const confidence = calcConfidence(dailyTotals);
    const result = {
      arrivals:    allArrivals,
      departures:  allDepartures,
      sampleDays,
      dailyTotals,
      coverage:    '72h across 3 sample days (5th, 15th, 25th) × 24h each',
      confidence,
    };

    console.log(`✓ Month ${month}: ${allArrivals.length} arr, ${allDepartures.length} dep | confidence=${confidence}%`);
    cache.set(month, result);
    res.json(result);
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error(`✗ Month ${month}:`, detail);
    res.status(500).json({ error: String(err.message), detail });
  }
});

// ── BTS cross-validation endpoint (data.transportation.gov) ──────────────────
// Dataset xgub-n9bw = International Report Passengers (ORD intl routes, official)
const btsCache = new Map();

app.get('/api/bts/:month', async (req, res) => {
  const month = parseInt(req.params.month, 10);
  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Month must be 1–12' });
  }
  if (btsCache.has(month)) return res.json(btsCache.get(month));

  try {
    const { data } = await axios.get(
      'https://data.transportation.gov/resource/xgub-n9bw.json',
      {
        params: {
          usg_apt: 'ORD',
          year:    '2025',
          month:   String(month),
          $limit:  '2000',
          $select: 'fg_apt,carrier,type,total,scheduled,charter',
        },
        headers: { Accept: 'application/json' },
        timeout: 12000,
      }
    );

    if (!data.length) {
      return res.json({ available: false, reason: 'BTS data not yet published for this month' });
    }

    // Aggregate by airport and carrier
    const byAirport = {}, byCarrier = {};
    let totalPax = 0, scheduledPax = 0;

    data.forEach(r => {
      const t = parseInt(r.total || '0');
      const s = parseInt(r.scheduled || '0');
      totalPax    += t;
      scheduledPax += s;
      byAirport[r.fg_apt]  = (byAirport[r.fg_apt]  || 0) + t;
      byCarrier[r.carrier] = (byCarrier[r.carrier]  || 0) + t;
    });

    const result = {
      available:       true,
      source:          'BTS International Report Passengers (data.transportation.gov)',
      month, year:     2025,
      totalPassengers: totalPax,
      scheduledPax,
      charterPax:      totalPax - scheduledPax,
      topAirports:     Object.entries(byAirport).sort((a,b)=>b[1]-a[1]).slice(0,12),
      topCarriers:     Object.entries(byCarrier).sort((a,b)=>b[1]-a[1]).slice(0,10),
      routeCount:      Object.keys(byAirport).length,
      note:            'International passengers only. BTS typically lags 3–6 months.',
    };

    console.log(`✓ BTS month ${month}: ${totalPax.toLocaleString()} intl passengers, ${result.routeCount} routes`);
    btsCache.set(month, result);
    res.json(result);
  } catch (err) {
    console.error('BTS fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n✈  ORD Flight Simulator → http://localhost:${PORT}`);
  console.log(`   AeroDataBox : ${AERODATABOX_KEY ? '✓' : '✗ missing'}`);
  console.log(`   Mapbox      : ${MAPBOX_TOKEN    ? '✓' : '✗ missing'}`);
  console.log(`   BTS API     : data.transportation.gov/resource/xgub-n9bw\n`);
});
