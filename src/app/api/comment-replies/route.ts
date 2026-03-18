import { getCommentRepliesData } from "@/repository/comment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("commentId");

  if (!commentId) {
    return NextResponse.json(
      { error: "commentId is required" },
      { status: 400 },
    );
  }

  const commentRepliesData = await getCommentRepliesData({ commentId });

  return NextResponse.json({
    commentRepliesData,
  });
}
