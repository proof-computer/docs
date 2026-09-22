export interface ReportInput {
  variant: 'A' | 'B' | 'C';
  marker: string;
  controlledFault: boolean;
  greeting: string | undefined;
  token: string | undefined;
}

export interface IterationReport {
  [key: string]: unknown;
  variant: 'A' | 'B' | 'C';
  marker: string;
  greeting: string | undefined;
  secretConfigured: boolean;
}

export class ControlledFault extends Error {
  constructor() {
    super('controlled application fault (variant C)');
    this.name = 'ControlledFault';
  }
}

// The token decides only whether the secret was configured. Neither it nor its
// length is returned or written into an error.
export function buildReport(input: ReportInput): IterationReport {
  if (input.controlledFault) {
    throw new ControlledFault();
  }

  return {
    variant: input.variant,
    marker: input.marker,
    greeting: input.greeting,
    secretConfigured: input.token !== undefined && input.token.length > 0,
  };
}
