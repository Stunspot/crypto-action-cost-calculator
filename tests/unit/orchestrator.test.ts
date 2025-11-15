import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Orchestrator } from '../../src/modules/Orchestrator';
import * as GasFetcher from '../../src/modules/fetchers/GasFetcher';
import * as PriceFetcher from '../../src/modules/fetchers/PriceFetcher';
import * as DEXFetcher from '../../src/modules/fetchers/DEXQuoteFetcher';
import * as LatencyFetcher from '../../src/modules/fetchers/LatencyFetcher';

describe('Orchestrator', () => {
  const orchestrator = new Orchestrator(0); // disable caching for tests
  beforeEach(() => {
    // stub fetchers with deterministic values
    vi.spyOn(GasFetcher, 'fetchGas').mockResolvedValue({ gasPrice: 50, source: 'mock-gas' });
    vi.spyOn(PriceFetcher, 'fetchPrice').mockResolvedValue({ price: 2, source: 'mock-price' });
    vi.spyOn(DEXFetcher, 'fetchDEXQuote').mockResolvedValue({
      slippagePct: 1,
      priceImpactPct: 0.5,
      protocolFeeUsd: 0.2,
      source: 'mock-dex'
    });
    vi.spyOn(LatencyFetcher, 'fetchLatency').mockResolvedValue({ latencySeconds: 15, source: 'mock-latency' });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('computes cost summary correctly', async () => {
    const input = { chain: 'ethereum', token: 'ETH', action: 'swap', amount: 10 } as const;
    const summary = await orchestrator.computeCost(input);
    // gas: 50 gwei * 120000 / 1e9 = 0.006 ETH * 2 USD = 0.012 USD
    // slippage: 10 * 2 * 1/100 = 0.2 USD
    // protocol fee: 0.2 USD
    // total cost: 0.012 + 0.2 + 0.2 = 0.412 USD
    expect(summary.total_cost_usd).toBeCloseTo(0.412, 6);
    expect(summary.net_received_usd).toBeCloseTo(19.588, 6);
    expect(summary.predicted_latency_s).toBe(15);
    expect(summary.cost_efficiency).toBe('yellow');
    expect(summary.data_sources).toEqual(
      expect.arrayContaining(['mock-gas', 'mock-price', 'mock-dex', 'mock-latency'])
    );
  });
});