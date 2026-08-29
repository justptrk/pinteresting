import { describe, expect, it } from "vitest";
import { applyJobFilters } from "./filters";
import { parseFilters } from "./parse-filters";
import type { Job } from "./types";

const sample: Job = {
  id: "1",
  title: "1099 Nurse Practitioner",
  company: "Oscar Health",
  url: "https://example.com",
  source: "greenhouse",
  locations: ["New York, New York, United States"],
  states: ["NY"],
  remote: false,
  industries: ["healthtech"],
  engagement: "contract",
  publishedAt: "2026-08-01T00:00:00Z",
  ageDays: 28,
  aging: "15-30",
  pay: { min: 62, max: 92, unit: "hour", label: "$62–$92 / hr" },
  payBand: "75_125_hr",
  payLabel: "$62–$92 / hr",
};

describe("applyJobFilters", () => {
  it("filters by company, aging, and pay together", () => {
    const filters = parseFilters({
      company: "Oscar Health",
      aging: "15-30",
      pay: "75_125_hr",
    });
    expect(applyJobFilters([sample], filters)).toHaveLength(1);
    expect(
      applyJobFilters([sample], { ...filters, company: "Stripe" }),
    ).toHaveLength(0);
  });
});
