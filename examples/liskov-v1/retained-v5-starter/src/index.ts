import {bootstrapLiskovRuntime} from '@proof-computer/liskov-runtime';

import {checkExampleDotCom} from './check.js';

const runtime = await bootstrapLiskovRuntime({
  component: 'hello-liskov',
  logging: {mode: 'required'},
  secrets: {mode: 'off'},
});

try {
  await runtime.whenReady();
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
