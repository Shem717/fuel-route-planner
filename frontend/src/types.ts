export interface RouteFormValues {
  start: string;
  end: string;
  mpg: number;
  tank: number;
  fuelVal: number;
  fuelUnit: 'gal' | 'pct';
  reserve: number;
  weight?: number;
  terrain: 'flat' | 'rolling' | 'hilly' | 'mountain';
  govSpeed: number;
  wind?: number;
  driverCost: number;
}

export interface Station {
  id?: string;
  name: string;
  addr?: string;
  brand?: string;
  lat: number;
  lon: number;
  dieselPrice?: number;
  dieselPrice_note?: string;
  milesFromStart: number;
}

export interface PlanStepStop {
  type: 'stop';
  station: Station;
  gallons: number;
  cost: number | null;
}

export interface PlanStepGap {
  type: 'gap';
  action: string;
}

export type PlanStep = PlanStepStop | PlanStepGap;

export interface PlanResult {
  plan: PlanStep[];
  mpgEff: number;
  maxRange: number;
  totalMiles: number;
}
