/**
 * FeatureHookRegistry provides a lightweight extension mechanism.  It
 * allows callers to register optional hooks that run after the core
 * orchestration is complete.  Hooks may be used to implement features
 * such as chain comparison, MEV risk flags or alternate currency
 * outputs without modifying the core orchestrator.  Each hook receives
 * the CostSummary and may return a modified copy.
 */
import { CostSummary } from '../types/CostSummary';

export type FeatureHook = (summary: CostSummary) => CostSummary | void;

export class FeatureHookRegistry {
  private static hooks: FeatureHook[] = [];

  /**
   * Register a hook to be executed after summary aggregation.
   */
  static registerHook(hook: FeatureHook): void {
    this.hooks.push(hook);
  }

  /**
   * Apply all registered hooks to the summary.  Hooks may mutate the
   * summary directly or return a new one.  Hooks are executed in
   * registration order.
   */
  static applyHooks(summary: CostSummary): CostSummary {
    let result = summary;
    for (const hook of this.hooks) {
      const modified = hook(result);
      if (modified) {
        result = modified;
      }
    }
    return result;
  }
}