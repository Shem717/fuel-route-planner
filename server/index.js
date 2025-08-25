const express = require('express');
const app = express();

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;
const EIA_KEY = process.env.EIA_KEY;

app.get('/geocode', async (req, res) => {
  const { type, ...params } = req.query;
  const endpoint = type === 'autocomplete' ? 'autocomplete' : 'search';
  const url = new URL(`https://api.geoapify.com/v1/geocode/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set('apiKey', GEOAPIFY_KEY);
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Geocode error' });
  }
});

app.get('/route', async (req, res) => {
  const url = new URL('https://api.geoapify.com/v1/routing');
  for (const [k, v] of Object.entries(req.query)) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set('apiKey', GEOAPIFY_KEY);
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Route error' });
  }
});

app.get('/places', async (req, res) => {
  const url = new URL('https://api.geoapify.com/v2/places');
  for (const [k, v] of Object.entries(req.query)) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set('apiKey', GEOAPIFY_KEY);
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Places error' });
  }
});

app.get('/prices', async (req, res) => {
  const { area, product, series } = req.query;
  if (!area) {
    return res.status(400).json({ error: 'area required' });
  }
  const url = new URL(`https://api.eia.gov/v2/petroleum/pri/${series}/data/`);
  url.searchParams.set('api_key', EIA_KEY);
  url.searchParams.set('frequency', 'weekly');
  url.searchParams.set('data[0]', 'value');
  url.searchParams.set('facets[product][]', product);
  url.searchParams.set('facets[area][]', area);
  url.searchParams.set('sort[0][column]', 'period');
  url.searchParams.set('sort[0][direction]', 'desc');
  url.searchParams.set('offset', '0');
  url.searchParams.set('length', '1');
  try {
    const r = await fetch(url);
    const j = await r.json();
    const value = j?.response?.data?.[0]?.value ?? null;
    res.status(r.status).json({ value });
  } catch (e) {
    res.status(500).json({ error: 'Prices error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
