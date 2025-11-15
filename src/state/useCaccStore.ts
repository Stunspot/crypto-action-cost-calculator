import { create } from 'zustand';
import { InputPayload, Chain, ACTIONS, CHAINS } from '../types/CommonTypes';
import { CostSummary } from '../types/CostSummary';
import { Orchestrator } from '../modules/Orchestrator';
import { FeatureHookRegistry } from '../modules/FeatureHookRegistry';

/**
 * Zustand store for managing user input and computed results.  It exposes
 * actions to update input fields, trigger the calculation via the
 * orchestrator and reset state.  The orchestrator instance is stored
 * inside the store to ensure a single shared cache across calculations.
 */
interface CaccState {
  input: InputPayload;
  summary?: CostSummary;
  loading: boolean;
  error?: string;
  setChain: (chain: Chain) => void;
  setToken: (token: string) => void;
  setAction: (action: (typeof ACTIONS)[number]) => void;
  setAmount: (amount: number) => void;
  compute: () => Promise<void>;
  reset: () => void;
}

export const useCaccStore = create<CaccState>((set, get) => {
  // instantiate orchestrator once
  const orchestrator = new Orchestrator(60);
  return {
    input: {
      chain: CHAINS[0],
      token: 'ETH',
      action: ACTIONS[0],
      amount: 1
    },
    loading: false,
    setChain: (chain) => set((state) => ({ input: { ...state.input, chain } })),
    setToken: (token) => set((state) => ({ input: { ...state.input, token } })),
    setAction: (action) => set((state) => ({ input: { ...state.input, action } })),
    setAmount: (amount) => set((state) => ({ input: { ...state.input, amount } })),
    compute: async () => {
      const { input } = get();
      set({ loading: true, error: undefined });
      try {
        const summary = await orchestrator.computeCost(input);
        const finalSummary = FeatureHookRegistry.applyHooks(summary);
        set({ summary: finalSummary, loading: false });
      } catch (e) {
        set({ error: (e as Error).message, loading: false });
      }
    },
    reset: () => set({ summary: undefined, error: undefined })
  };
});