const express = require('express');
const { connectDB } = require('./db');
const { Favorite } = require('./models/Favorite');
const { RouteHistory } = require('./models/RouteHistory');

connectDB();

const app = express();
app.use(express.json());

// Placeholder endpoints
app.get('/geocode', (req, res) => {
  res.json({ message: 'Geocode endpoint' });
});

app.get('/route', (req, res) => {
  res.json({ message: 'Route endpoint' });
});

app.get('/places', (req, res) => {
  res.json({ message: 'Places endpoint' });
});

app.get('/prices', (req, res) => {
  res.json({ message: 'Prices endpoint' });
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
