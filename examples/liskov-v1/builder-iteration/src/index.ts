import {bootstrapLiskovRuntime} from '@proof-computer/liskov-runtime';

import {buildReport, ControlledFault} from './report.js';
import {CONTROLLED_FAULT, MARKER, VARIANT} from './variant.js';

const runtime = await bootstrapLiskovRuntime({
  component: 'builder-iteration',
  logging: {mode: 'required'},
  secrets: {mode: 'required'},
});

try {
  await runtime.whenReady();
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
