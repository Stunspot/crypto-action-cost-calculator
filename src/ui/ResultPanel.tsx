import React from 'react';
import { useCaccStore } from '../state/useCaccStore';

/**
 * ResultPanel displays the computed CostSummary. It shows total cost,
 * net received, predicted latency and a coloured efficiency indicator.
 * If the summary is undefined, a placeholder is rendered. Errors are
 * displayed prominently when present. Data sources are listed for
 * transparency.
 */
export const ResultPanel: React.FC = () => {
  const { summary, error } = useCaccStore();

  if (error) {
    return (
      <div className="h-full rounded-2xl border border-rose-500/40 bg-rose-950/60 p-4 text-rose-100 shadow-lg shadow-rose-900/40">
        <p className="text-sm font-semibold tracking-wide uppercase text-rose-300">
          Error
        </p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
        Enter your input and click{' '}
        <span className="mx-1 font-semibold text-slate-100">Compute</span> to see an
        estimate.
      </div>
    );
  }

  const efficiencyClasses =
    summary.cost_efficiency === 'green'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
      : summary.cost_efficiency === 'yellow'
      ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
      : 'border-rose-500/40 bg-rose-500/10 text-rose-200';

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl shadow-black/30 backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
            Result
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            All numbers are approximate and based on public API data.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium text-slate-400">Total cost (USD)</div>
          <div className="mt-1 text-base font-semibold text-slate-50">
            ${summary.total_cost_usd.toFixed(2)}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-400">Net received (USD)</div>
          <div className="mt-1 text-base font-semibold text-slate-50">
            ${summary.net_received_usd.toFixed(2)}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-400">Predicted latency</div>
          <div className="mt-1 text-base font-medium text-slate-100">
            {summary.predicted_latency_s.toFixed(0)} s
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-400">Cost efficiency</div>
          <span
            className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${efficiencyClasses}`}
          >
            {summary.cost_efficiency.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-500">
        <div className="mb-1 font-medium text-slate-400">Data sources</div>
        <div className="flex flex-wrap gap-1.5">
          {summary.data_sources.map((src) => (
            <span
              key={src}
              className="inline-flex items-center rounded-full bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300"
            >
              {src}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
