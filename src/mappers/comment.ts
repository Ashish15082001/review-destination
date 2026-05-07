import { CommentData, CommentDocument } from "@/schema/comment";
import toObjectId from "@/utils/toObjectId";
import validateCommentData, {
  validateCommentDocument,
} from "@/validators/comment";

/**
 * Maps a MongoDB comment document into application-level comment data.
 * @param commentDocument - The comment document to map.
 * @returns The application-level comment data.
 */
export function mapCommentDocumentToCommentData(
  commentDocument: CommentDocument,
): CommentData {
  const validatedCommentDocument = validateCommentDocument(commentDocument);

  return validateCommentData({
    _id: validatedCommentDocument._id.toString(),
    parentCommentId:
      validatedCommentDocument.parentCommentId?.toString() ?? null,
    reviewId: validatedCommentDocument.reviewId.toString(),
    commentedBy: validatedCommentDocument.commentedBy.toString(),
    commentedOn: validatedCommentDocument.commentedOn,
    comment: validatedCommentDocument.comment,
    idsOfUsersWhoLiked: validatedCommentDocument.idsOfUsersWhoLiked.map((id) =>
      id.toString(),
    ),
    idsOfUsersWhoDisliked: validatedCommentDocument.idsOfUsersWhoDisliked.map(
      (id) => id.toString(),
    ),
  });
}

/**
 * Maps application-level comment data into a MongoDB comment document.
 * @param commentData - The comment data to map.
 * @returns The MongoDB comment document.
 */
export function mapCommentDataToCommentDocument(
  commentData: CommentData,
): CommentDocument {
  const validatedCommentData = validateCommentData(commentData);

  return validateCommentDocument({
    _id: toObjectId(validatedCommentData._id, "_id"),
    parentCommentId: validatedCommentData.parentCommentId
      ? toObjectId(validatedCommentData.parentCommentId, "parentCommentId")
      : null,
    reviewId: toObjectId(validatedCommentData.reviewId, "reviewId"),
    commentedBy: toObjectId(validatedCommentData.commentedBy, "commentedBy"),
    commentedOn: validatedCommentData.commentedOn,
    comment: validatedCommentData.comment,
    idsOfUsersWhoLiked: validatedCommentData.idsOfUsersWhoLiked.map((id) =>
      toObjectId(id, "idsOfUsersWhoLiked"),
    ),
    idsOfUsersWhoDisliked: validatedCommentData.idsOfUsersWhoDisliked.map(
      (id) => toObjectId(id, "idsOfUsersWhoDisliked"),
    ),
  });
}
