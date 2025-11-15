import { InputPayload } from '../types/CommonTypes';
import { CostSummary } from '../types/CostSummary';
import { CacheManager } from './CacheManager';
import { fetchGas } from './fetchers/GasFetcher';
import { fetchPrice } from './fetchers/PriceFetcher';
import { fetchDEXQuote } from './fetchers/DEXQuoteFetcher';
import { fetchLatency } from './fetchers/LatencyFetcher';
import { normalizeData } from './normalizers/DataNormalizer';
import { processGasCost } from './processors/CostProcessor';
import { processSlippage } from './processors/SlippageProcessor';
import { processLatency } from './processors/LatencyProcessor';
import { processNetReceived } from './processors/NetReceivedProcessor';
import { aggregateResult } from './ResultAggregator';
import { ErrorHandler } from './ErrorHandler';

/**
 * The Orchestrator coordinates fetching, normalising and processing of
 * cost data.  It exposes a single method `computeCost` which accepts
 * user input and returns a CostSummary.  To avoid redundant network
 * requests the orchestrator uses an in‑memory cache keyed by the
 * serialized input payload.  Fetches are executed concurrently via
 * Promise.allSettled; if any fetch fails the error handler will
 * downgrade confidence and supply fallback values.
 */
export class Orchestrator {
  private cache: CacheManager<string, CostSummary>;

  constructor(cacheTtlSeconds = 60) {
    this.cache = new CacheManager<string, CostSummary>(cacheTtlSeconds);
  }

  /**
   * Serialize the input into a cache key.  A JSON string of the payload
   * suffices because the input shape is flat and deterministic.
   */
  private static serializeInput(input: InputPayload): string {
    return JSON.stringify(input);
  }

  async computeCost(input: InputPayload): Promise<CostSummary> {
    const key = Orchestrator.serializeInput(input);
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }
    // execute all fetchers concurrently; if one rejects we still proceed
    const [gasRes, priceRes, dexRes, latencyRes] = await Promise.allSettled([
      fetchGas(input.chain),
      fetchPrice(input.token),
      fetchDEXQuote(input.token, input.token, input.amount),
      fetchLatency(input.chain)
    ]);
    // normalised responses with fallback error handling
    const gas = ErrorHandler.unwrapFetchResult(gasRes, { gasPrice: 30, source: 'error-fallback' });
    const price = ErrorHandler.unwrapFetchResult(priceRes, { price: 1, source: 'error-fallback' });
    const dex = ErrorHandler.unwrapFetchResult(dexRes, {
      slippagePct: 0.5,
      priceImpactPct: 0.4,
      protocolFeeUsd: 0,
      source: 'error-fallback'
    });
    const latency = ErrorHandler.unwrapFetchResult(latencyRes, {
      latencySeconds: 30,
      source: 'error-fallback'
    });
    // normalise into a datum
    const datum = normalizeData(input, gas, price, dex, latency);
    // derive processor outputs
    const gasCost = processGasCost(datum);
    const slippageCost = processSlippage(datum, price);
    const latencyEst = processLatency(datum);
    // compute net received (not directly used in summary but for cost check)
    const net = processNetReceived(datum, price, gasCost, slippageCost);
    // aggregate into summary
    const summary = aggregateResult(
      datum,
      gasCost,
      slippageCost,
      latencyEst,
      price.price,
      [gas.source, price.source, dex.source, latency.source]
    );
    // store in cache
    this.cache.set(key, summary);
    return summary;
  }
}