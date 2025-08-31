import React from 'react';
import { Station } from '../types';

interface Props {
  stations: Station[];
}

const StationList: React.FC<Props> = ({ stations }) => (
  <section className="card mt-12">
    <h2>Stations</h2>
    <div className="list">
      {stations.length === 0 ? (
        <div className="muted">No stations loaded.</div>
      ) : (
        stations.map((s) => (
          <div className="station" key={`${s.lat}-${s.lon}`}>
            <div>
              <b>{s.name}</b>
              <div className="muted">{s.addr}</div>
              <div className="mt-4">
                Brand: <span className="badge">{s.brand ?? '—'}</span>
              </div>
              <div className="mt-4">
                Diesel:{' '}
                <b>
                  {s.dieselPrice != null
                    ? `$${s.dieselPrice.toFixed(3)}/gal`
                    : '—'}
                </b>
              </div>
            </div>
            <div className="small">{s.milesFromStart.toFixed(1)} mi</div>
          </div>
        ))
      )}
    </div>
  </section>
);

export default StationList;
