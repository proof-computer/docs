import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

import {buildReport, ControlledFault} from '../src/report.js';
import * as committed from '../src/variant.js';
import * as a from '../variants/a.js';
import * as b from '../variants/b.js';
import * as c from '../variants/c.js';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('variant A is the committed variant module, byte for byte', () => {
  assert.equal(read('../variants/a.ts'), read('../src/variant.ts'));
  assert.deepEqual({...committed}, {...a});
});

test('A and B differ only in VARIANT and MARKER; C alone sets the fault', () => {
  const aWithBValues = read('../variants/a.ts')
    .replace("= 'A';", "= 'B';")
    .replace("'builder-iteration-a'", "'builder-iteration-b'");
  assert.equal(aWithBValues, read('../variants/b.ts'));
  assert.deepEqual(
    [a.VARIANT, b.VARIANT, c.VARIANT],
    ['A', 'B', 'C'],
  );
  assert.deepEqual(
    [a.MARKER, b.MARKER, c.MARKER],
    ['builder-iteration-a', 'builder-iteration-b', 'builder-iteration-c'],
  );
  assert.deepEqual(
    [a.CONTROLLED_FAULT, b.CONTROLLED_FAULT, c.CONTROLLED_FAULT],
    [false, false, true],
  );
});

test('a configured secret is reported as present, never by value', () => {
  const report = buildReport({
    variant: a.VARIANT,
    marker: a.MARKER,
    controlledFault: a.CONTROLLED_FAULT,
    greeting: 'hello-from-a-literal-variable',
    token: 's3cr3t-value',
  });

  assert.deepEqual(report, {
    variant: 'A',
    marker: 'builder-iteration-a',
    greeting: 'hello-from-a-literal-variable',
    secretConfigured: true,
  });
  assert.ok(!JSON.stringify(report).includes('s3cr3t-value'));
});

test('an undefined or empty token is not configured', () => {
  for (const token of [undefined, '']) {
    const report = buildReport({
      variant: b.VARIANT,
      marker: b.MARKER,
      controlledFault: b.CONTROLLED_FAULT,
      greeting: undefined,
      token,
    });
    assert.equal(report.secretConfigured, false);
  }
});

test('variant C throws the controlled fault without the token', () => {
  let caught: unknown;
  try {
    buildReport({
      variant: c.VARIANT,
      marker: c.MARKER,
      controlledFault: c.CONTROLLED_FAULT,
      greeting: 'hello-from-a-literal-variable',
      token: 's3cr3t-value',
    });
  } catch (error) {
    caught = error;
  }

  assert.ok(caught instanceof ControlledFault);
  assert.equal(caught.message, 'controlled application fault (variant C)');
  assert.ok(!caught.message.includes('s3cr3t-value'));
  assert.ok(!(caught.stack ?? '').includes('s3cr3t-value'));
});

test('the manifest is once-mode with the literal variable and managed secret', () => {
  const manifest = JSON.parse(read('../.liskov/application-manifest.json'));

  assert.equal(manifest.applicationId, 'builder-iteration');
  assert.equal(manifest.execution.mode, 'once');
  assert.deepEqual(manifest.configuration, {
    variables: [
      {source: 'literal', name: 'ITERATION_GREETING', value: 'hello-from-a-literal-variable'},
    ],
    secrets: [
      {
        secretId: 'iteration-token',
        required: true,
        destination: {kind: 'environment', name: 'ITERATION_TOKEN'},
      },
    ],
  });
});
