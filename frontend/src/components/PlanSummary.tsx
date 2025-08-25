import React from 'react';
import { PlanResult } from '../types';

interface Props {
  result: PlanResult | null;
}

const PlanSummary: React.FC<Props> = ({ result }) => (
  <section className="card" style={{ marginTop: 12 }}>
    <h2>Plan Summary</h2>
    {!result ? (
      <div className="muted">No plan calculated.</div>
    ) : (
      <>
        <div className="kvs">
          <div>Effective MPG</div>
          <div className="mono">{result.mpgEff.toFixed(2)}</div>
          <div>Max range (full tank)</div>
          <div className="mono">{result.maxRange.toFixed(0)} mi</div>
          <div>Total route</div>
          <div className="mono">{result.totalMiles.toFixed(0)} mi</div>
        </div>
        <div className="list" style={{ marginTop: 8 }}>
          {result.plan.length === 0 ? (
            <div className="muted">No actions needed.</div>
          ) : (
            result.plan.map((step, i) =>
              step.type === 'stop' ? (
                <div className="station" key={i}>
                  <div>
                    <b>Stop at:</b> {step.station.name}
                    <div>
                      Buy <b>{step.gallons.toFixed(1)} gal</b>
                      {step.cost != null
                        ? ` @ ~$${step.station.dieselPrice?.toFixed(3)}/gal ≈ $${step.cost.toFixed(2)}`
                        : ''}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="station" key={i}>
                  <div>{step.action}</div>
                </div>
              )
            )
          )}
        </div>
      </>
    )}
  </section>
);

export default PlanSummary;
