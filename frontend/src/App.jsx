import RouteForm from './components/RouteForm.jsx';
import FuelStops from './components/FuelStops.jsx';
import Summary from './components/Summary.jsx';

function App() {
  return (
    <div className="wrap">
      <header className="card">
        <h1>Fuel‑Route Planner</h1>
        <div className="tools" id="toolbar">
          <label>Provider
            <select id="provider" title="Price provider" defaultValue="eia">
              <option value="none">No prices</option>
              <option value="eia">EIA estimates</option>
            </select>
          </label>
          <label>Chains
            <select id="chainFilter" title="Major vs independent" defaultValue="all">
              <option value="all">All truck‑friendly</option>
              <option value="major">Major chains only</option>
              <option value="independent">Independent only</option>
            </select>
          </label>
          <label>Sort by
            <select id="sortBy" title="Result ordering" defaultValue="route">
              <option value="route">Route order</option>
              <option value="distance">Distance from start</option>
              <option value="price">Price (asc)</option>
            </select>
          </label>
          <label>Max detour (mi)
            <input id="detour" type="number" step="0.5" defaultValue="5" style={{width:'120px'}} />
          </label>
        </div>
      </header>
      <RouteForm />
      <FuelStops />
      <Summary />
    </div>
  );
}

export default App;
