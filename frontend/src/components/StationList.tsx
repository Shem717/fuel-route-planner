import React from 'react';
import { Station } from '../types';
import Map from './Map';

interface Props {
  stations: Station[];
}

const StationList: React.FC<Props> = ({ stations }) => (
  <section className="card mt-3">
    <h2>Stations</h2>
    <Map stations={stations} />
    <div className="stations-grid mt-2">
      {stations.length === 0 ? (
        <div className="muted">No stations loaded.</div>
      ) : (
        stations.map((s) => (
          <div className="station-card" key={`${s.lat}-${s.lon}`}>
            <div className="station-card-body">
              <b>{s.name}</b>
              <div className="muted">{s.addr}</div>
              <div className="mt-1">
                Brand: <span className="badge">{s.brand ?? '—'}</span>
              </div>
              <div className="mt-1">
                Diesel: <b>{s.dieselPrice != null ? `$${s.dieselPrice.toFixed(3)}/gal` : '—'}</b>
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
