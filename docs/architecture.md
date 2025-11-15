<!--
  This file is a near‑verbatim copy of the system design blueprint provided by the
  product architect.  It documents the guiding principles, module map and
  non‑functional requirements for the Crypto Action Cost Calculator (CACC).
  Whenever adding features or refactoring the codebase, please revisit this
  blueprint to ensure alignment with the original intent.

> **Note:** This document describes the *target* architecture and feature set.
> The current implementation (MVP) only ships the single-action cost calculator:
> - live gas + price + slippage where available  
> - per-chain estimates for a single input  
> - no MEV modeling, chain comparison UI, or advanced fee analytics yet.
>
> Treat everything else here as roadmap / design intent, not current behavior.

-->

# 🧭 Crypto Action Cost Calculator (CACC) System Design Blueprint v1.2

**Title:** Crypto Action Cost Calculator (CACC)  
**Tagline:** “One screen. The real cost. Every chain.”  
**Architect:** Egdod the Designer

---

## 1. Executive Overview

CACC is a compact, single‑page crypto utility that unifies all the scattered,
inconsistent cost signals across chains, wallets, DEXs and explorers into one
clean, universal “true cost” readout.  It demystifies gas, slippage, latency,
price impact and net‑received amounts for any on‑chain action — swap, bridge,
transfer, mint, stake — using live public APIs and a simple, elegant UI.

---

## 2. Context & Genesis

Crypto UX is fragmented.  Every platform displays cost differently, hides
fees differently, calculates slippage differently, and portrays latency with
wildly different metaphors (blocks, seconds, “soon”).  Users flip between
multiple tabs to understand the real cost of a single action.  This tool
emerges from the friction audit of that ecosystem: it collapses the messy
landscape into one consistent surface.

---

## 3. Structural Framework

**Inputs**

* Chain selector
* Token selector
* Action type (swap / transfer / bridge / mint / stake / withdraw)
* Amount field

**Data Fetching Layers**

1. **Gas Estimation:** via public chain RPC or gas‑tracker APIs
2. **Price Impact / Slippage:** via DEX aggregator APIs (0x, 1inch, Jupiter, etc.)
3. **Latency Model:** via static chain table and congestion multipliers
4. **Net Received Calculator:** combines gas, swap fee, slippage, MEV buffer, protocol fee

**Outputs**

* Gas cost (native + USD)
* Slippage estimate
* Price impact
* Total cost in USD
* Predicted confirmation time
* Net received amount
* Context cue: green/yellow/red cost efficiency indicator

---

## 4. Module Map

| Layer   | Module                 | Purpose                               |
|:------- |:-----------------------|:---------------------------------------|
| UI      | **InputPanel**         | Gather chain, token, action, amount    |
| UI      | **ResultPanel**        | Display computed costs and latency     |
| Core    | **Orchestrator**       | Manage concurrent fetches & processors |
| Fetch   | **GasFetcher**         | Retrieve gas data                      |
| Fetch   | **PriceFetcher**       | Token and currency pricing             |
| Fetch   | **DEXQuoteFetcher**    | Slippage, swap fee, impact data        |
| Fetch   | **LatencyFetcher**     | Block time + congestion info           |
| Normalize | **DataNormalizer**   | Canonicalise all fetched data          |
| Process | **CostProcessor**      | Compute gas cost (native + USD)        |
| Process | **SlippageProcessor**  | Compute slippage % & impact            |
| Process | **LatencyProcessor**   | Predict confirmation time              |
| Process | **NetReceivedProcessor** | Combine all cost components        |
| Aggregate | **ResultAggregator** | Merge processor results → report       |
| Support | **CacheManager**       | Short‑term API caching                 |
| Support | **ErrorHandler**       | Convert exceptions → UI feedback       |
| Support | **ConfigProvider**     | Static chain & token metadata          |
| Extension | **FeatureHookRegistry** | Manage optional plug‑ins            |

Refer to the original brief for details on concurrency, non‑functional
requirements, error handling and extension points.

---

## 5. Non‑Functional Requirements

| Category             | Target                        |
| :------------------- | :---------------------------- |
| Response Latency     | ≤ 300 ms median, ≤ 800 ms p95 |
| Data Freshness       | ≤ 60 s for gas/price data     |
| Uptime               | 99.5 %                        |
| Cache TTL            | 60 s                          |
| Test Coverage        | ≥ 85 %                        |

---

This document serves as the overarching design reference for CACC.  For
implementation specifics, see the source files under `src/` and the unit
tests under `tests/`.