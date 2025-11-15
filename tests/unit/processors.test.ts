import { describe, expect, it } from 'vitest';
import { processGasCost } from '../../src/modules/processors/CostProcessor';
import { processSlippage } from '../../src/modules/processors/SlippageProcessor';
import { processNetReceived } from '../../src/modules/processors/NetReceivedProcessor';
import { processLatency } from '../../src/modules/processors/LatencyProcessor';
import { normalizeData } from '../../src/modules/normalizers/DataNormalizer';
import { aggregateResult } from '../../src/modules/ResultAggregator';
import type { CostDatum } from '../../src/types/CostDatum';

describe('Processors', () => {
  it('processGasCost computes gasUsd and gasNative', () => {
    const datum = {
      gas_usd: 2,
      gas_native: 0.01
    } as unknown as CostDatum;
    const gasCost = processGasCost(datum);
    expect(gasCost.gasUsd).toBe(2);
    expect(gasCost.gasNative).toBe(0.01);
  });

  it('processSlippage computes slippageUsd and passes price impact', () => {
    const datum = {
      amount: 100,
      slippage_pct: 0.5,
      price_impact_pct: 0.3
    } as unknown as CostDatum;
    const price = { price: 1.0, source: 'test' };
    const slippage = processSlippage(datum, price);
    expect(slippage.slippageUsd).toBeCloseTo(0.5, 6);
    expect(slippage.priceImpactPct).toBe(0.3);
  });

  it('processNetReceived computes the remaining amount after costs', () => {
    const datum = {
      amount: 10,
      protocol_fee_usd: 1
    } as unknown as CostDatum;
    const price = { price: 2.0, source: 'test' };
    const gasCost = { gasUsd: 2, gasNative: 0.001 };
    const slippageCost = { slippageUsd: 1, priceImpactPct: 0.0 };
    const net = processNetReceived(datum, price, gasCost, slippageCost);
    // gross = 10*2=20; total costs=2+1+1=4; net=16
    expect(net.netReceivedUsd).toBe(16);
  });

  it('processLatency returns latency seconds', () => {
    const datum = { latency_s: 15 } as unknown as CostDatum;
    const lat = processLatency(datum);
    expect(lat.latencySeconds).toBe(15);
  });

  it('aggregateResult computes cost summary and efficiency', () => {
    const datum = {
      schema_version: '1.0',
      chain: 'ethereum',
      token: 'ETH',
      action: 'swap',
      amount: 100,
      gas_native: 0.01,
      gas_usd: 2,
      slippage_pct: 1,
      price_impact_pct: 0.5,
      protocol_fee_usd: 0.5,
      latency_s: 10,
      confidence: 1,
      timestamp: 0
    } as CostDatum;
    const gasCost = { gasUsd: 2, gasNative: 0.01 };
    const slippage = { slippageUsd: 1, priceImpactPct: 0.5 };
    const latency = { latencySeconds: 10 };
    const summary = aggregateResult(
      datum,
      gasCost,
      slippage,
      latency,
      1, // price per token
      ['a', 'b']
    );
    // total cost = 2 + 1 + 0.5 = 3.5; gross=100*1=100; costPct=3.5%; yellow
    expect(summary.total_cost_usd).toBeCloseTo(3.5, 6);
    expect(summary.net_received_usd).toBeCloseTo(96.5, 6);
    expect(summary.cost_efficiency).toBe('yellow');
    expect(summary.predicted_latency_s).toBe(10);
    expect(summary.data_sources).toEqual(['a', 'b']);
  });
});