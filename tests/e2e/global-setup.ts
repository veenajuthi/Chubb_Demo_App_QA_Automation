/**
 * Ensures the demo stack is reachable before E2E runs.
 * Full stack is expected via Docker Compose (UI :3001, BFF :8090).
 */
async function globalSetup() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001';
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseURL}/login`);
      if (response.ok || response.status === 307) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error(
    `UI not reachable at ${baseURL}. Start the stack (start-infra + start-app) before E2E.`
  );
}

export default globalSetup;
