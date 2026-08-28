import { NextResponse } from "next/server";
import { getJobs } from "@/lib/get-jobs";

export const revalidate = 1800;

export async function GET() {
  const payload = await getJobs();
  return NextResponse.json(payload);
}
