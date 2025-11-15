# TiLTNin - Tow Driver Tracking Demo

This repository contains a small demo web app that:
- Shows a QR code linking to a phone number (tel:+1 602-579-5145).
- Displays the tow driver's current location on a map and an estimated time of arrival (ETA).
- Provides a simple backend API to GET the driver's current location and to POST updates from the driver's device.

Quick start:
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm start
   ```

3. Open:
   - http://localhost:3000

How it works:
- The frontend polls `GET /api/driver` every 5 seconds to get the driver's latest lat/lng and ETA.
- Driver devices can POST live updates to `POST /api/driver/update` with body { lat, lng, eta_minutes }.
- To integrate with a real driver's telematics system or mobile app, have that system POST location updates to the update endpoint or change the frontend to call your external API.

Replace backend with your real service:
- Option A: Keep this frontend and point `public/app.js` to your real API host.
- Option B: Replace or extend `server.js` to proxy to your backend microservice.

Notes:
- The QR code encodes a tel: URI (tel:+16025795145). Scanning opens the phone dialer on devices that support tel URIs.
- For production, secure the location update endpoint (authentication / TLS) and consider push notifications or WebSockets for real-time updates instead of polling.

License: MIT