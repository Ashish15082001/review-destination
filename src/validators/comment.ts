import {
  CommentData,
  CommentDocument,
  CommentDocumentSchema,
  CommentDataSchema,
  CommentDataWithCommenterInfo,
  CommentDataWithCommenterInfoSchema,
} from "@/schema/comment";

/**
 * Validates raw comment input data against the CommentDataSchema.
 * @param commentData - The comment data to validate.
 * @returns The parsed and validated comment data.
 * @throws {Error} If validation fails.
 */
export default function validateCommentData(
  commentData: CommentData,
): CommentData {
  const parseResult = CommentDataSchema.safeParse(commentData);

  if (!parseResult.success)
    throw new Error(`Invalid comment data: ${parseResult.error.message}`);

  return parseResult.data;
}

/**
 * Validates a comment document (as stored in the database) against the CommentDocumentSchema.
 * @param commentDocument - The comment document to validate.
 * @returns The parsed and validated comment document.
 * @throws {Error} If validation fails.
 */
export function validateCommentDocument(
  commentDocument: CommentDocument,
): CommentDocument {
  const parseResult = CommentDocumentSchema.safeParse(commentDocument);

  if (!parseResult.success)
    throw new Error(`Invalid comment document: ${parseResult.error.message}`);

  return parseResult.data;
}

/**
 * Validates a comment enriched with commenter profile data against the CommentDataWithCommenterSchema.
 * @param commentDataWithCommenter - The enriched comment to validate.
 * @returns The parsed and validated enriched comment.
 * @throws {Error} If validation fails.
 */
export function validateCommentDataWithCommenterInfo(
  commentDataWithCommenterInfo: CommentDataWithCommenterInfo,
): CommentDataWithCommenterInfo {
  const parseResult = CommentDataWithCommenterInfoSchema.safeParse(
    commentDataWithCommenterInfo,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid comment data with commenter info: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
