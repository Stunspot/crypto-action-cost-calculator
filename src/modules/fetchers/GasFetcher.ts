import axios from 'axios';
import { Chain } from '../../types/CommonTypes';
import { ConfigProvider } from '../ConfigProvider';

export interface GasData {
  gasPrice: number; // gas price in gwei
  source: string;
}

/**
 * GasFetcher retrieves gas price data for a given chain.  It supports
 * optional API endpoints defined in the ConfigProvider.  If no API is
 * specified, it falls back to a default constant gas price.
 */
export async function fetchGas(chain: Chain): Promise<GasData> {
  const config = ConfigProvider.getChainConfig(chain);
  const defaultGasGwei = 30;
  if (!config.gasApi) {
    return {
      gasPrice: defaultGasGwei,
      source: 'static-default'
    };
  }
  try {
    const resp = await axios.get(config.gasApi);
    // Many gas APIs return different shapes.  We'll attempt to infer
    // reasonable values.  For Etherscan and BSC, the gas price is in Gwei.
    let gasPrice = defaultGasGwei;
    if (resp.data && typeof resp.data === 'object') {
      if (resp.data.result?.ProposeGasPrice) {
        gasPrice = parseFloat(resp.data.result.ProposeGasPrice);
      } else if (resp.data.average) {
        gasPrice = parseFloat(resp.data.average);
      } else if (resp.data.result?.FastGasPrice) {
        gasPrice = parseFloat(resp.data.result.FastGasPrice);
      }
    }
    return { gasPrice, source: config.gasApi };
  } catch (e) {
    // Fall back to default value on error
    return {
      gasPrice: defaultGasGwei,
      source: 'static-fallback'
    };
  }
}