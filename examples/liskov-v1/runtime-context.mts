import {
  LiskovRuntimeContextRefusedError,
  type BootstrapSlipwayRuntimeHandle,
  type LiskovRuntimeContext,
} from '@proof-computer/liskov-runtime';

// Release-gated v1; call only when the context capability is available.
export async function readJobContext(runtime: BootstrapSlipwayRuntimeHandle): Promise<{
  snapshot: LiskovRuntimeContext | undefined;
  applicationKey: string | undefined;
  jobKey: string | undefined;
  currentCountry: string | null;
}> {
  let snapshot = runtime.context;
  try {
    // One explicit refresh when needed, without a polling/retry loop.
    snapshot = await runtime.refreshRuntimeContext();
  } catch (error) {
    if (!(error instanceof LiskovRuntimeContextRefusedError)) throw error;
    // Keep the previous snapshot. A retryable refusal still performs no retry.
    // The caller may decide to wait and make a new explicit call later.
  }
  const geo = snapshot?.network.geolocation;
  return {
    snapshot,
    applicationKey: snapshot?.application.uid,
    jobKey: snapshot?.job.id,
    currentCountry: geo?.status === 'ready' ? geo.countryCode : null,
  };
}
