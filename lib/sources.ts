import type { Industry } from "./types";

export type GreenhouseBoard = {
  token: string;
  company: string;
  industry: Industry;
};

export const GREENHOUSE_BOARDS: GreenhouseBoard[] = [
  { token: "oscar", company: "Oscar Health", industry: "healthtech" },
  { token: "flatironhealth", company: "Flatiron Health", industry: "healthtech" },
  { token: "stripe", company: "Stripe", industry: "fintech" },
  { token: "sofi", company: "SoFi", industry: "fintech" },
  { token: "affirm", company: "Affirm", industry: "fintech" },
  { token: "betterment", company: "Betterment", industry: "fintech" },
  { token: "mercury", company: "Mercury", industry: "fintech" },
  { token: "robinhood", company: "Robinhood", industry: "fintech" },
  { token: "chime", company: "Chime", industry: "fintech" },
  { token: "coinbase", company: "Coinbase", industry: "fintech" },
  { token: "adyen", company: "Adyen", industry: "fintech" },
];

export const MUSE_LOCATIONS = [
  "New York, NY",
  "Jersey City, NJ",
  "Newark, NJ",
  "Princeton, NJ",
  "Stamford, CT",
  "Hartford, CT",
  "Arlington, VA",
  "McLean, VA",
  "Richmond, VA",
  "Raleigh, NC",
  "Durham, NC",
  "Charlotte, NC",
];
