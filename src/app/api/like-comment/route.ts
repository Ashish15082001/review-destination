import {
  addLikeToComment,
  removeLikeFromComment,
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

    const updated = await addLikeToComment({
      commentId,
      userId: userData._id,
      reviewId,
    });

    if (!updated) {
      return NextResponse.json(
        { error: true, message: "Comment not found or already liked" },
        { status: 404 },
      );
    }

    return NextResponse.json({ error: false, message: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: `Failed to like the comment` },
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

    const updated = await removeLikeFromComment({
      commentId,
      userId: userData._id,
      reviewId,
    });

    if (!updated) {
      return NextResponse.json(
        { error: true, message: "Comment not found or not liked" },
        { status: 404 },
      );
    }

    return NextResponse.json({ error: false, message: null }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to remove like from comment`,
      },
      { status: 500 },
    );
  }
}
