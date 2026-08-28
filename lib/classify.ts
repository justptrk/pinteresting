import type { Engagement, Industry } from "./types";

const HEALTHTECH_RE =
  /\b(healthtech|health tech|digital health|healthcare|health care|ehr|emr|fhir|hipaa|hl7|telehealth|telemedicine|medtech|biotech|clinical workflow|payer|provider network|prior auth|pharmacy benefit|electronic health|patient portal|hospital (it|software|systems)|medical device)\b/i;

const FINTECH_RE =
  /\b(fintech|payments?|neobank|challenger bank|digital bank|lending|underwriting|wealthtech|insurtech|brokerage|trading platform|card issuing|ach|kyc|aml|treasury|core banking|credit card|debit card|open banking|bnpl|buy now pay later)\b/i;

const CONTRACT_RE =
  /\b(1099|c2c|corp[ -]?to[ -]?corp|contract-to-hire|\bc2h\b|w-?2 contract|contract(?:or|ors)?|temporary|temp-to-hire|fixed[ -]term)\b/i;

const CONTRACTING_NOISE_RE =
  /\b(network contracting|provider contracting|vendor contract|contracting & services|contracting and services|national provider contracting)\b/i;

export function detectIndustries(
  text: string,
  companyIndustries: Industry[] = [],
): Industry[] {
  const found = new Set<Industry>(companyIndustries);
  if (HEALTHTECH_RE.test(text)) found.add("healthtech");
  if (FINTECH_RE.test(text)) found.add("fintech");
  return [...found];
}

export function detectEngagement(title: string, text: string): Engagement {
  const blob = `${title}\n${text}`;
  if (CONTRACTING_NOISE_RE.test(blob) && !/\b1099\b|\bc2c\b/.test(blob)) {
    return "full_time";
  }
  if (CONTRACT_RE.test(title)) return "contract";
  if (CONTRACT_RE.test(blob) && !CONTRACTING_NOISE_RE.test(blob)) {
    return "contract";
  }
  return "unknown";
}

export function normalizeKey(company: string, title: string): string {
  return `${company.trim().toLowerCase()}::${title.trim().toLowerCase()}`;
}
