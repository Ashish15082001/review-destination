import { CommentData, CommentDataDocument } from "@/schema/comment";
import toObjectId from "@/utils/toObjectId";
import validateCommentData, {
  validateCommentDataDocument,
} from "@/validators/comment";

/**
 * Maps a MongoDB comment document into application-level comment data.
 */
export function mapCommentDataDocumentToCommentData(
  commentDataDocument: CommentDataDocument,
): CommentData {
  const validatedCommentDataDocument =
    validateCommentDataDocument(commentDataDocument);

  return validateCommentData({
    _id: validatedCommentDataDocument._id.toString(),
    parentCommentId:
      validatedCommentDataDocument.parentCommentId?.toString() ?? null,
    reviewId: validatedCommentDataDocument.reviewId.toString(),
    commentedBy: validatedCommentDataDocument.commentedBy.toString(),
    commentedOn: validatedCommentDataDocument.commentedOn,
    comment: validatedCommentDataDocument.comment,
    replyCommentIds: validatedCommentDataDocument.replyCommentIds.map((id) =>
      id.toString(),
    ),
    idsOfUsersWhoLiked: validatedCommentDataDocument.idsOfUsersWhoLiked.map(
      (id) => id.toString(),
    ),
    idsOfUsersWhoDisliked:
      validatedCommentDataDocument.idsOfUsersWhoDisliked.map((id) =>
        id.toString(),
      ),
  });
}

/**
 * Maps application-level comment data into a MongoDB comment document.
 */
export function mapCommentDataToCommentDataDocument(
  commentData: CommentData,
): CommentDataDocument {
  const validatedCommentData = validateCommentData(commentData);

  return validateCommentDataDocument({
    _id: toObjectId(validatedCommentData._id, "_id"),
    parentCommentId: validatedCommentData.parentCommentId
      ? toObjectId(validatedCommentData.parentCommentId, "parentCommentId")
      : null,
    reviewId: toObjectId(validatedCommentData.reviewId, "reviewId"),
    commentedBy: toObjectId(validatedCommentData.commentedBy, "commentedBy"),
    commentedOn: validatedCommentData.commentedOn,
    comment: validatedCommentData.comment,
    replyCommentIds: validatedCommentData.replyCommentIds.map((id) =>
      toObjectId(id, "replyCommentIds"),
    ),
    idsOfUsersWhoLiked: validatedCommentData.idsOfUsersWhoLiked.map((id) =>
      toObjectId(id, "idsOfUsersWhoLiked"),
    ),
    idsOfUsersWhoDisliked: validatedCommentData.idsOfUsersWhoDisliked.map(
      (id) => toObjectId(id, "idsOfUsersWhoDisliked"),
    ),
  });
}
