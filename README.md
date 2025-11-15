# Crypto Action Cost Calculator (CACC)

**One screen. The real cost. Every chain.**

This repository contains the source code for the Crypto Action Cost Calculator (CACC).  
CACC is a lightweight single‑page application designed to demystify the true cost of on‑chain actions such as swaps, transfers, bridges, mints and stakes across multiple blockchains.  
By aggregating gas costs, slippage estimates, price impact, network latency and the final net amount received, CACC delivers a unified, trustworthy view of what your transaction will *actually* cost.

The project is organised into a modular TypeScript/React codebase with a clear separation of concerns.  
Fetchers obtain raw data from public APIs, normalisers translate heterogeneous payloads into a canonical form, processors derive higher‑level costs, and an orchestrator coordinates the entire flow.  
A simple UI built with React and TailwindCSS ties everything together, providing an intuitive interface for users.

## Features

* **Cross‑chain:** Out‑of‑the‑box support for major chains and an extensible configuration system for adding more.
* **Action aware:** Calculates costs for swaps, transfers, bridges, mints and stakes.
* **Transparency:** Shows the source and age of each datapoint.  
  Provides a confidence score and colour‑coded efficiency indicator.
* **Extensible:** The core modules are hook‑based.  
  New features (e.g. MEV risk flags) can be added without touching the core orchestrator.
* **Offline friendly:** Caches results for 60 seconds to avoid refetching on repeated inputs.
* **Unit & integration tests:** A basic test suite validates the math and orchestration logic.  
  Additional tests can be added under `tests/` to improve coverage.

## Getting Started

### Prerequisites

* Node.js (≥ 18)
* npm (≥ 9) or pnpm/yarn

### Install

```bash
git clone https://github.com/yourname/crypto-action-cost-calculator.git
cd crypto-action-cost-calculator
npm install
```

### Running in Development

```bash
# start development server with hot reloading
npm run dev
```

The application will be available at <http://localhost:5173> by default.

### Building for Production

```bash
npm run build
```

This will emit a production build into the `dist/` directory.  You can preview the built files locally using:

```bash
npm run preview
```

### Running Tests

```bash
npm run test
```

The test suite uses [Vitest](https://vitest.dev/) for unit and integration tests.

### Environment Variables

Some external APIs may require API keys.  To configure these, create a `.env` file in the project root based on the provided `.env.example` file.

```bash
cp .env.example .env
# edit .env to add your API keys
```

## Repository Layout

The repository adheres to a layered, modular structure described in `docs/architecture.md`.  A brief overview:

```
crypto-action-cost-calculator/
├─ docs/                # Documentation and design artefacts
├─ src/
│   ├─ modules/         # Fetchers, processors, normalisers and orchestrator
│   ├─ types/           # Shared TypeScript interfaces
│   ├─ ui/              # React components
│   ├─ state/           # Global stores (Zustand)
│   └─ index.tsx        # Entrypoint
├─ tests/
│   ├─ unit/
│   └─ integration/
├─ public/              # Static assets
├─ proxy/               # (Optional) proxy functions for secure API keys
├─ package.json         # Project metadata & scripts
├─ tsconfig.json        # TypeScript configuration
├─ vitest.config.ts     # Test configuration
└─ .env.example         # Example environment variables
```

## Contributing

Contributions and feedback are welcome!  Please open an issue or submit a pull request with your improvements.  We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification and require tests for new functionality.

## License

This project is licensed under the MIT License.  See `LICENSE` for details.