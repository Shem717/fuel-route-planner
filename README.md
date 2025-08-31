# Fuel-Route Planner

A self-contained web app for planning semi-truck fuel routes with:
- **Truck-aware routing** (Geoapify Routing API)
- **Fuel stop discovery** (Geoapify Places API)
- **Diesel price estimates** from the **U.S. Energy Information Administration (EIA)**
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
- **Favorites & History**: Backend stores last ten routes and allows marking favorites.

## Requirements
- A modern web browser (Chrome, Edge, Firefox, Safari).
- No build tools or external JS required — **single HTML file**.
- Internet connection (to call Geoapify + EIA APIs).
- Node.js runtime for the optional backend that saves favorites/history.

## Usage
1. `npm install` and `npm start` to launch the backend server (serves `index.html`).
2. Open `http://localhost:3000` in your browser.
3. Enter **Start** and **Destination**.
4. Fill in vehicle parameters.
5. Click **Plan Route**.
6. Review station list, route history and favorites.

Click **Reset** to clear inputs.

## APIs used
- [Geoapify Geocoding API](https://apidocs.geoapify.com/) — Address lookup & autocomplete.
- [Geoapify Routing API](https://apidocs.geoapify.com/) — Truck-aware routing.
- [Geoapify Places API](https://apidocs.geoapify.com/) — Truck stops & fuel stations.
- [EIA v2 Petroleum Prices API](https://www.eia.gov/opendata/) — Diesel price estimates.

## Development
- All code lives in `fuel-route-planner.html`.
- Keys are currently **hard-coded** for convenience (replace `GEOAPIFY_KEY` and `EIA_KEY` in `<script>` for your own).
- Fork, edit, and open a Pull Request to contribute.

## Deployment
- Works as a local file.
- Can be hosted anywhere static files are supported.
- **GitHub Pages**: Enable Pages in repo settings and serve `fuel-route-planner.html` from root.

## License
MIT License — free to use, modify, and distribute.
