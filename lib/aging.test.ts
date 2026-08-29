import { describe, expect, it } from "vitest";
import { ageInDays, agingBucket } from "./aging";

describe("aging", () => {
  const now = Date.parse("2026-08-29T00:00:00Z");

  it("counts whole days open", () => {
    expect(ageInDays("2026-08-15T00:00:00Z", now)).toBe(14);
    expect(agingBucket(14)).toBe("8-14");
  });

  it("marks missing dates as unknown", () => {
    expect(ageInDays(null, now)).toBeNull();
    expect(agingBucket(null)).toBe("unknown");
  });

  it("buckets stale roles", () => {
    expect(agingBucket(61)).toBe("61+");
  });
});
