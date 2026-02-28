import { getUserDataUsingSession, insertLikeData } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: true, message: "reviewId is required" },
        { status: 400 },
      );
    }

    const userData = await getUserDataUsingSession();

    if (!userData) {
      return NextResponse.json(
        { error: true, message: "User not authenticated" },
        { status: 401 },
      );
    }

    await insertLikeData({
      likedBy: userData._id,
      reviewId: reviewId,
      likedOn: new Date(),
    });

    return NextResponse.json({ error: false, message: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: `Failed to like the review: ${error.message}` },
      { status: 500 },
    );
  }
}
