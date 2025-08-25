export default function FuelStops() {
  return (
    <section className="card" style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontWeight: 600 }}>Stations near your route (truck‑friendly)</div>
        <div className="small muted">Prices show as “—” unless EIA estimates are enabled.</div>
      </div>
      <div id="stations" className="list small"></div>
    </section>
  );
}
