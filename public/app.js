// Frontend logic: render QR code, init map, poll backend for driver location + ETA

const PHONE_URI = 'tel:+16025795145'; // tel: URI without punctuation
const API_DRIVER_URL = '/api/driver';  // change this to point at your real API if needed
const POLL_MS = 5000;

document.addEventListener('DOMContentLoaded', () => {
  // QR Code
  new QRCode(document.getElementById('qrcode'), {
    text: PHONE_URI,
    width: 200,
    height: 200
  });
  const phoneLink = document.getElementById('phone-link');
  phoneLink.href = PHONE_URI;

  // Map init
  const map = L.map('map').setView([33.448376, -112.074036], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const marker = L.marker([33.448376, -112.074036]).addTo(map).bindPopup('Tow driver');

  const etaEl = document.getElementById('eta');
  const updatedEl = document.getElementById('updated');

  async function fetchDriver() {
    try {
      const res = await fetch(API_DRIVER_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
        const lat = data.lat;
        const lng = data.lng;
        marker.setLatLng([lat, lng]);
        marker.bindPopup(`Tow driver (ETA: ${data.eta_minutes} min)`).openPopup();
        map.panTo([lat, lng]);
        etaEl.textContent = `${data.eta_minutes} min`;
        updatedEl.textContent = `Last update: ${new Date(data.updated_at).toLocaleString()}`;
      } else {
        etaEl.textContent = 'No driver data';
      }
    } catch (err) {
      console.error('Error fetching driver:', err);
      updatedEl.textContent = 'Error fetching driver data';
    }
  }

  // initial fetch
  fetchDriver();

  // poll periodically
  setInterval(fetchDriver, POLL_MS);
});
