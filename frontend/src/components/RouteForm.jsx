export default function RouteForm() {
  return (
    <section className="card" style={{ marginTop: '12px' }}>
      <div className="row">
        <label><span className="small muted">Start (exact address OK)</span>
          <input id="start" placeholder="6418 Centennial Blvd, Nashville, TN 37209" list="startList" autoComplete="off" />
          <datalist id="startList"></datalist>
        </label>
        <label><span className="small muted">Destination (exact address OK)</span>
          <input id="end" placeholder="2594 US‑301, Dunn, NC 28334" list="endList" autoComplete="off" />
          <datalist id="endList"></datalist>
        </label>
      </div>
      <div className="row-3" style={{ marginTop: '8px' }}>
        <label><span className="small muted">Base MPG</span>
          <input id="mpg" type="number" step="0.1" defaultValue="8" />
        </label>
        <label><span className="small muted">Tank size (gal)</span>
          <input id="tank" type="number" step="1" defaultValue="160" />
        </label>
        <label><span className="small muted">Current fuel</span>
          <div className="row" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <input id="fuelVal" type="number" step="0.1" defaultValue="40" />
            <select id="fuelUnit" defaultValue="gal"><option value="gal">gal</option><option value="pct">% of tank</option></select>
          </div>
        </label>
      </div>
      <div className="row-3" style={{ marginTop: '8px' }}>
        <label><span className="small muted">Reserve buffer (miles)</span>
          <input id="reserve" type="number" step="1" defaultValue="25" />
        </label>
        <label><span className="small muted">Gross weight (lbs, optional)</span>
          <input id="weight" type="number" step="100" placeholder="80000" />
        </label>
        <label><span className="small muted">Terrain</span>
          <select id="terrain" defaultValue="rolling">
            <option value="flat">Flat</option>
            <option value="rolling">Rolling</option>
            <option value="hilly">Hilly</option>
            <option value="mountain">Mountain</option>
          </select>
        </label>
      </div>
      <div className="row-3" style={{ marginTop: '8px' }}>
        <label><span className="small muted">Governed speed (mph)</span>
          <input id="govSpeed" type="number" step="1" defaultValue="70" />
        </label>
        <label><span className="small muted">Headwind (mph, optional)</span>
          <input id="wind" type="number" step="1" placeholder="0" />
        </label>
        <label><span className="small muted">Driver cost ($/hr)</span>
          <input id="driverCost" type="number" step="1" defaultValue="122" />
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <button id="planBtn" type="button" className="btn primary">Plan Route</button>
          <button id="resetBtn" type="button" className="btn">Reset</button>
          <span id="alerts" className="small muted"></span>
        </div>
      </div>
    </section>
  );
}
