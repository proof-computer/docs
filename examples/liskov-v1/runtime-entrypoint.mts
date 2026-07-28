import {bootstrapSlipwayRuntime} from '@proof-computer/liskov-runtime';

async function runWorker(input: {
  endpoint: string;
  apiToken: string;
}): Promise<void> {
  await fetch(input.endpoint, {
    headers: {authorization: `Bearer ${input.apiToken}`},
  });
}

const runtime = await bootstrapSlipwayRuntime({
  component: 'worker',
  revision: process.env.APP_REVISION,
  secrets: {mode: 'required'},
  logging: {mode: 'background'},
});

try {
  await runtime.whenReady();

  const endpoint = runtime.env.require('API_ENDPOINT');
  const apiToken = runtime.env.require('API_TOKEN');

  await runtime.log('worker.ready', {endpoint});
  await runWorker({endpoint, apiToken});
} catch (error) {
  await runtime.diagnostics.fatal({
    kind: 'explicit',
    code: 'application_failed',
    component: 'worker',
    error,
  });
  throw error;
} finally {
  await runtime.flush();
  runtime.stop();
}
