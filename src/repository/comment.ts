import { getCommentsCollection } from "@/database/mongoDB";
import {
  CommentData,
  CommentDocument,
  CommentDataWithCommenterInfo,
} from "@/schema/comment";
import { validateCommentDataWithCommenterInfo } from "@/validators/comment";
import { ObjectId } from "bson";
import {
  mapCommentDocumentToCommentData,
  mapCommentDataToCommentDocument,
} from "@/mappers/comment";
import { getUserDataById } from "./user";
import { cacheTag, revalidateTag } from "next/cache";
import { ClientSession } from "mongodb";

/**
 * Validates and inserts a new comment into the comments collection.
 * @param commentData - The comment data to insert.
 * @param clientSession - Optional MongoDB client session for transaction support.
 * @returns The string representation of the inserted comment's ObjectId.
 */
export async function insertCommentData(
  commentData: Omit<CommentData, "_id">,
  clientSession?: ClientSession,
): Promise<string> {
  const validatedCommentDocument: CommentDocument =
    mapCommentDataToCommentDocument({
      ...commentData,
      _id: new ObjectId().toString(),
    });

  const collection = await getCommentsCollection();
  await collection.insertOne(validatedCommentDocument, {
    session: clientSession,
  });

  return validatedCommentDocument._id.toString();
}

/**
 * Retrieves a comment data by its ID, enriched with the commenter info.
 * @param commentId - The string representation of the comment's ObjectId.
 * @returns The validated comment data with commenter data, or `null` if not found.
 */
export async function getCommentDataWithCommenterInfoByCommentId({
  commentId,
}: {
  commentId: string;
}): Promise<CommentDataWithCommenterInfo | null> {
  "use cache";
  cacheTag(`commentDataWithCommenterInfo-commentId-${commentId}`);

  const collection = await getCommentsCollection();

  const commentDocument = await collection.findOne({
    _id: new ObjectId(commentId),
  });

  if (!commentDocument) return null;

  const commentData = mapCommentDocumentToCommentData(commentDocument);

  const commenterDocument = await getUserDataById({
    userId: commentData.commentedBy,
  });

  if (!commenterDocument) return null;

  const commentDataWithCommenterInfo = validateCommentDataWithCommenterInfo({
    ...commentData,
    commenterName: commenterDocument.userName,
    profilePictureUrl: commenterDocument.profilePictureUrl,
  });

  return commentDataWithCommenterInfo;
}

/**
 * Retrieves multiple comments data by their IDs, each enriched with the commenter's info.
 * @param commentIds - An array of comment ID strings to look up.
 * @returns An array of validated comments with commenter data. Returns an empty array if none are found.
 */
export async function getCommentsDataWithCommenterInfoByCommentIds({
  commentIds,
}: {
  commentIds: Array<string>;
}): Promise<Array<CommentDataWithCommenterInfo>> {
  const commentsDataWithCommenterInfoPromises = commentIds.map((commentId) =>
    getCommentDataWithCommenterInfoByCommentId({ commentId }),
  );

  const commentsDataWithCommenterInfoResults = await Promise.all(
    commentsDataWithCommenterInfoPromises,
  );

  const commentsDataWithCommenterInfo =
    commentsDataWithCommenterInfoResults.filter(
      (commentDataWithCommenterInfo) => commentDataWithCommenterInfo !== null,
    );

  return commentsDataWithCommenterInfo;
}

/**
 * Retrieves comments for a review, each enriched with the commenter's name and profile picture.
 * @param reviewId - The string representation of the review's ObjectId.
 * @param rootOnly - When `true`, only root-level comments are returned (replies excluded). Defaults to `false` (all comments).
 * @returns An array of validated enriched comments. Returns an empty array if none are found.
 */
export const getCommentsDataWithCommenterInfoByReviewId = async function ({
  reviewId,
  rootOnly = false,
}: {
  reviewId: string;
  rootOnly?: boolean;
}): Promise<Array<CommentDataWithCommenterInfo>> {
  const collection = await getCommentsCollection();

  const filter: Record<string, unknown> = { reviewId: new ObjectId(reviewId) };
  if (rootOnly) filter.parentCommentId = null;

  const commentDocumentIds = await collection
    .find(filter, { projection: { _id: 1 } })
    .toArray();

  const commentDataIds = commentDocumentIds.map((commentDocumentId) =>
    commentDocumentId._id.toString(),
  );

  const commentsDataWithCommenterInfo =
    await getCommentsDataWithCommenterInfoByCommentIds({
      commentIds: commentDataIds,
    });

  return commentsDataWithCommenterInfo;
};

/**
 * Retrieves all replies for a given parent comment by querying on parentCommentId.
 * @param commentId - The string representation of the parent comment's ObjectId.
 * @returns An array of validated reply comments. Returns an empty array if the parent has no replies.
 */
