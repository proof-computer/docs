import assert from 'node:assert/strict';
import test from 'node:test';

import {CHECK_URL, checkExampleDotCom} from '../src/check.js';

test('records only the harmless status result from example.com', async () => {
  const calls: string[] = [];
  const fetchImpl: typeof fetch = async (input) => {
    calls.push(String(input));
    return new Response('<h1>ignored</h1>', {status: 200});
  };

  const result = await checkExampleDotCom(fetchImpl);

  assert.deepEqual(calls, [CHECK_URL]);
  assert.deepEqual(result, {host: 'example.com', ok: true, status: 200});
});

test('refuses a non-success response', async () => {
  const fetchImpl: typeof fetch = async () => new Response(null, {status: 503});

  await assert.rejects(checkExampleDotCom(fetchImpl), /example\.com returned HTTP 503/u);
});
