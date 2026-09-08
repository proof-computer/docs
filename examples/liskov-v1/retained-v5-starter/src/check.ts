export const CHECK_URL = 'https://example.com/';

export interface CheckResult {
  [key: string]: unknown;
  host: string;
  ok: boolean;
  status: number;
}

export async function checkExampleDotCom(fetchImpl: typeof fetch = fetch): Promise<CheckResult> {
  const response = await fetchImpl(CHECK_URL, {
    headers: {accept: 'text/html'},
  });
  const result = {
    host: new URL(CHECK_URL).hostname,
    ok: response.ok,
    status: response.status,
  };

  if (!result.ok) {
    throw new Error(`example.com returned HTTP ${result.status}`);
  }

  return result;
}
