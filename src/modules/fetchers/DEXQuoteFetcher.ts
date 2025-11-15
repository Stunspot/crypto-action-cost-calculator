import axios from 'axios';

export interface DEXQuoteData {
  slippagePct: number;
  priceImpactPct: number;
  protocolFeeUsd: number;
  source: string;
}

/**
 * DEXQuoteFetcher requests a swap quote from a DEX aggregator.  For the sake of
 * demonstration this implementation uses 0x Swap API if available.  If the
 * request fails or the token pair is not supported, it falls back to a
 * deterministic estimation.
 */
const ZERO_X_BASE = 'https://api.0x.org/swap/v1/quote';

export async function fetchDEXQuote(
  sellToken: string,
  buyToken: string,
  amount: number
): Promise<DEXQuoteData> {
  // Convert amount to token base units.  This naive implementation assumes
  // tokens have 18 decimals which is true for ETH & many ERC20 but not all.
  const sellAmountWei = BigInt(Math.round(amount * 1e18)).toString();
  const params = {
    sellToken,
    buyToken,
    sellAmount: sellAmountWei
  } as Record<string, string>;
  try {
    const resp = await axios.get(ZERO_X_BASE, { params });
    // 0x API returns price impact estimate in response.meta.sourceBreakdown
    // but this may not be provided; we approximate here.
    const priceImpactPct = resp.data?.priceImpact ?? 0.3;
    const guaranteedPrice = resp.data?.guaranteedPrice;
    const price = resp.data?.price;
    let slippagePct = 0.0;
    if (price && guaranteedPrice) {
      slippagePct = ((parseFloat(price) - parseFloat(guaranteedPrice)) / parseFloat(price)) * 100;
    } else {
      slippagePct = 0.3;
    }
    // Protocol fee is returned in takerTokenGasFees if present; fallback to zero
    const protocolFeeUsd = 0;
    return {
      slippagePct,
      priceImpactPct,
      protocolFeeUsd,
      source: ZERO_X_BASE
    };
  } catch (e) {
    // fallback: assume small slippage and price impact
    return {
      slippagePct: 0.5,
      priceImpactPct: 0.4,
      protocolFeeUsd: 0.0,
      source: 'static-fallback'
    };
  }
}