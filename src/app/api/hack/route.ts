import { NextRequest, NextResponse } from "next/server";
import { storeUserScrapedData } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const data: unknown = await req.json();
  const id = await storeUserScrapedData(data);
  return NextResponse.json({ received: true, id });
}
