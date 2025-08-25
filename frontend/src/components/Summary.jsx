export default function Summary() {
  return (
    <section className="card" style={{ marginTop: '14px' }}>
      <div style={{ fontWeight: 600, marginBottom: '6px' }}>AI Recommendation</div>
      <div className="small muted">We adjust MPG for weight/terrain/speed/wind, compute range & reserve, then recommend stops using estimated prices.</div>
      <div className="tools" style={{ marginTop: '8px' }}>
        <button id="recoBtn" type="button" className="btn primary">Compute AI Plan</button>
        <div id="recoSummary" className="small"></div>
      </div>
      <div className="tools" style={{ marginTop: '6px' }}>
        <label className="small"><input type="checkbox" id="hazmat"/> Hazmat routing</label>
      </div>
      <div id="recoPlan" className="list small" style={{ marginTop: '8px' }}></div>
    </section>
  );
}
