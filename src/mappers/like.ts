import { LikeData, LikeDataDocument } from "@/schema/like";
import toObjectId from "@/utils/toObjectId";
import validateLikeData, { validateLikeDataDocument } from "@/validators/like";

/**
 * Maps a MongoDB like document into application-level like data.
 */
export function mapLikeDataDocumentToLikeData(
  likeDataDocument: LikeDataDocument,
): LikeData {
  const validatedLikeDataDocument = validateLikeDataDocument(likeDataDocument);

  return validateLikeData({
    _id: validatedLikeDataDocument._id.toString(),
    reviewId: validatedLikeDataDocument.reviewId.toString(),
    likedBy: validatedLikeDataDocument.likedBy.toString(),
    likedOn: validatedLikeDataDocument.likedOn,
  });
}

/**
 * Maps application-level like data into a MongoDB like document.
 */
export function mapLikeDataToLikeDataDocument(
  likeData: LikeData,
): LikeDataDocument {
  const validatedLikeData = validateLikeData(likeData);

  return validateLikeDataDocument({
    _id: toObjectId(validatedLikeData._id, "_id"),
    reviewId: toObjectId(validatedLikeData.reviewId, "reviewId"),
    likedBy: toObjectId(validatedLikeData.likedBy, "likedBy"),
    likedOn: validatedLikeData.likedOn,
  });
}
