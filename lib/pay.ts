export type PayUnit = "hour" | "year";

export type Pay = {
  min: number;
  max: number;
  unit: PayUnit;
  label: string;
};

export type PayBand =
  | "unknown"
  | "under_150k"
  | "150_250k"
  | "over_250k";

export const PAY_BAND_LABELS: Record<PayBand, string> = {
  unknown: "Pay not posted",
  under_150k: "Under $150k",
  "150_250k": "$150k–$250k",
  over_250k: "$250k+",
};

function parseAmount(raw: string): number {
  const compact = raw.replace(/,/g, "").toLowerCase();
  const value = Number.parseFloat(compact.replace(/k$/, ""));
  if (Number.isNaN(value)) return Number.NaN;
  return compact.endsWith("k") ? value * 1000 : value;
}

function annualize(amount: number, unit: PayUnit): number {
  return unit === "hour" ? amount * 2000 : amount;
}

export function payBandFromPay(pay: Pay | null): PayBand {
  if (!pay) return "unknown";
  const mid = annualize((pay.min + pay.max) / 2, pay.unit);
  if (mid < 150_000) return "under_150k";
  if (mid <= 250_000) return "150_250k";
  return "over_250k";
}

export function extractPay(text: string): Pay | null {
  const blob = text.replace(/&nbsp;/gi, " ").replace(/\s+/g, " ");

  const hourlyRange = blob.match(
    /\$\s?([\d,]+(?:\.\d+)?k?)\s*(?:-|–|to)\s*\$?\s*([\d,]+(?:\.\d+)?k?)\s*(?:\/\s*hr|\/hr|per hour|an hour|hourly)/i,
  );
  if (hourlyRange) {
    const min = parseAmount(hourlyRange[1]);
    const max = parseAmount(hourlyRange[2]);
    if (min > 0 && max >= min && max <= 800) {
      return {
        min,
        max,
        unit: "hour",
        label: `$${Math.round(min)}–$${Math.round(max)} / hr`,
      };
    }
  }

  const hourlySingle = blob.match(
    /\$\s?([\d,]+(?:\.\d+)?)\s*(?:\/\s*hr|\/hr|per hour|an hour)/i,
  );
  if (hourlySingle) {
    const amount = parseAmount(hourlySingle[1]);
    if (amount > 0 && amount <= 800) {
      return {
        min: amount,
        max: amount,
        unit: "hour",
        label: `$${Math.round(amount)} / hr`,
      };
    }
  }

  const annualRange = blob.match(
    /\$\s?([\d,]+(?:\.\d+)?k?)\s*(?:-|–|to)\s*\$?\s*([\d,]+(?:\.\d+)?k?)\s*(?:per year|\/\s*year|annually|a year|USD)?/i,
  );
  if (annualRange) {
    const min = parseAmount(annualRange[1]);
    const max = parseAmount(annualRange[2]);
    if (min >= 20_000 && max >= min && max <= 2_000_000) {
      return {
        min,
        max,
        unit: "year",
        label: `$${Math.round(min / 1000)}k–$${Math.round(max / 1000)}k`,
      };
    }
  }

  const annualSingle = blob.match(
    /\$\s?([\d,]+(?:\.\d+)?k?)\s*(?:per year|\/\s*year|annually|a year)/i,
  );
  if (annualSingle) {
    const amount = parseAmount(annualSingle[1]);
    if (amount >= 20_000 && amount <= 2_000_000) {
      return {
        min: amount,
        max: amount,
        unit: "year",
        label: `$${Math.round(amount / 1000)}k / year`,
      };
    }
  }

  const bareRange = blob.match(
    /\$\s?([\d,]+(?:\.\d+)?k?)\s*(?:-|–|to)\s*\$?\s*([\d,]+(?:\.\d+)?k?)/i,
  );
  if (bareRange) {
    const min = parseAmount(bareRange[1]);
    const max = parseAmount(bareRange[2]);
    if (min > 0 && max >= min && max <= 400) {
      return {
        min,
        max,
        unit: "hour",
        label: `$${Math.round(min)}–$${Math.round(max)} / hr`,
      };
    }
    if (min >= 20_000 && max >= min && max <= 2_000_000) {
      return {
        min,
        max,
        unit: "year",
        label: `$${Math.round(min / 1000)}k–$${Math.round(max / 1000)}k`,
      };
    }
  }

  return null;
}
