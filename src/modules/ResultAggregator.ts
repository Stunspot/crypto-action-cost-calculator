import { CostDatum } from '../types/CostDatum';
import { CostSummary } from '../types/CostSummary';
import { GasCost } from './processors/CostProcessor';
import { SlippageCost } from './processors/SlippageProcessor';
import { LatencyEstimate } from './processors/LatencyProcessor';

/**
 * ResultAggregator combines the intermediate processor outputs into a
 * user‑facing CostSummary.  It calculates the total cost in USD, net
 * amount received, determines a cost efficiency indicator and collates
 * data source names and confidence scores.  The colour indicator is
 * derived from the ratio of total cost to the gross transaction value
 * (amount * price) expressed as a percentage: less than 1 % yields
 * green, between 1–5 % yields yellow, and above 5 % yields red.
 */
export function aggregateResult(
  datum: CostDatum,
  gasCost: GasCost,
  slippageCost: SlippageCost,
  latency: LatencyEstimate,
  pricePerToken: number,
  sources: string[]
): CostSummary {
  const totalCostUsd = gasCost.gasUsd + slippageCost.slippageUsd + datum.protocol_fee_usd;
  const grossUsd = datum.amount * pricePerToken;
  // avoid division by zero; treat zero amount as zero cost percentage
  const costPct = grossUsd > 0 ? (totalCostUsd / grossUsd) * 100 : 0;
  let costEfficiency: 'green' | 'yellow' | 'red';
  if (costPct < 1) {
    costEfficiency = 'green';
  } else if (costPct < 5) {
    costEfficiency = 'yellow';
  } else {
    costEfficiency = 'red';
  }
  return {
    schema_version: '1.0',
    total_cost_usd: parseFloat(totalCostUsd.toFixed(6)),
    net_received_usd: parseFloat(
      Math.max(grossUsd - totalCostUsd, 0).toFixed(6)
    ),
    predicted_latency_s: latency.latencySeconds,
    cost_efficiency: costEfficiency,
    data_sources: Array.from(new Set(sources)),
    confidence: datum.confidence,
    timestamp: datum.timestamp
  };
}