import {
  CommentData,
  CommentDataDocument,
  CommentDataDocumentSchema,
  CommentDataSchema,
  CommentDataWithCommenterData,
  CommentDataWithCommenterDataSchema,
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
 * Validates a comment data document (as stored in the database) against the CommentDataDocumentSchema.
 * @param commentDataDocument - The comment document to validate.
 * @returns The parsed and validated comment document.
 * @throws {Error} If validation fails.
 */
export function validateCommentDataDocument(
  commentDataDocument: CommentDataDocument,
): CommentDataDocument {
  const parseResult = CommentDataDocumentSchema.safeParse(commentDataDocument);

  if (!parseResult.success)
    throw new Error(
      `Invalid comment data document: ${parseResult.error.message}`,
    );

  return parseResult.data;
}

/**
 * Validates a comment  enriched with commenter profile data against the CommentDataWithCommenterDataSchema.
 * @param commentDataWithCommenterData - The enriched comment  to validate.
 * @returns The parsed and validated enriched comment .
 * @throws {Error} If validation fails.
 */
export function validateCommentDataWithCommenterData(
  commentDataWithCommenterData: CommentDataWithCommenterData,
): CommentDataWithCommenterData {
  const parseResult = CommentDataWithCommenterDataSchema.safeParse(
    commentDataWithCommenterData,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid comment data document with commenter data: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
