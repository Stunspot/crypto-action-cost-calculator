import React, { useState } from 'react';
import InputPanel from './InputPanel';
import ResultPanel from './ResultPanel';

export default function App() {
  const [showAbout, setShowAbout] = useState(false);

  // --- ADDED ---
  const [copied, setCopied] = useState(false);
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  // --------------

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 lg:py-12">

        {/* HEADER */}
        <header className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">

            {/* YOUR LOGO */}
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-700/50 overflow-hidden">
              <img
                src="/stun-sigil.svg"
                alt="stunspot sigil"
                className="h-8 w-8 opacity-90"
              />
            </div>

            {/* TITLE + TAGLINE + BADGES */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Crypto Action Cost Calculator
              </h1>

              <p className="mt-1 max-w-xl text-sm text-slate-400">
                Estimate how much you&apos;ll actually lose to gas, slippage, and protocol
                overhead for a single on-chain action. Numbers are approximate, not trading
                quotes.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 font-medium text-slate-200">
                  stunspot × Nova
                </span>
                <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-300">
                  BASI · Vibe Coding · Crypto
                </span>
              </div>
            </div>
          </div>

          {/* SIDE BADGE + ABOUT BUTTON */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex w-fit items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              beta · estimates only
            </span>

            <span className="text-[11px] text-slate-500 text-right max-w-xs">
              Built as a vibe-coded DeFi diagnostic for the BASI community.
              No wallet connection, no execution — just a clean lens on cost.
            </span>

            <button
              type="button"
              onClick={() => setShowAbout(true)}
              className="mt-1 inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-emerald-400/60 hover:text-emerald-200 hover:bg-slate-900/80 transition"
            >
              About this build
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="mt-6 grid flex-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <section aria-label="Inputs">
            <InputPanel />
          </section>
          <section aria-label="Result">
            <ResultPanel />
          </section>
        </main>

        {/* FOOTER */}
        <footer className="mt-6 border-t border-slate-900 pt-3 text-[11px] text-slate-500 space-y-1">
          <p>
            Data from public APIs (gas oracles, price feeds, DEX quotes). Treat
            values as directional only, not execution-grade quotes.
          </p>
          <p>
            Crafted by <span className="font-medium text-slate-300">stunspot</span> with{' '}
            <span className="font-medium text-emerald-300">Nova</span> (GPT-5.1 Thinking),
            under the banner of{' '}
            <span className="font-medium text-slate-300">Collaborative Dynamics</span>.
          </p>
          <p>
            Built for the{' '}
            <span className="font-medium text-slate-300">BASI Vibe Coding</span> contest —
            crypto edition. Let this be a reminder that even the dumbest
            DeFi UX problem becomes fun when you vibe-code with friends.
          </p>

          {/* --- ADDED COPY BUTTON --- */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-200 hover:border-emerald-400/60 hover:text-emerald-200 hover:bg-slate-900/80 transition"
            >
              Copy app link
            </button>
            {copied && (
              <span className="text-[11px] text-emerald-300">
                Copied!
              </span>
            )}
          </div>
          {/* ----------------------- */}

        </footer>
      </div>

      {/* ABOUT MODAL */}
      {showAbout && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowAbout(false)}
            aria-label="Close about dialog"
          />

          {/* Dialog */}
          <div className="relative z-50 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-black/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
                  About this build
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  A small, opinionated diagnostic surfaced as a web app for the BASI
                  community&apos;s vibe coding contest.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAbout(false)}
                className="rounded-full bg-slate-900 px-2 py-1 text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs text-slate-300">
              <p>
                <span className="font-medium text-slate-100">What this is:</span>{' '}
                a lens on the &quot;real&quot; cost of touching your tokens. You say
                what you want to do; it shows you how much gets shaved off by gas,
                slippage, and protocol overhead, in plain USD.
              </p>

              <p>
                <span className="font-medium text-slate-100">Who made it:</span>{' '}
                <span className="font-medium text-slate-100">stunspot</span>{' '}
                partnering with <span className="text-emerald-300 font-medium">Nova</span>{' '}
                (his snarky Assistant prompt-cum-Sidekick), under the
                <span className="font-medium text-slate-100"> Collaborative Dynamics</span>{' '}
                banner.
              </p>

              <p>
                <span className="font-medium text-slate-100">Why it exists:</span>{' '}
                as an entry for the BASI server&apos;s{' '}
                <span className="font-medium text-slate-100">Vibe Coding – Crypto</span>{' '}
                challenge. The brief: build a crypto-themed web app that actually has
                a point, and get it running even if you&apos;re not a full-time dev (which... stun REALLY is NOT! Don't get me started! 🙄).
              </p>

              <p>
                <span className="font-medium text-slate-100">What it is not:</span>{' '}
                this is not a trading interface, wallet, or &quot;alpha&quot; engine. It
                doesn&apos;t execute anything. It&apos;s a thinking tool — a way to get an
                honest, directional sense of how expensive a move is before you bother
                opening a DEX.
              </p>

              <p className="text-slate-400">
                If this app made your next on-chain decision even a little less of a
                guess, that&apos;s a win.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
