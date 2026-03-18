import { ReviewData, ReviewDataDocument } from "@/schema/review";
import toObjectId from "@/utils/toObjectId";
import validateReviewData, {
  validateReviewDataDocument,
} from "@/validators/review";

/**
 * Maps a MongoDB review document into application-level review data.
 */
export function mapReviewDataDocumentToReviewData(
  reviewDataDocument: ReviewDataDocument,
): ReviewData {
  const validatedReviewDataDocument =
    validateReviewDataDocument(reviewDataDocument);

  return validateReviewData({
    _id: validatedReviewDataDocument._id.toString(),
    userId: validatedReviewDataDocument.userId.toString(),
    destinationName: validatedReviewDataDocument.destinationName,
    whenVisited: validatedReviewDataDocument.whenVisited,
    description: validatedReviewDataDocument.description,
    experience: validatedReviewDataDocument.experience,
    destinationPhotoUrls: validatedReviewDataDocument.destinationPhotoUrls,
    datePosted: validatedReviewDataDocument.datePosted,
  });
}

/**
 * Maps application-level review data into a MongoDB review document.
 */
export function mapReviewDataToReviewDataDocument(
  reviewData: ReviewData,
): ReviewDataDocument {
  const validatedReviewData = validateReviewData(reviewData);

  return validateReviewDataDocument({
    _id: toObjectId(validatedReviewData._id, "_id"),
    userId: toObjectId(validatedReviewData.userId, "userId"),
    destinationName: validatedReviewData.destinationName,
    whenVisited: validatedReviewData.whenVisited,
    description: validatedReviewData.description,
    experience: validatedReviewData.experience,
    destinationPhotoUrls: validatedReviewData.destinationPhotoUrls,
    datePosted: validatedReviewData.datePosted,
  });
}
