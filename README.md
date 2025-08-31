diff --git a/README.md b/README.md
index 9cccd9cfbc8fe123b920db9ebb9c0de96dab8a22..133a5baf6874a437f1df14da74c803ed197c5d52 100644
--- a/README.md
+++ b/README.md
@@ -1,50 +1,56 @@
 # Fuel-Route Planner
 
 A self-contained web app for planning semi-truck fuel routes with:
-- **Truck-aware routing** (Geoapify Routing API)
-- **Fuel stop discovery** (Geoapify Places API)
+- **Truck-aware routing** (Geoapify or Google Directions API)
+- **Fuel stop discovery** (Geoapify Places or Google Places API)
 - **Diesel price estimates** from the **U.S. Energy Information Administration (EIA)**
+- **Route visualization** on an embedded Google Map
 - **AI-based recommendations** that adjust for weight, terrain, governed speed, wind, and reserve buffer.
 
 ## Features
 - Input **Start** and **Destination** addresses (exact addresses or city names).
 - Configure vehicle parameters: MPG, tank size, current fuel (gal or %), reserve miles, gross weight, terrain, governed speed, wind, and driver cost.
 - **Hazmat routing toggle** (hazmat-safe pathing where supported).
 - **Station filtering** by major chains (Pilot, Flying J, Love’s, TA, Petro, etc.) vs independents.
 - **Sort results** by route order, distance from start, or diesel price.
 - **EIA integration**: Attaches state-average diesel prices (fallback to PADD or U.S. national average).
 - **AI Recommendation**: Suggests optimal stops, gallons to purchase, and estimated cost savings.
 - Loading spinner overlay while planning route.
+- Switchable **API provider** (Geoapify or Google)
 
 ## Requirements
 - A modern web browser (Chrome, Edge, Firefox, Safari).
 - No build tools or external JS required — **single HTML file**.
-- Internet connection (to call Geoapify + EIA APIs).
+- Internet connection (Geoapify or Google APIs + EIA).
+- Node.js (optional, for Google API proxy in `server.js`).
 
 ## Usage
-1. Open `fuel-route-planner.html` in your browser.
-2. Enter **Start** and **Destination**.
-3. Fill in vehicle parameters.
-4. Click **Plan Route**.
-5. Review station list + AI recommendations.
+1. Start the optional backend for Google support: `GOOGLE_MAPS_API_KEY=... node server.js`.
+2. Open `index.html` in your browser.
+3. Choose **Geoapify** or **Google** from the API selector.
+4. Enter **Start** and **Destination**.
+5. Fill in vehicle parameters.
+6. Click **Plan Route**.
+7. Review station list + AI recommendations.
 
 Click **Reset** to clear inputs.
 
 ## APIs used
 - [Geoapify Geocoding API](https://apidocs.geoapify.com/) — Address lookup & autocomplete.
 - [Geoapify Routing API](https://apidocs.geoapify.com/) — Truck-aware routing.
 - [Geoapify Places API](https://apidocs.geoapify.com/) — Truck stops & fuel stations.
+- [Google Maps Platform](https://developers.google.com/maps) — Directions & Places (via backend).
 - [EIA v2 Petroleum Prices API](https://www.eia.gov/opendata/) — Diesel price estimates.
 
 ## Development
-- All code lives in `fuel-route-planner.html`.
-- Keys are currently **hard-coded** for convenience (replace `GEOAPIFY_KEY` and `EIA_KEY` in `<script>` for your own).
+- Frontend code lives in `index.html`; optional Node proxy server in `server.js`.
+- Keys are currently **hard-coded** for convenience (replace `GEOAPIFY_KEY`, `GOOGLE_MAPS_KEY` and `EIA_KEY` in `<script>`/env vars for your own).
 - Fork, edit, and open a Pull Request to contribute.
 
 ## Deployment
 - Works as a local file.
 - Can be hosted anywhere static files are supported.
-- **GitHub Pages**: Enable Pages in repo settings and serve `fuel-route-planner.html` from root.
+- **GitHub Pages**: Enable Pages in repo settings and serve `index.html` from root.
 
 ## License
 MIT License — free to use, modify, and distribute.
