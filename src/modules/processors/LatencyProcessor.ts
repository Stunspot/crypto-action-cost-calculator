import { CostDatum } from '../../types/CostDatum';

export interface LatencyEstimate {
  latencySeconds: number;
}

export function processLatency(datum: CostDatum): LatencyEstimate {
  return { latencySeconds: datum.latency_s };
}