import React from 'react';
import InputPanel from './InputPanel';
import ResultPanel from './ResultPanel';

/**
 * The App component composes the InputPanel and ResultPanel.  It uses a
 * responsive layout to ensure both panels fit nicely on small
 * viewports.  TailwindCSS classes are used for spacing and typography.
 */
export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-1">Crypto Action Cost Calculator</h1>
        <p className="text-gray-600 text-sm">One screen. The real cost. Every chain.</p>
      </header>
      <main className="w-full max-w-3xl space-y-6">
        <InputPanel />
        <ResultPanel />
      </main>
      <footer className="mt-6 text-xs text-gray-500 text-center">
        Estimates based on public data; use at your own risk.
      </footer>
    </div>
  );
};

export default App;