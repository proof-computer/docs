import {bootstrapLiskovRuntime} from '@proof-computer/liskov-runtime';

import {buildReport, ControlledFault} from './report.js';
import {CONTROLLED_FAULT, MARKER, VARIANT} from './variant.js';

async function main(): Promise<void> {
  const runtime = await bootstrapLiskovRuntime({
    component: 'builder-iteration',
    logging: {mode: 'required'},
    secrets: {mode: 'required'},
  });

  try {
    await waitUntilReady(runtime);
    const report = buildReport({
      variant: VARIANT,
      marker: MARKER,
      controlledFault: CONTROLLED_FAULT,
      greeting: runtime.env.get('ITERATION_GREETING'),
      token: process.env.ITERATION_TOKEN,
    });
    await runtime.log('iteration.completed', report, {
      severity: 'info',
      labels: {component: 'builder-iteration'},
    });
  } catch (error) {
    await runtime.diagnostics.fatal({
      kind: 'explicit',
      code: error instanceof ControlledFault ? 'iteration_controlled_fault' : 'iteration_failed',
      component: 'builder-iteration',
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
