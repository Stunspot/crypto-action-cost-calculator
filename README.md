# Crypto Action Cost Calculator (CACC)

> “If I do this on-chain thing, how much money do I actually lose?”

CACC is a small, self-contained tool that estimates the **all-in cost** of a single crypto action on a chosen EVM chain, expressed in **plain USD terms**.

It is **not** a trading interface, and it doesn’t touch your wallet. It just tells you, roughly:

- how much you’ll pay in **gas**
- how much you’ll lose to **slippage**
- what your **total cost** is in USD
- how much you **effectively keep** after those costs
- how long the transaction is **likely** to take

All numbers are **estimates** based on public APIs and simple heuristics. Think “ballpark sanity check,” not “execution-grade quoting engine.”

---

## What it actually does today

For a given **chain**, **token**, **action**, and **amount**, CACC:

1. **Fetches live data** from public APIs
   - **Token price (USD)** via CoinGecko
   - **Gas price** via chain-specific gas APIs (e.g. Etherscan) or a sane default
   - **Swap quote & slippage** via 0x Swap API *when available* (otherwise uses a small default slippage)
2. **Normalizes everything** into a `CostDatum`:
   - notional size in USD
   - gas cost in native token + USD
   - estimated slippage cost
   - simple protocol fee field (currently usually zero / default)
   - a rough latency estimate in seconds
3. **Processes the raw data** into human-meaningful pieces:
   - **Total Cost (USD)** = gas + slippage + protocol fee
   - **Net Received (USD)** = notional – total cost (floored at 0)
   - **Predicted Latency (s)** = chain block time × a small congestion factor
   - **Cost Efficiency** band:
     - **Green**: cost < 1% of notional
     - **Yellow**: 1–5%
     - **Red**: > 5%
4. **Shows the result** in a simple UI:
   - inputs on the left (chain, token, action, amount)
   - result card on the right
   - data sources used (e.g. “coingecko”, “etherscan”, “0x”, or “static-fallback”)

---

## What it does *not* do (yet)

To keep things honest, here are things the codebase is architected for, but which are **not implemented as full features**:

- ❌ No MEV risk scores or “MEV safety” flags  
- ❌ No automatic “best chain” recommendation or side-by-side comparison view  
- ❌ No per-protocol fee breakdown (beyond simple fields in the cost model)  
- ❌ No detailed bridge modeling (bridges are treated similarly to other actions)  
- ❌ No multi-hop route inspection or DEX-by-DEX comparison

Some of these are sketched in comments, docs, or internal types, but they’re **not wired up to the UI** and should be treated as **future ideas**, not active features.

---

## Supported chains

CACC currently supports a small set of EVM-compatible chains (as defined in `CommonTypes.ts` and `ConfigProvider.ts`), for example:

- Ethereum mainnet
- Popular L2 / sidechains (e.g. Arbitrum, Optimism, Polygon, etc.)

> Note: Bitcoin is not supported. The cost model and APIs are built for EVM-style chains where “gas”, “slippage on a DEX”, and “swap” all have consistent meanings.

---

## How to run it locally

Prerequisites:

- Node.js (LTS)
- npm

Clone and run:

```bash
git clone https://github.com/Stunspot/crypto-action-cost-calculator.git
cd crypto-action-cost-calculator
npm install
npm run dev
````

Then open the printed `http://localhost:5173/` URL in your browser.

Run tests:

```bash
npm run test
```

---

## Usage: interpreting the numbers

1. **Pick a chain, token, action, and amount**

   * Example: `ethereum`, `ETH`, `swap`, `1.0`

2. **Hit “Compute”**

3. Read:

* **Total Cost (USD)**

  > Rough estimate of how much you’re paying to the chain and the protocols for this single action.

* **Net Received (USD)**

  > Approximate amount you effectively “keep” after fees.

* **Cost Efficiency**

  > Quick color band to show if this cost is small, moderate, or large relative to the trade size.

* **Predicted Latency**

  > Ballpark confirmation time based on chain block time and a simple congestion multiplier.

* **Data Sources**

  > Which APIs and fallbacks contributed (e.g. live gas oracle vs static default).

---

## Limitations & disclaimers

* This is **not** a trading or execution engine.
* Quotes are **not binding**, and real execution prices/fees will differ.
* All external data comes from public APIs which may:

  * change behavior
  * rate limit
  * be temporarily unavailable
* The math is deliberately simple and transparent:

  * Better to be roughly right and explainable than “black box accurate.”
* Treat CACC as an **intuition aid**, not an oracle.

---

## Future ideas (clearly not implemented yet)

These are possible next steps, not promises:

* Chain comparison view: “How much would this cost on each chain?”
* Explicit protocol fee modeling per aggregator
* MEV risk heuristics and warnings
* More action-aware modeling (bridge vs stake vs transfer)
* More chains and token metadata

If you’re reading this and want to help implement any of them, you’re more than welcome to open issues or PRs.

