import type { Industry, RegionState } from "./types";

export type GreenhouseBoard = {
  token: string;
  company: string;
  industry: Industry;
  hubStates: RegionState[];
};

export const GREENHOUSE_BOARDS: GreenhouseBoard[] = [
  {
    token: "oscar",
    company: "Oscar Health",
    industry: "healthtech",
    hubStates: ["NY"],
  },
  {
    token: "flatironhealth",
    company: "Flatiron Health",
    industry: "healthtech",
    hubStates: ["NY"],
  },
  {
    token: "stripe",
    company: "Stripe",
    industry: "fintech",
    hubStates: ["NY"],
  },
  {
    token: "sofi",
    company: "SoFi",
    industry: "fintech",
    hubStates: ["NY"],
  },
  {
    token: "affirm",
    company: "Affirm",
    industry: "fintech",
    hubStates: ["NY"],
  },
  {
    token: "betterment",
    company: "Betterment",
    industry: "fintech",
    hubStates: ["NY"],
  },
  {
    token: "mercury",
    company: "Mercury",
    industry: "fintech",
    hubStates: [],
  },
  {
    token: "robinhood",
    company: "Robinhood",
    industry: "fintech",
    hubStates: ["NY"],
  },
  {
    token: "chime",
    company: "Chime",
    industry: "fintech",
    hubStates: [],
  },
  {
    token: "coinbase",
    company: "Coinbase",
    industry: "fintech",
    hubStates: ["NY"],
  },
  {
    token: "adyen",
    company: "Adyen",
    industry: "fintech",
    hubStates: ["NY"],
  },
];

export const MUSE_LOCATIONS = [
  "New York, NY",
  "Albany, NY",
  "White Plains, NY",
  "Jersey City, NJ",
  "Newark, NJ",
  "Hoboken, NJ",
  "Princeton, NJ",
  "Stamford, CT",
  "Hartford, CT",
  "Greenwich, CT",
  "New Haven, CT",
  "Arlington, VA",
  "McLean, VA",
  "Richmond, VA",
  "Norfolk, VA",
  "Alexandria, VA",
  "Reston, VA",
  "Raleigh, NC",
  "Durham, NC",
  "Chapel Hill, NC",
  "Charlotte, NC",
  "Greensboro, NC",
];

export const MUSE_PAGES = [0, 1, 2];
