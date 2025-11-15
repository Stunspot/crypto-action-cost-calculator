import axios from 'axios';

export interface PriceData {
  price: number; // USD price per token
  source: string;
}

/**
 * Basic mapping from common tokens to CoinGecko identifiers.  Extend this
 * mapping to support more tokens.  If a token is not found, we will
 * assume a price of 1 USD to avoid division by zero.
 */
const TOKEN_TO_COINGECKO_ID: Record<string, string> = {
  ETH: 'ethereum',
  USDC: 'usd-coin',
  MATIC: 'matic-network',
  BNB: 'binancecoin',
  AVAX: 'avalanche-2'
};

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

export async function fetchPrice(token: string): Promise<PriceData> {
  const id = TOKEN_TO_COINGECKO_ID[token.toUpperCase()];
  if (!id) {
    return { price: 1, source: 'static-default' };
  }
  try {
    const resp = await axios.get(COINGECKO_API, {
      params: {
        ids: id,
        vs_currencies: 'usd'
      }
    });
    const price = resp.data?.[id]?.usd;
    return {
      price: typeof price === 'number' ? price : 1,
      source: COINGECKO_API
    };
  } catch (e) {
    return { price: 1, source: 'static-fallback' };
  }
}