export async function getCommentRepliesDataWithCommenterInfo({
  commentId,
}: {
  commentId: string;
}): Promise<Array<CommentDataWithCommenterInfo>> {
  const collection = await getCommentsCollection();

  const commentReplyDocuments = await collection
    .find(
      { parentCommentId: new ObjectId(commentId) },
      { projection: { _id: 1 } },
    )
    .toArray();

  const commentReplyIds = commentReplyDocuments.map((doc) =>
    doc._id.toString(),
  );

  const commentRepliesDataWithCommenterInfo =
    await getCommentsDataWithCommenterInfoByCommentIds({
      commentIds: commentReplyIds,
    });

  return commentRepliesDataWithCommenterInfo;
}

/**
 * Adds a like from a user to a comment, removing any existing dislike from that user atomically.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param userId - The string representation of the user's ObjectId.
 * @returns The updated comment data if the document was modified, `null` otherwise.
 */
export async function addLikeToComment(
  {
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  },
  clientSession?: ClientSession,
): Promise<CommentData | null> {
  const collection = await getCommentsCollection();
  const commentDocument = await collection.findOneAndUpdate(
    { _id: new ObjectId(commentId) },
    {
      $addToSet: { idsOfUsersWhoLiked: new ObjectId(userId) },
      $pull: { idsOfUsersWhoDisliked: new ObjectId(userId) },
    },
    {
      returnDocument: "after",
      session: clientSession,
    },
  );

  revalidateTag(`commentDataWithCommenterInfo-commentId-${commentId}`, "max");

  const commentData =
    commentDocument !== null
      ? mapCommentDocumentToCommentData(commentDocument)
      : null;

  return commentData;
}

/**
 * Removes a like from a user on a comment.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param userId - The string representation of the user's ObjectId.
 * @returns The updated comment data if the document was modified, `null` otherwise.
 */
export async function removeLikeFromComment(
  {
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  },
  clientSession?: ClientSession,
): Promise<CommentData | null> {
  const collection = await getCommentsCollection();
  const commentDocument = await collection.findOneAndUpdate(
    { _id: new ObjectId(commentId) },
    {
      $pull: { idsOfUsersWhoLiked: new ObjectId(userId) },
    },
    {
      returnDocument: "after",
      session: clientSession,
    },
  );

  revalidateTag(`commentDataWithCommenterInfo-commentId-${commentId}`, "max");

  const commentData =
    commentDocument !== null
      ? mapCommentDocumentToCommentData(commentDocument)
      : null;

  return commentData;
}

/**
 * Adds a dislike from a user to a comment, removing any existing like from that user atomically.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param userId - The string representation of the user's ObjectId.
 * @returns The updated comment data if the document was modified, `null` otherwise.
 */
export async function addDislikeToComment(
  {
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  },
  clientSession?: ClientSession,
): Promise<CommentData | null> {
  const collection = await getCommentsCollection();
  const commentDocument = await collection.findOneAndUpdate(
    { _id: new ObjectId(commentId) },
    {
      $addToSet: { idsOfUsersWhoDisliked: new ObjectId(userId) },
      $pull: { idsOfUsersWhoLiked: new ObjectId(userId) },
    },
    {
      returnDocument: "after",
      session: clientSession,
    },
  );

  revalidateTag(`commentDataWithCommenterInfo-commentId-${commentId}`, "max");

  const commentData =
    commentDocument !== null
      ? mapCommentDocumentToCommentData(commentDocument)
      : null;

  return commentData;
}

/**
 * Removes a dislike from a user on a comment.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param userId - The string representation of the user's ObjectId.
 * @returns The updated comment data if the document was modified, `null` otherwise.
 */
export async function removeDislikeFromComment(
  {
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  },
  clientSession?: ClientSession,
): Promise<CommentData | null> {
  const collection = await getCommentsCollection();
  const commentDocument = await collection.findOneAndUpdate(
    { _id: new ObjectId(commentId) },
    {
      $pull: { idsOfUsersWhoDisliked: new ObjectId(userId) },
    },
    {
      returnDocument: "after",
      session: clientSession,
    },
  );

  revalidateTag(`commentDataWithCommenterInfo-commentId-${commentId}`, "max");

  const commentData =
    commentDocument !== null
      ? mapCommentDocumentToCommentData(commentDocument)
      : null;

  return commentData;
}

/**
 * Checks if a comment with the given ID exists in the database.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param clientSession - Optional MongoDB client session for transaction support.
 * @returns `true` if the comment exists, `false` otherwise.
 */
export async function checkIfCommentExists(
  {
    commentId,
  }: {
    commentId: string;
  },
  clientSession?: ClientSession,
): Promise<boolean> {
  const collection = await getCommentsCollection();
  const commentDocument = await collection.findOne(
    { _id: new ObjectId(commentId) },
    { projection: { _id: 1 }, session: clientSession },
  );

  const doesCommentExist = commentDocument !== null;

  return doesCommentExist;
}
