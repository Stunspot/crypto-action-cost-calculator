import { CostDatum } from '../../types/CostDatum';
import { PriceData } from '../fetchers/PriceFetcher';
import { SlippageCost } from './SlippageProcessor';
import { GasCost } from './CostProcessor';

export interface NetReceived {
  netReceivedUsd: number;
}

export function processNetReceived(
  datum: CostDatum,
  price: PriceData,
  gasCost: GasCost,
  slippageCost: SlippageCost
): NetReceived {
  const grossUsd = datum.amount * price.price;
  const totalCosts = gasCost.gasUsd + slippageCost.slippageUsd + datum.protocol_fee_usd;
  const netReceivedUsd = Math.max(grossUsd - totalCosts, 0);
  return { netReceivedUsd };
}