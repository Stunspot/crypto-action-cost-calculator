export interface CostSummaryV1 {
  /** schema version for forward/backward compatibility */
  schema_version: '1.0';
  /** total cost in USD (gas + slippage + fees) */
  total_cost_usd: number;
  /** net amount the user will receive in USD after deducting costs */
  net_received_usd: number;
  /** predicted transaction latency in seconds */
  predicted_latency_s: number;
  /** cost efficiency indicator (green/yellow/red) */
  cost_efficiency: 'green' | 'yellow' | 'red';
  /** array of data source names used to compute this summary */
  data_sources: string[];
  /** aggregated confidence score (0–1) */
  confidence: number;
  /** unix timestamp in seconds for summary creation */
  timestamp: number;
}

export type CostSummary = CostSummaryV1;