import React from 'react';
import { PlanResult } from '../types';
import MetricBar from './MetricBar';

interface Props {
  result: PlanResult | null;
}

const PlanSummary: React.FC<Props> = ({ result }) => {
  const maxMiles = result ? Math.max(result.maxRange, result.totalMiles) : 0;
  return (
    <section className="card mt-12">
      <h2>Plan Summary</h2>
      {!result ? (
        <div className="muted">No plan calculated.</div>
      ) : (
        <>
          <div className="kvs">
            <div>Effective MPG</div>
            <div>
              <div className="mono">{result.mpgEff.toFixed(2)}</div>
              <MetricBar value={result.mpgEff} max={15} />
            </div>
            <div>Max range (full tank)</div>
            <div>
              <div className="mono">{result.maxRange.toFixed(0)} mi</div>
              <MetricBar value={result.maxRange} max={maxMiles} />
            </div>
            <div>Total route</div>
            <div>
              <div className="mono">{result.totalMiles.toFixed(0)} mi</div>
              <MetricBar value={result.totalMiles} max={maxMiles} />
            </div>
          </div>
          <div className="list mt-8">
            {result.plan.length === 0 ? (
              <div className="muted">No actions needed.</div>
            ) : (
              result.plan.map((step, i) =>
                step.type === 'stop' ? (
                  <div className="plan-step stop" key={i}>
                    <span className="icon">⛽</span>
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
                  <div className="plan-step action" key={i}>
                    <span className="icon">➡️</span>
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
};

export default PlanSummary;

