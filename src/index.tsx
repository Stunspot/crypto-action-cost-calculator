import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './ui/App';
import './index.css';

/**
 * Entrypoint for the CACC application.  It creates a React root and
 * renders the App component into the #root element defined in
 * public/index.html.  The index.css file pulls in TailwindCSS
 * directives, which are processed by Vite at build time.
 */
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);