import React from 'react';
import { useCaccStore } from '../state/useCaccStore';

/**
 * ResultPanel displays the computed CostSummary.  It shows total cost,
 * net received, predicted latency and a coloured efficiency indicator.
 * If the summary is undefined, a placeholder is rendered.  Errors are
 * displayed prominently when present.  Data sources are listed for
 * transparency.
 */
export const ResultPanel: React.FC = () => {
  const { summary, error } = useCaccStore();
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }
  if (!summary) {
    return (
      <div className="p-4 bg-gray-50 text-gray-500 rounded text-center">
        Enter your input and click Compute to see results.
      </div>
    );
  }
  const efficiencyColor =
    summary.cost_efficiency === 'green'
      ? 'bg-green-100 text-green-800'
      : summary.cost_efficiency === 'yellow'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';
  return (
    <div className="p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-lg font-semibold">Results</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="text-sm text-gray-500">Total Cost (USD)</span>
          <p className="text-xl font-mono">${summary.total_cost_usd.toFixed(6)}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Net Received (USD)</span>
          <p className="text-xl font-mono">${summary.net_received_usd.toFixed(6)}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Predicted Latency</span>
          <p className="text-xl font-mono">{summary.predicted_latency_s} s</p>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Cost Efficiency</span>
          <span className={`inline-block px-2 py-1 rounded ${efficiencyColor}`}>
            {summary.cost_efficiency.toUpperCase()}
          </span>
        </div>
      </div>
      <div>
        <span className="text-sm text-gray-500">Data Sources</span>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {summary.data_sources.map((src) => (
            <li key={src}>{src}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultPanel;