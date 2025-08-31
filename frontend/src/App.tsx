import React, { useState } from 'react';
import RouteForm from './components/RouteForm';
import StationList from './components/StationList';
import PlanSummary from './components/PlanSummary';
import { Station, PlanResult, RouteFormValues } from './types';

const App: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [plan, setPlan] = useState<PlanResult | null>(null);

  const handlePlan = async (values: RouteFormValues) => {
    console.log('Plan request', values);
    try {
      const res = await fetch(`/api/plan?provider=${values.routeProvider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const data = await res.json();
        setStations(data.stations || []);
        setPlan(data.plan || null);
      } else {
        setStations([]);
        setPlan(null);
      }
    } catch (err) {
      console.error('Plan error', err);
      setStations([]);
      setPlan(null);
    }
  };

  return (
    <div className="wrap">
      <RouteForm onPlan={handlePlan} />
      <StationList stations={stations} />
      <PlanSummary result={plan} />
    </div>
  );
};

export default App;
