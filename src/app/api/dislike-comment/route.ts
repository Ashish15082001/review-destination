import {
  addDislikeToComment,
  removeDislikeFromComment,
  getUserDataUsingSession,
} from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { commentId, reviewId } = await request.json();

    if (!commentId || !reviewId) {
      return NextResponse.json(
        { error: true, message: "commentId and reviewId are required" },
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

    const updated = await addDislikeToComment({
      commentId,
      userId: userData._id,
      reviewId,
    });

    if (!updated) {
      return NextResponse.json(
        { error: true, message: "Comment not found or already disliked" },
        { status: 404 },
      );
    }

    return NextResponse.json({ error: false, message: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to dislike the comment`,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { commentId, reviewId } = await request.json();

    if (!commentId || !reviewId) {
      return NextResponse.json(
        { error: true, message: "commentId and reviewId are required" },
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

    const updated = await removeDislikeFromComment({
      commentId,
      userId: userData._id,
      reviewId,
    });

    if (!updated) {
      return NextResponse.json(
        { error: true, message: "Comment not found or not disliked" },
        { status: 404 },
      );
    }

    return NextResponse.json({ error: false, message: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to remove dislike from comment`,
      },
      { status: 500 },
    );
  }
}
