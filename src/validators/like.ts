import {
  LikeData,
  LikeDocument,
  LikeDocumentSchema,
  LikeDataSchema,
} from "@/schema/like";

/**
 * Validates raw like data against the LikeDataSchema.
 * @param likeData - The like payload to validate.
 * @returns The parsed and validated like data.
 * @throws {Error} If validation fails.
 */
export default function validateLikeData(likeData: LikeData): LikeData {
  const parseResult = LikeDataSchema.safeParse(likeData);

  if (!parseResult.success)
    throw new Error(`Invalid like data: ${parseResult.error.message}`);

  return parseResult.data;
}

/**
 * Validates a like document as stored in MongoDB.
 * @param likeDataDocument - The like document to validate.
 * @returns The parsed and validated like document.
 * @throws {Error} If validation fails.
 */
export function validateLikeDocument(likeDocument: LikeDocument): LikeDocument {
  const parseResult = LikeDocumentSchema.safeParse(likeDocument);

  if (!parseResult.success)
    throw new Error(`Invalid like data document: ${parseResult.error.message}`);

  return parseResult.data;
}
