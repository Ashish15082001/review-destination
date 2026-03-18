import { getCommentsCollection } from "@/database/mongoDB";
import {
  CommentData,
  CommentDataDocument,
  CommentDataWithCommenterData,
} from "@/schema/comment";
import { validateCommentDataWithCommenterData } from "@/validators/comment";
import { ObjectId } from "bson";
import { cache } from "react";
import {
  mapCommentDataDocumentToCommentData,
  mapCommentDataToCommentDataDocument,
} from "@/mappers/comment";
import { getUsersDataByUserIds } from "./user";

/**
 * Validates and inserts a new comment  into the comments collection.
 * @param commentData - The comment  to insert.
 * @returns The string representation of the inserted 's ObjectId.
 */
export async function insertCommentData(
  commentData: Omit<CommentData, "_id">,
): Promise<string> {
  const validatedCommentDataDocument: CommentDataDocument =
    mapCommentDataToCommentDataDocument({
      ...commentData,
      _id: new ObjectId().toString(),
    });

  const collection = await getCommentsCollection();
  await collection.insertOne(validatedCommentDataDocument);

  return validatedCommentDataDocument._id.toString();
}

/**
 * Retrieves a single comment by its ID.
 * @param commentId - The string representation of the comment's ObjectId.
 * @returns The validated comment, or `null` if not found.
 */
export async function getCommentData({
  commentId,
}: {
  commentId: string;
}): Promise<CommentData | null> {
  const collection = await getCommentsCollection();

  const commentDataDocument = await collection.findOne({
    _id: new ObjectId(commentId),
  });

  return commentDataDocument
    ? mapCommentDataDocumentToCommentData(commentDataDocument)
    : null;
}

/**
 * Retrieves multiple comments by their IDs, each enriched with the commenter's name and profile picture.
 * @param commentIds - An array of comment ID strings to look up.
 * @returns An array of validated comments with commenter data. Returns an empty array if none are found.
 */
export async function getCommentsDataWithCommenterDataByCommentIds({
  commentIds,
}: {
  commentIds: string[];
}): Promise<CommentDataWithCommenterData[]> {
  const collection = await getCommentsCollection();

  const commentDataDocuments = await collection
    .find({
      _id: { $in: commentIds.map((id) => new ObjectId(id)) },
    })
    .toArray();

  if (!commentDataDocuments || commentDataDocuments.length === 0) return [];

  const commentsData: CommentData[] = commentDataDocuments.map(
    (commentDataDocument) =>
      mapCommentDataDocumentToCommentData(commentDataDocument),
  );

  const commenterIds = commentDataDocuments.map((commentDataDocument) =>
    commentDataDocument.commentedBy.toString(),
  );

  const commentersData = await getUsersDataByUserIds({
    userIds: commenterIds,
  });

  return commentsData.map((commentData): CommentDataWithCommenterData => {
    const commenterData = commentersData.find(
      (userData) => userData._id === commentData.commentedBy.toString(),
    );

    return validateCommentDataWithCommenterData({
      ...commentData,
      commenterName: commenterData?.userName ?? "Unknown",
      profilePictureUrl: commenterData?.profilePictureUrl ?? "",
    });
  });
}

/**
 * Retrieves all comments associated with a given review ID.
 * Results are memoised per request via React's `cache`.
 * @param reviewId - The string representation of the review's ObjectId.
 * @returns An array of validated comments for the review.
 */
export const getCommentsDataByReviewId = cache(async function ({
  reviewId,
}: {
  reviewId: string;
}): Promise<CommentData[]> {
  const collection = await getCommentsCollection();

  const commentDataDocuments = await collection
    .find({
      reviewId: new ObjectId(reviewId),
    })
    .toArray();

  return commentDataDocuments.map((commentDataDocument) =>
    mapCommentDataDocumentToCommentData(commentDataDocument),
  );
});

/**
 * Retrieves all comments for a review, each enriched with the commenter's name and profile picture.
 * Results are memoised per request via React's `cache`.
 * @param reviewId - The string representation of the review's ObjectId.
 * @returns An array of validated enriched comments. Returns an empty array if none are found.
 */
export const getCommentsDataWithCommenterDataByReviewId = cache(
  async function ({
    reviewId,
  }: {
    reviewId: string;
  }): Promise<CommentDataWithCommenterData[]> {
    const collection = await getCommentsCollection();

    const commentDataDocuments = await collection
      .find({
        reviewId: new ObjectId(reviewId),
      })
      .toArray();

    if (!commentDataDocuments || commentDataDocuments.length === 0) return [];

    const commentsData: CommentData[] = commentDataDocuments.map(
      (commentDataDocument) =>
        mapCommentDataDocumentToCommentData(commentDataDocument),
    );

    const commenterIds = commentDataDocuments.map((commentDataDocument) =>
      commentDataDocument.commentedBy.toString(),
    );

    const commentersData = await getUsersDataByUserIds({
      userIds: commenterIds,
    });

    return commentsData.map((commentData): CommentDataWithCommenterData => {
      const commenterData = commentersData.find(
        (userData) => userData._id === commentData.commentedBy.toString(),
      );

      return validateCommentDataWithCommenterData({
        ...commentData,
        commenterName: commenterData?.userName ?? "Unknown",
        profilePictureUrl: commenterData?.profilePictureUrl ?? "",
      });
    });
  },
);

