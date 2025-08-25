import React, { useState, ChangeEvent, FormEvent } from 'react';
import { RouteFormValues } from '../types';

interface Props {
  onPlan: (values: RouteFormValues) => void;
}

const RouteForm: React.FC<Props> = ({ onPlan }) => {
  const [values, setValues] = useState<RouteFormValues>({
    start: '',
    end: '',
    mpg: 8,
    tank: 160,
    fuelVal: 40,
    fuelUnit: 'gal',
    reserve: 25,
    weight: undefined,
    terrain: 'rolling',
    govSpeed: 70,
    wind: undefined,
    driverCost: 122,
  });

  const update = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setValues((v) => ({
      ...v,
      [name]: type === 'number' && value !== '' ? Number(value) : value,
    }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onPlan(values);
  };

  return (
    <form className="card" onSubmit={submit} style={{ marginTop: 12 }}>
      <div className="row">
        <label>
          <span className="small muted">Start (exact address OK)</span>
          <input name="start" value={values.start} onChange={update} />
        </label>
        <label>
          <span className="small muted">Destination (exact address OK)</span>
          <input name="end" value={values.end} onChange={update} />
        </label>
      </div>
      <div className="row-3" style={{ marginTop: 8 }}>
        <label>
          <span className="small muted">Base MPG</span>
          <input
            name="mpg"
            type="number"
            step="0.1"
            value={values.mpg}
            onChange={update}
          />
        </label>
        <label>
          <span className="small muted">Tank size (gal)</span>
          <input
            name="tank"
            type="number"
            step="1"
            value={values.tank}
            onChange={update}
          />
        </label>
        <label>
          <span className="small muted">Current fuel</span>
          <div className="row" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <input
              name="fuelVal"
              type="number"
              step="0.1"
              value={values.fuelVal}
              onChange={update}
            />
            <select
              name="fuelUnit"
              value={values.fuelUnit}
              onChange={update}
            >
              <option value="gal">gal</option>
              <option value="pct">% of tank</option>
            </select>
          </div>
        </label>
      </div>
      <div className="row-3" style={{ marginTop: 8 }}>
        <label>
          <span className="small muted">Reserve buffer (miles)</span>
          <input
            name="reserve"
            type="number"
            step="1"
            value={values.reserve}
            onChange={update}
          />
        </label>
        <label>
          <span className="small muted">Gross weight (lbs, optional)</span>
          <input
            name="weight"
            type="number"
            step="100"
            value={values.weight ?? ''}
            onChange={update}
          />
        </label>
        <label>
          <span className="small muted">Terrain</span>
          <select name="terrain" value={values.terrain} onChange={update}>
            <option value="flat">Flat</option>
            <option value="rolling">Rolling</option>
            <option value="hilly">Hilly</option>
            <option value="mountain">Mountain</option>
          </select>
        </label>
      </div>
      <div className="row-3" style={{ marginTop: 8 }}>
        <label>
          <span className="small muted">Governed speed (mph)</span>
          <input
            name="govSpeed"
            type="number"
            step="1"
            value={values.govSpeed}
            onChange={update}
          />
        </label>
        <label>
          <span className="small muted">Headwind (mph, optional)</span>
          <input
            name="wind"
            type="number"
            step="1"
            value={values.wind ?? ''}
            onChange={update}
          />
        </label>
        <label>
          <span className="small muted">Driver cost ($/hr)</span>
          <input
            name="driverCost"
            type="number"
            step="1"
            value={values.driverCost}
            onChange={update}
          />
        </label>
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit" className="btn primary">
          Plan Route
        </button>
      </div>
    </form>
  );
};

export default RouteForm;
