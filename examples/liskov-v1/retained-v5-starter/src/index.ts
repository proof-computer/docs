import {bootstrapLiskovRuntime} from '@proof-computer/liskov-runtime';

import {checkExampleDotCom} from './check.js';

async function main(): Promise<void> {
  const runtime = await bootstrapLiskovRuntime({
    component: 'hello-liskov',
    logging: {mode: 'required'},
    secrets: {mode: 'background'},
  });

  try {
    await waitUntilReady(runtime);
    const result = await checkExampleDotCom();
    await runtime.log('starter.fetch.completed', result, {
      severity: 'info',
      labels: {component: 'hello-liskov'},
    });
  } catch (error) {
    await runtime.diagnostics.fatal({
      kind: 'explicit',
      code: 'starter_fetch_failed',
      component: 'hello-liskov',
      error,
    });
    throw error;
  } finally {
    await runtime.flush();
    runtime.stop();
  }
}

// Managed log configuration can arrive after bootstrap. This check is bounded
// and never sends customer data before the runtime is ready.
async function waitUntilReady(runtime: {whenReady(): Promise<unknown>}): Promise<void> {
  const deadline = Date.now() + 40_000;
  for (;;) {
    try {
      await runtime.whenReady();
      return;
    } catch (error) {
      if (Date.now() >= deadline) throw error;
      await new Promise(resolve => setTimeout(resolve, 1_000));
    }
  }
}

void main().catch(() => { process.exitCode = 1; });
