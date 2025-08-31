const express = require('express');
const { connectDB } = require('./db');
const { Favorite } = require('./models/Favorite');
const { RouteHistory } = require('./models/RouteHistory');

connectDB();

const app = express();
app.use(express.json());

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;
const GOOGLE_KEY = process.env.GOOGLE_KEY;
const EIA_KEY = process.env.EIA_KEY;

function decodePolyline(str) {
  let index = 0, lat = 0, lng = 0, coordinates = [];
  while (index < str.length) {
    let b, shift = 0, result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;
    coordinates.push([lng / 1e5, lat / 1e5]);
  }
  return coordinates;
}

// Proxy endpoints
app.get('/geocode', async (req, res) => {
  const { type, ...params } = req.query;
  const endpoint = type === 'autocomplete' ? 'autocomplete' : 'search';
  const url = new URL(`https://api.geoapify.com/v1/geocode/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('apiKey', GEOAPIFY_KEY);
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch {
    res.status(500).json({ error: 'Geocode error' });
  }
});

app.get('/route', async (req, res) => {
  const { provider = 'geoapify', startLon, startLat, endLon, endLat, hazmat } = req.query;
  try {
    if (provider === 'google') {
      const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
      url.searchParams.set('origin', `${startLat},${startLon}`);
      url.searchParams.set('destination', `${endLat},${endLon}`);
      url.searchParams.set('key', GOOGLE_KEY);
      const r = await fetch(url);
      if (!r.ok) return res.status(r.status).end();
      const j = await r.json();
      const poly = j.routes?.[0]?.overview_polyline?.points;
      if (!poly) return res.status(500).json({ error: 'No route' });
      const geometry = { type: 'LineString', coordinates: decodePolyline(poly) };
      return res.json({ geometry });
    } else {
      const url = new URL('https://api.geoapify.com/v1/routing');
      url.searchParams.set('waypoints', `${startLon},${startLat}|${endLon},${endLat}`);
      url.searchParams.set('mode', 'drive');
      url.searchParams.set('vehicle', 'truck');
      url.searchParams.set('truckHeight', '4.115');
      url.searchParams.set('truckWidth', '2.59');
      url.searchParams.set('truckLength', '22.86');
      url.searchParams.set('truckWeight', '36287');
      if (hazmat === 'true') url.searchParams.set('hazmat', 'true');
      url.searchParams.set('details', 'instruction_details');
      url.searchParams.set('apiKey', GEOAPIFY_KEY);
      const r = await fetch(url);
      if (!r.ok) return res.status(r.status).end();
      const j = await r.json();
      const geometry = j.features?.[0]?.geometry;
      if (!geometry) return res.status(500).json({ error: 'No route' });
      return res.json({ geometry });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/places', async (req, res) => {
  const { provider = 'geoapify' } = req.query;
  try {
    if (provider === 'google') {
      const { lat, lon, radius = '5000' } = req.query;
      const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
      url.searchParams.set('location', `${lat},${lon}`);
      url.searchParams.set('radius', radius);
      url.searchParams.set('keyword', 'truck stop');
      url.searchParams.set('type', 'gas_station');
      url.searchParams.set('key', GOOGLE_KEY);
      const r = await fetch(url);
      if (!r.ok) return res.status(r.status).end();
      const j = await r.json();
      return res.json(j);
    } else {
      const { minLon, minLat, maxLon, maxLat } = req.query;
      const url = new URL('https://api.geoapify.com/v2/places');
      url.searchParams.set('categories', 'service.vehicle.fuel,transport.truck_stop');
      url.searchParams.set('filter', `rect:${minLon},${minLat},${maxLon},${maxLat}`);
      url.searchParams.set('limit', '500');
      url.searchParams.set('apiKey', GEOAPIFY_KEY);
      const r = await fetch(url);
      if (!r.ok) return res.status(r.status).end();
      const j = await r.json();
      return res.json(j);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/prices', async (req, res) => {
  const { area, product, series } = req.query;
  if (!area) return res.status(400).json({ error: 'area required' });
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
    res.status(r.status).json({ value: j?.response?.data?.[0]?.value ?? null });
  } catch {
    res.status(500).json({ error: 'Prices error' });
  }
});

// Favorites CRUD
app.post('/favorites', async (req, res) => {
  try {
    const favorite = await Favorite.create(req.body);
    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/favorites', async (req, res) => {
  const favorites = await Favorite.find();
  res.json(favorites);
});

app.get('/favorites/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite) return res.status(404).json({ error: 'Not found' });
    res.json(favorite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/favorites/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!favorite) return res.status(404).json({ error: 'Not found' });
    res.json(favorite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/favorites/:id', async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route history CRUD
app.post('/route-history', async (req, res) => {
  try {
    const history = await RouteHistory.create(req.body);
    res.status(201).json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/route-history', async (req, res) => {
  const history = await RouteHistory.find();
  res.json(history);
});

app.get('/route-history/:id', async (req, res) => {
  try {
    const history = await RouteHistory.findById(req.params.id);
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/route-history/:id', async (req, res) => {
  try {
    const history = await RouteHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/route-history/:id', async (req, res) => {
  try {
    const history = await RouteHistory.findByIdAndDelete(req.params.id);
    if (!history) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
