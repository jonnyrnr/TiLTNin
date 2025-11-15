const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory driver state (for demo). Replace by real DB or external API.
let driverState = {
  id: 'driver-1',
  lat: 33.448376,    // Phoenix default sample location
  lng: -112.074036,
  eta_minutes: 12,
  updated_at: new Date().toISOString()
};

// Get current driver info
app.get('/api/driver', (req, res) => {
  res.json(driverState);
});

// Update driver location & ETA (driver mobile app or management system can POST here)
app.post('/api/driver/update', (req, res) => {
  const { id, lat, lng, eta_minutes } = req.body;
  if (typeof lat === 'number' && typeof lng === 'number') {
    driverState.id = id || driverState.id;
    driverState.lat = lat;
    driverState.lng = lng;
    driverState.eta_minutes = typeof eta_minutes === 'number' ? eta_minutes : driverState.eta_minutes;
    driverState.updated_at = new Date().toISOString();
    return res.json({ ok: true, driverState });
  }
  return res.status(400).json({ ok: false, message: 'Invalid payload. Expect { lat: number, lng: number, eta_minutes?: number }' });
});

// serve index.html for all other routes (optional SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
