import { CHAINS, Chain } from '../types/CommonTypes';

/**
 * Static chain configuration.  In a real implementation these values might
 * be fetched from a remote service or versioned JSON file.  For the purpose
 * of this project, they are embedded here for simplicity.
 */
interface ChainConfig {
  /** native token symbol (used for gas cost display) */
  nativeToken: string;
  /** approximate block time in seconds */
  blockTime: number;
  /** gas price API endpoint (optional) */
  gasApi?: string;
}

const CHAIN_CONFIG: Record<Chain, ChainConfig> = {
  ethereum: {
    nativeToken: 'ETH',
    blockTime: 12,
    gasApi: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle'
  },
  polygon: {
    nativeToken: 'MATIC',
    blockTime: 2,
    gasApi: 'https://gasstation-mainnet.matic.network'
  },
  arbitrum: {
    nativeToken: 'ETH',
    blockTime: 2,
    gasApi: undefined
  },
  optimism: {
    nativeToken: 'ETH',
    blockTime: 2,
    gasApi: undefined
  },
  'binance-smart-chain': {
    nativeToken: 'BNB',
    blockTime: 3,
    gasApi: 'https://bscgas.info/gas'
  },
  avalanche: {
    nativeToken: 'AVAX',
    blockTime: 3,
    gasApi: undefined
  }
};

/**
 * ConfigProvider exposes chain metadata to other modules.  Additional
 * configuration such as supported tokens, protocol fees and DEX addresses
 * could be added here in the future.
 */
export const ConfigProvider = {
  getChainConfig(chain: Chain): ChainConfig {
    return CHAIN_CONFIG[chain];
  }
};