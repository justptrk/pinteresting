import { describe, expect, it } from "vitest";
import { detectEngagement, detectIndustries } from "./classify";
import { inTargetRegion, statesFromText } from "./regions";

describe("statesFromText", () => {
  it("maps tri-state language to NY/NJ/CT", () => {
    expect(statesFromText("Tri-state area")).toEqual(["NY", "NJ", "CT"]);
  });

  it("maps Research Triangle to NC", () => {
    expect(statesFromText("Remote - RTP")).toEqual(["NC"]);
  });

  it("maps Northern Virginia to VA", () => {
    expect(statesFromText("Northern Virginia / McLean")).toEqual(["VA"]);
  });
});

describe("detectIndustries", () => {
  it("tags EHR work as healthtech", () => {
    expect(detectIndustries("Senior FHIR engineer for hospital EHR")).toEqual([
      "healthtech",
    ]);
  });

  it("tags payments work as fintech", () => {
    expect(detectIndustries("Staff engineer, card issuing and ACH")).toEqual([
      "fintech",
    ]);
  });
});

describe("detectEngagement", () => {
  it("treats 1099 titles as contract", () => {
    expect(
      detectEngagement("1099 Nurse Practitioner - Virtual Urgent Care", ""),
    ).toBe("contract");
  });

  it("does not treat provider network contracting as a contract gig", () => {
    expect(
      detectEngagement("Associate, National Provider Contracting", ""),
    ).toBe("full_time");
  });

  it("does not treat smart-contract engineering as a staffing contract", () => {
    expect(
      detectEngagement("Software Engineer - Smart Contract, Bridge", ""),
    ).toBe("unknown");
  });
});

describe("inTargetRegion", () => {
  it("keeps Charlotte offices", () => {
    expect(
      inTargetRegion({ locations: ["Charlotte, North Carolina, United States"] }),
    ).toBe(true);
  });

  it("drops unspecified remote full-time roles", () => {
    expect(
      inTargetRegion({
        locations: ["Remote"],
        isContract: false,
        remoteCountsIfContract: true,
      }),
    ).toBe(false);
  });

  it("keeps remote contract gigs only when a target state is named", () => {
    expect(
      inTargetRegion({
        locations: ["Remote - New York"],
        isContract: true,
        remoteCountsIfContract: true,
      }),
    ).toBe(true);
  });

  it("drops generic remote contract gigs with no target state", () => {
    expect(
      inTargetRegion({
        locations: ["Remote"],
        isContract: true,
        remoteCountsIfContract: true,
      }),
    ).toBe(false);
  });

  it("drops remote contract gigs tied to other cities", () => {
    expect(
      inTargetRegion({
        locations: ["Chicago, US-Remote"],
        isContract: true,
        remoteCountsIfContract: true,
      }),
    ).toBe(false);
  });

  it("keeps a remote contractor when the company is based in the region", () => {
    expect(
      inTargetRegion({
        locations: ["Remote"],
        isContract: true,
        hubStates: ["NY"],
      }),
    ).toBe(true);
  });
});