/**
 * Retrieves all replies for a given parent comment.
 * @param commentId - The string representation of the parent comment's ObjectId.
 * @returns An array of validated reply comments. Returns an empty array if the parent has no replies.
 */
export async function getCommentRepliesData({
  commentId,
}: {
  commentId: string;
}): Promise<CommentData[]> {
  const collection = await getCommentsCollection();

  const parentComment = await collection.findOne({
    _id: new ObjectId(commentId),
  });

  if (!parentComment || parentComment.replyCommentIds.length === 0) return [];

  const commentRepliesDataDocument = await collection
    .find({ _id: { $in: parentComment.replyCommentIds } })
    .toArray();

  return commentRepliesDataDocument.map((commentReplyDataDocument) =>
    mapCommentDataDocumentToCommentData(commentReplyDataDocument),
  );
}

/**
 * Adds a like from a user to a comment, removing any existing dislike from that user atomically.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param userId - The string representation of the user's ObjectId.
 * @param reviewId - The string representation of the review's ObjectId (reserved for cache invalidation).
 * @returns `true` if the document was modified, `false` otherwise.
 */
export async function addLikeToComment({
  commentId,
  userId,
  reviewId,
}: {
  commentId: string;
  userId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(commentId) },
    {
      $addToSet: { idsOfUsersWhoLiked: new ObjectId(userId) },
      $pull: { idsOfUsersWhoDisliked: new ObjectId(userId) },
    },
  );

  return result.modifiedCount > 0;
}

/**
 * Removes a like from a user on a comment.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param userId - The string representation of the user's ObjectId.
 * @param reviewId - The string representation of the review's ObjectId (reserved for cache invalidation).
 * @returns `true` if the document was modified, `false` otherwise.
 */
export async function removeLikeFromComment({
  commentId,
  userId,
  reviewId,
}: {
  commentId: string;
  userId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(commentId) },
    {
      $pull: { idsOfUsersWhoLiked: new ObjectId(userId) },
    },
  );

  // revalidateTag(`commentData-${commentId}`, "max");
  // revalidateTag(`commentsData-reviewId-${reviewId}`, "max");

  return result.modifiedCount > 0;
}

/**
 * Adds a dislike from a user to a comment, removing any existing like from that user atomically.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param userId - The string representation of the user's ObjectId.
 * @param reviewId - The string representation of the review's ObjectId (reserved for cache invalidation).
 * @returns `true` if the document was modified, `false` otherwise.
 */
export async function addDislikeToComment({
  commentId,
  userId,
  reviewId,
}: {
  commentId: string;
  userId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(commentId) },
    {
      $addToSet: { idsOfUsersWhoDisliked: new ObjectId(userId) },
      $pull: { idsOfUsersWhoLiked: new ObjectId(userId) },
    },
  );

  // revalidateTag(`commentData-${commentId}`, "max");
  // revalidateTag(`commentsData-reviewId-${reviewId}`, "max");

  return result.modifiedCount > 0;
}

/**
 * Removes a dislike from a user on a comment.
 * @param commentId - The string representation of the comment's ObjectId.
 * @param userId - The string representation of the user's ObjectId.
 * @param reviewId - The string representation of the review's ObjectId (reserved for cache invalidation).
 * @returns `true` if the document was modified, `false` otherwise.
 */
export async function removeDislikeFromComment({
  commentId,
  userId,
  reviewId,
}: {
  commentId: string;
  userId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(commentId) },
    {
      $pull: { idsOfUsersWhoDisliked: new ObjectId(userId) },
    },
  );

  // revalidateTag(`commentData-${commentId}`, "max");
  // revalidateTag(`commentsData-reviewId-${reviewId}`, "max");

  return result.modifiedCount > 0;
}

/**
 * Registers a reply comment under its parent by adding the reply's ID to the parent's `replyCommentIds` set.
 * @param parentCommentId - The string representation of the parent comment's ObjectId.
 * @param replyCommentId - The string representation of the reply comment's ObjectId.
 * @returns `true` if the parent document was modified, `false` otherwise.
 */
export async function addReplyToComment({
  parentCommentId,
  replyCommentId,
}: {
  parentCommentId: string;
  replyCommentId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(parentCommentId) },
    {
      $addToSet: { replyCommentIds: new ObjectId(replyCommentId) },
    },
  );

  // revalidateTag(`commentData-${parentCommentId}`, "max");
  // revalidateTag(`commentsData-reviewId-${reviewId}`, "max");

  return result.modifiedCount > 0;
}
