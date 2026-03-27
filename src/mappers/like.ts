import { LikeData, LikeDocument } from "@/schema/like";
import toObjectId from "@/utils/toObjectId";
import validateLikeData, { validateLikeDocument } from "@/validators/like";

/**
 * Maps a MongoDB like document into application-level like data.
 * @param likeDocument - The like document to map.
 * @returns The application-level like data.
 */
export function mapLikeDocumentToLikeData(
  likeDocument: LikeDocument,
): LikeData {
  const validatedLikeDocument = validateLikeDocument(likeDocument);

  return validateLikeData({
    _id: validatedLikeDocument._id.toString(),
    reviewId: validatedLikeDocument.reviewId.toString(),
    likedBy: validatedLikeDocument.likedBy.toString(),
    likedOn: validatedLikeDocument.likedOn,
  });
}

/**
 * Maps application-level like data into a MongoDB like document.
 * @param likeData - The like data to map.
 * @returns The MongoDB like document.
 */
export function mapLikeDataToLikeDocument(likeData: LikeData): LikeDocument {
  const validatedLikeData = validateLikeData(likeData);

  return validateLikeDocument({
    _id: toObjectId(validatedLikeData._id, "_id"),
    reviewId: toObjectId(validatedLikeData.reviewId, "reviewId"),
    likedBy: toObjectId(validatedLikeData.likedBy, "likedBy"),
    likedOn: validatedLikeData.likedOn,
  });
}
