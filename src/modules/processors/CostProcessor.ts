import { CostDatum } from '../../types/CostDatum';

export interface GasCost {
  gasUsd: number;
  gasNative: number;
}

/**
 * Compute the gas cost component.  This processor is trivial because the
 * normaliser already multiplies gas price by consumption and token price.
 * However, exposing a separate processor allows for additional logic such as
 * tiered fees, rebates or subsidy calculations in the future.
 */
export function processGasCost(datum: CostDatum): GasCost {
  return {
    gasUsd: datum.gas_usd,
    gasNative: datum.gas_native
  };
}