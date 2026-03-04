import { getReviewsData } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  const reviewsData = await getReviewsData({
    cursor: cursor || undefined,
  });

  return NextResponse.json({
    reviewsData,
  });
}
