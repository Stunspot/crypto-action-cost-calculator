import { Chain } from '../../types/CommonTypes';
import { ConfigProvider } from '../ConfigProvider';

export interface LatencyData {
  latencySeconds: number;
  source: string;
}

/**
 * LatencyFetcher predicts the confirmation time for a transaction on a given
 * chain.  It uses static block time from the ConfigProvider and applies a
 * simple congestion multiplier.  In a real implementation this could be
 * replaced with dynamic congestion data from a blockchain analytics API.
 */
export async function fetchLatency(chain: Chain): Promise<LatencyData> {
  const config = ConfigProvider.getChainConfig(chain);
  // baseline block time
  const base = config.blockTime;
  // apply random congestion multiplier between 1x and 2x for demonstration
  const multiplier = 1.0 + Math.random();
  const latencySeconds = Math.round(base * multiplier);
  return {
    latencySeconds,
    source: 'static-estimate'
  };
}