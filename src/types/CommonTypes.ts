/**
 * Supported blockchain identifiers.  Extend this list to support more chains.
 */
export const CHAINS = [
  'ethereum',
  'polygon',
  'arbitrum',
  'optimism',
  'binance-smart-chain',
  'avalanche'
] as const;

export type Chain = (typeof CHAINS)[number];

/**
 * Supported actions the calculator can handle.  Additional actions can be
 * appended here.
 */
export const ACTIONS = [
  'swap',
  'transfer',
  'bridge',
  'mint',
  'stake',
  'withdraw'
] as const;

export type Action = (typeof ACTIONS)[number];

/**
 * Input payload provided by the user via the InputPanel.  This feeds into
 * the orchestrator which coordinates API calls and cost processing.
 */
export interface InputPayload {
  chain: Chain;
  token: string;
  action: Action;
  amount: number;
}