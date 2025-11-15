import React from 'react';
import { CHAINS, ACTIONS, Chain } from '../types/CommonTypes';
import { useCaccStore } from '../state/useCaccStore';

/**
 * InputPanel renders a simple form allowing the user to select a chain,
 * token, action and amount.  It binds to the Zustand store for state
 * updates and triggers calculation when the user presses the Compute
 * button.  This component intentionally avoids complex validation; in
 * a production app you would add number formatting and error messages.
 */
export const InputPanel: React.FC = () => {
  const {
    input,
    setChain,
    setToken,
    setAction,
    setAmount,
    compute,
    loading
  } = useCaccStore();
  return (
    <div className="p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-lg font-semibold">Input</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Chain</span>
          <select
            className="border p-2 rounded"
            value={input.chain}
            onChange={(e) => setChain(e.target.value as Chain)}
          >
            {CHAINS.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Token</span>
          <input
            type="text"
            className="border p-2 rounded"
            value={input.token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Action</span>
          <select
            className="border p-2 rounded"
            value={input.action}
            onChange={(e) => setAction(e.target.value as any)}
          >
            {ACTIONS.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Amount</span>
          <input
            type="number"
            className="border p-2 rounded"
            min="0"
            step="any"
            value={input.amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={compute}
        disabled={loading}
      >
        {loading ? 'Calculating…' : 'Compute'}
      </button>
    </div>
  );
};

export default InputPanel;