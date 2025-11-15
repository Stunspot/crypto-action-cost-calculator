/**
 * ErrorHandler centralises error handling logic for fetchers.  It exposes
 * helper methods to unwrap results of `Promise.allSettled()` calls,
 * providing fallback values when a promise is rejected or returns
 * undefined.  It also annotates confidence scores on the CostDatum but
 * this simplified implementation does not adjust confidence.
 */
export class ErrorHandler {
  /**
   * Unwrap the result of a settled promise.  If the promise was
   * fulfilled, return its value; otherwise return the provided fallback.
   */
  static unwrapFetchResult<T>(
    result: PromiseSettledResult<T>,
    fallback: T
  ): T {
    if (result.status === 'fulfilled' && result.value !== undefined) {
      return result.value;
    }
    return fallback;
  }
}