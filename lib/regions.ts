import type { RegionState } from "./types";

export const TARGET_STATES: RegionState[] = ["NY", "NJ", "CT", "VA", "NC"];

export const STATE_LABELS: Record<RegionState, string> = {
  NY: "New York",
  NJ: "New Jersey",
  CT: "Connecticut",
  VA: "Virginia",
  NC: "North Carolina",
};

const STATE_NAME_TO_CODE: Record<string, RegionState> = {
  "new york": "NY",
  ny: "NY",
  "new jersey": "NJ",
  nj: "NJ",
  connecticut: "CT",
  ct: "CT",
  virginia: "VA",
  va: "VA",
  "north carolina": "NC",
  nc: "NC",
};

const CITY_TO_STATE: Record<string, RegionState> = {
  manhattan: "NY",
  brooklyn: "NY",
  queens: "NY",
  bronx: "NY",
  "staten island": "NY",
  nyc: "NY",
  "new york city": "NY",
  "new york": "NY",
  buffalo: "NY",
  albany: "NY",
  rochester: "NY",
  syracuse: "NY",
  "white plains": "NY",
  westchester: "NY",
  "long island": "NY",
  "jersey city": "NJ",
  hoboken: "NJ",
  newark: "NJ",
  princeton: "NJ",
  morristown: "NJ",
  "jersey shore": "NJ",
  stamford: "CT",
  greenwich: "CT",
  hartford: "CT",
  "new haven": "CT",
  norwalk: "CT",
  danbury: "CT",
  arlington: "VA",
  mclean: "VA",
  tysons: "VA",
  "tysons corner": "VA",
  reston: "VA",
  herndon: "VA",
  fairfax: "VA",
  alexandria: "VA",
  richmond: "VA",
  norfolk: "VA",
  "virginia beach": "VA",
  "newport news": "VA",
  charlottesville: "VA",
  "falls church": "VA",
  vienna: "VA",
  dulles: "VA",
  "northern virginia": "VA",
  nova: "VA",
  raleigh: "NC",
  durham: "NC",
  "chapel hill": "NC",
  cary: "NC",
  morrisville: "NC",
  charlotte: "NC",
  greensboro: "NC",
  "winston-salem": "NC",
  wilmington: "NC",
  asheville: "NC",
  rtp: "NC",
  "research triangle": "NC",
  "research triangle park": "NC",
};

const CITY_PATTERN = new RegExp(
  `\\b(${Object.keys(CITY_TO_STATE)
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "i",
);

export function isRemoteLocation(value: string): boolean {
  return /\bremote\b|work from home|\bwfh\b|flexible \/ remote|anywhere/i.test(
    value,
  );
}

export function statesFromText(value: string): RegionState[] {
  const found = new Set<RegionState>();
  const lower = value.toLowerCase();

  if (
    /\btri-?state\b/.test(lower) ||
    /\bnyc metro\b/.test(lower) ||
    /\bnew york metro\b/.test(lower)
  ) {
    found.add("NY");
    found.add("NJ");
    found.add("CT");
  }

  if (/\bnorthern virginia\b|\bnova\b|\bdmv\b/.test(lower)) {
    found.add("VA");
  }

  if (/\bresearch triangle\b|\brtp\b/.test(lower)) {
    found.add("NC");
  }

  const stateName = lower.match(
    /\b(new york|new jersey|north carolina|connecticut|virginia)\b/g,
  );
  for (const name of stateName ?? []) {
    const code = STATE_NAME_TO_CODE[name];
    if (code) found.add(code);
  }

  const codes = value.match(/\b(NY|NJ|CT|VA|NC)\b/g);
  for (const code of codes ?? []) {
    found.add(code as RegionState);
  }

  const cityMatch = lower.match(CITY_PATTERN);
  if (cityMatch) {
    const city = cityMatch[1].toLowerCase();
    const state = CITY_TO_STATE[city];
    if (state) found.add(state);
  }

  return TARGET_STATES.filter((state) => found.has(state));
}

export function classifyLocations(locations: string[]): {
  states: RegionState[];
  remote: boolean;
} {
  const remote = locations.some(isRemoteLocation);
  const states = new Set<RegionState>();
  for (const location of locations) {
    for (const state of statesFromText(location)) {
      states.add(state);
    }
  }
  return { states: TARGET_STATES.filter((state) => states.has(state)), remote };
}

export function inTargetRegion(input: {
  locations: string[];
  extraText?: string;
  remoteCountsIfContract?: boolean;
  isContract?: boolean;
}): boolean {
  const { states, remote } = classifyLocations(input.locations);
  if (states.length > 0) return true;

  const extraStates = statesFromText(input.extraText ?? "");
  if (extraStates.length > 0 && (remote || input.isContract)) return true;

  return false;
}
