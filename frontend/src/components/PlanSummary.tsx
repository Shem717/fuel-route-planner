import React from 'react';
import { PlanResult } from '../types';

interface Props {
  result: PlanResult | null;
}

const PlanSummary: React.FC<Props> = ({ result }) => (
  <section className="card mt-3">
    <h2>Plan Summary</h2>
    {!result ? (
      <div className="muted">No plan calculated.</div>
    ) : (
      <>
        <div className="metrics">
          <div className="metric">
            <span>Effective MPG</span>
            <span className="mono">{result.mpgEff.toFixed(2)}</span>
            <div className="progress"><div className="progress-bar" style={{width: `${Math.min((result.mpgEff/15)*100,100)}%`}}></div></div>
          </div>
          <div className="metric">
            <span>Max range</span>
            <span className="mono">{result.maxRange.toFixed(0)} mi</span>
            <div className="progress"><div className="progress-bar" style={{width: '100%'}}></div></div>
          </div>
          <div className="metric">
            <span>Total route</span>
            <span className="mono">{result.totalMiles.toFixed(0)} mi</span>
            <div className="progress"><div className="progress-bar" style={{width: `${Math.min((result.totalMiles/result.maxRange)*100,100)}%`}}></div></div>
          </div>
        </div>
        <div className="list mt-2">
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
