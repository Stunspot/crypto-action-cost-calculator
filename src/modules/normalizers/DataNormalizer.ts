import { CostDatum } from '../../types/CostDatum';
import { InputPayload } from '../../types/CommonTypes';
import { GasData } from '../fetchers/GasFetcher';
import { PriceData } from '../fetchers/PriceFetcher';
import { DEXQuoteData } from '../fetchers/DEXQuoteFetcher';
import { LatencyData } from '../fetchers/LatencyFetcher';

/**
 * DataNormalizer consolidates the disparate response shapes returned from
 * the fetchers into a canonical CostDatum structure.  Some computed values
 * (e.g. gas cost in USD) are deferred to processors to allow for custom
 * logic.  However, raw numbers such as gas price and slippage are copied
 * onto the datum here for consistent naming.
 */
export function normalizeData(
  input: InputPayload,
  gas: GasData,
  price: PriceData,
  dex: DEXQuoteData,
  latency: LatencyData
): CostDatum {
  const timestamp = Math.floor(Date.now() / 1000);
  // approximate gas consumption based on action; these constants are naive and
  // should be refined per chain and action.  Values are in gas units.
  const ACTION_GAS_USAGE: Record<string, number> = {
    swap: 120_000,
    transfer: 45_000,
    bridge: 200_000,
    mint: 150_000,
    stake: 180_000,
    withdraw: 150_000
  };
  const gasUnits = ACTION_GAS_USAGE[input.action] ?? 100_000;
  // convert gas price (gwei) to native cost (native token) using 1e9 conversion
  const gasNative = (gas.gasPrice * gasUnits) / 1e9;
  // convert to USD using token price; will be finalised in CostProcessor
  const gasUsd = gasNative * price.price;
  return {
    schema_version: '1.0',
    chain: input.chain,
    token: input.token,
    action: input.action,
    amount: input.amount,
    gas_native: gasNative,
    gas_usd: gasUsd,
    slippage_pct: dex.slippagePct,
    price_impact_pct: dex.priceImpactPct,
    protocol_fee_usd: dex.protocolFeeUsd,
    latency_s: latency.latencySeconds,
    confidence: 1.0,
    timestamp
  };
}