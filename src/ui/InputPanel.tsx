import React, { useState } from 'react';
import { CHAINS, ACTIONS, Chain } from '../types/CommonTypes';
import { useCaccStore } from '../state/useCaccStore';

/**
 * InputPanel renders the user input form.
 * Allows selecting chain, token, action, and entering amount (with decimal support).
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

  // Local string state for the amount field so the user can type freely
  const [amountInput, setAmountInput] = useState<string>(
    input.amount ? String(input.amount) : ''
  );

  return (
    <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/30 backdrop-blur-sm space-y-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
          Input
        </h2>
        <p className="text-xs text-slate-500">
          Describe the action you&apos;re considering.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Chain */}
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-200">Chain</span>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none 
                       transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60"
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

        {/* Token */}
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-200">Token</span>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none 
                       transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60"
            value={input.token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            placeholder="e.g. ETH, USDC"
          />
        </label>

        {/* Action */}
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-200">Action</span>
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none 
                       transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60"
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

        {/* Amount (with Enter-to-compute) */}
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-200">Amount</span>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none 
                       transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60"
            value={amountInput}
            onChange={(e) => {
              const raw = e.target.value;

              if (!/^[0-9]*[.,]?[0-9]*$/.test(raw)) return;

              setAmountInput(raw);

              if (raw === '' || raw === '.') {
                setAmount(0);
                return;
              }

              const normalized = raw.replace(',', '.');
              const parsed = parseFloat(normalized);

              if (!isNaN(parsed)) {
                setAmount(parsed);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                compute();
              }
            }}
            placeholder="0.0"
          />
        </label>
      </div>

      {/* Compute Button */}
      <button
        className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold 
                   text-slate-950 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-300 
                   hover:shadow-lg hover:shadow-emerald-500/50 focus-visible:outline-none 
                   focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 
                   focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={compute}
        disabled={loading}
      >
        {loading ? 'Calculating…' : 'Compute'}
      </button>
    </div>
  );
};

export default InputPanel;
