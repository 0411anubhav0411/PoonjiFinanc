import { describe, expect, it } from "vitest";
import { normalizeApiBase, apiUrl } from "./api";

describe("apiUrl normalization", () => {
  it("keeps a clean origin untouched", () => {
    expect(normalizeApiBase("https://api.poonjifinance.com")).toBe("https://api.poonjifinance.com");
  });

  it("removes an accidental /api suffix", () => {
    expect(normalizeApiBase("https://api.poonjifinance.com/api")).toBe("https://api.poonjifinance.com");
  });

  it("builds a correct login route from a clean base", () => {
    expect(apiUrl("/auth/login", "https://api.poonjifinance.com")).toBe("https://api.poonjifinance.com/api/auth/login");
  });

  it("builds a correct login route when the base already includes /api", () => {
    expect(apiUrl("/auth/login", "https://api.poonjifinance.com/api")).toBe("https://api.poonjifinance.com/api/auth/login");
  });
});
