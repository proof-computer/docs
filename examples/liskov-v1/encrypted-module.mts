import type { BootstrapSlipwayRuntimeHandle } from "@proof-computer/liskov-runtime";

export async function start(runtime: BootstrapSlipwayRuntimeHandle): Promise<void> {
  await runtime.diagnostics.report({
    stage: "application.completed",
    status: "succeeded",
    code: "work_completed"
  });
  runtime.stop();
}
