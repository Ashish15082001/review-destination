import { getReviewsData, getReviewsCount } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [reviewsData, total] = await Promise.all([
    getReviewsData({ page }),
    getReviewsCount(),
  ]);

  return NextResponse.json({
    reviewsData,
    total,
  });
}
