import { describe, expect, it } from "vitest";
import { extractPay, payBandFromPay } from "./pay";

describe("extractPay", () => {
  it("reads hourly ranges", () => {
    expect(extractPay("Pay: $62-$92 / hr depending on shift")).toEqual({
      min: 62,
      max: 92,
      unit: "hour",
      label: "$62–$92 / hr",
    });
  });

  it("reads annual ranges", () => {
    const pay = extractPay("Salary $140,000 – $180,000 per year plus bonus");
    expect(pay).toMatchObject({ min: 140000, max: 180000, unit: "year" });
    expect(payBandFromPay(pay)).toBe("salary_posted");
  });

  it("bands contractor rates by the hour", () => {
    expect(
      payBandFromPay({
        min: 62,
        max: 92,
        unit: "hour",
        label: "$62–$92 / hr",
      }),
    ).toBe("75_125_hr");
  });

  it("treats bare mid-range dollars as hourly", () => {
    expect(extractPay("Compensation $62-$92 depending on shift")).toEqual({
      min: 62,
      max: 92,
      unit: "hour",
      label: "$62–$92 / hr",
    });
  });

  it("ignores small dollar amounts without a pay unit", () => {
    expect(extractPay("We have $31 in petty cash and 12 offices")).toBeNull();
  });
});
