export interface CostDatumV1 {
  /** schema version for forward/backward compatibility */
  schema_version: '1.0';
  /** chain identifier (e.g. ethereum, polygon) */
  chain: string;
  /** token symbol (e.g. USDC, ETH) */
  token: string;
  /** action type (swap, transfer, bridge, mint, stake, withdraw) */
  action: string;
  /** user supplied amount in token units */
  amount: number;
  /** gas cost in native units (e.g. ETH) */
  gas_native: number;
  /** gas cost in USD */
  gas_usd: number;
  /** slippage percentage (0–100) */
  slippage_pct: number;
  /** price impact percentage (0–100) */
  price_impact_pct: number;
  /** protocol or bridge fee in USD */
  protocol_fee_usd: number;
  /** predicted network latency in seconds */
  latency_s: number;
  /** aggregated confidence score (0–1) */
  confidence: number;
  /** unix timestamp in seconds for data retrieval */
  timestamp: number;
}

export type CostDatum = CostDatumV1;