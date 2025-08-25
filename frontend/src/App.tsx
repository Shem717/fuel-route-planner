import React, { useState } from 'react';
import RouteForm from './components/RouteForm';
import StationList from './components/StationList';
import PlanSummary from './components/PlanSummary';
import { Station, PlanResult, RouteFormValues } from './types';

const App: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [plan, setPlan] = useState<PlanResult | null>(null);

  const handlePlan = (values: RouteFormValues) => {
    console.log('Plan request', values);
    // Integration with backend will populate stations and plan
    setStations([]);
    setPlan(null);
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
