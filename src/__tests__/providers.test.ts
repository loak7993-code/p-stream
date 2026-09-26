/**
 * Regression tests for the ecosystem breakage that killed the original project:
 * the `@p-stream/providers` package was removed from GitHub (DMCA, 2026-03-17),
 * which made every `pnpm install && pnpm build` fail.
 *
 * These tests fail loudly if the providers dependency ever goes missing again.
 */
import * as providers from "@p-stream/providers";
import { describe, expect, it } from "vitest";

describe("@p-stream/providers (restored dependency)", () => {
  it("is installed and resolvable", () => {
    expect(Object.keys(providers).length).toBeGreaterThan(0);
    expect(providers.flags).toBeTruthy();
  });

  it("exposes the provider factory and built-in sources/embeds", () => {
    expect(typeof providers.makeProviders).toBe("function");
    expect(typeof providers.buildProviders).toBe("function");
    expect(typeof providers.getBuiltinSources).toBe("function");
    expect(typeof providers.getBuiltinEmbeds).toBe("function");
    expect(typeof providers.getBuiltinExternalSources).toBe("function");
    expect(typeof providers.makeSimpleProxyFetcher).toBe("function");
    expect(typeof providers.makeStandardFetcher).toBe("function");
  });

  it("ships a non-empty set of built-in sources and embeds", () => {
    expect(providers.getBuiltinSources().length).toBeGreaterThan(0);
    expect(providers.getBuiltinEmbeds().length).toBeGreaterThan(0);
  });

  it("can build a default providers stack", () => {
    const stack = providers.makeProviders({
      fetcher: providers.makeStandardFetcher(fetch),
      target: providers.targets.BROWSER,
    }) as { listSources: () => unknown[]; listEmbeds: () => unknown[] };
    expect(stack).toBeTruthy();
    expect(stack.listSources().length).toBeGreaterThan(0);
    expect(stack.listEmbeds().length).toBeGreaterThan(0);
  });
});
