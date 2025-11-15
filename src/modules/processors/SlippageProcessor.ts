import { CostDatum } from '../../types/CostDatum';
import { PriceData } from '../fetchers/PriceFetcher';

export interface SlippageCost {
  slippageUsd: number;
  priceImpactPct: number;
}

export function processSlippage(datum: CostDatum, price: PriceData): SlippageCost {
  const slippageUsd = (datum.amount * price.price * datum.slippage_pct) / 100;
  return {
    slippageUsd,
    priceImpactPct: datum.price_impact_pct
  };
}