import { getCommentsDataWithCommenterInfoByCommentIds } from "@/repository/comment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commentIds = searchParams.getAll("commentIds");

  if (!commentIds || commentIds.length === 0) {
    return NextResponse.json(
      { error: "commentIds is required" },
      { status: 400 },
    );
  }

  const commentsData = await getCommentsDataWithCommenterInfoByCommentIds({
    commentIds,
  });

  return NextResponse.json({ commentsData });
}
