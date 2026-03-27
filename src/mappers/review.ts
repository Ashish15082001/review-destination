import { ReviewData, ReviewDocument } from "@/schema/review";
import toObjectId from "@/utils/toObjectId";
import validateReviewData, {
  validateReviewDocument,
} from "@/validators/review";

/**
 * Maps application-level review data into a MongoDB review document.
 * @param reviewData - The review data to map.
 * @returns The MongoDB review document.
 */
export function mapReviewDocumentToReviewData(
  reviewDocument: ReviewDocument,
): ReviewData {
  const validatedReviewDocument = validateReviewDocument(reviewDocument);

  return validateReviewData({
    _id: validatedReviewDocument._id.toString(),
    userId: validatedReviewDocument.userId.toString(),
    destinationName: validatedReviewDocument.destinationName,
    whenVisited: validatedReviewDocument.whenVisited,
    description: validatedReviewDocument.description,
    experience: validatedReviewDocument.experience,
    destinationPhotoUrls: validatedReviewDocument.destinationPhotoUrls,
    datePosted: validatedReviewDocument.datePosted,
  });
}

/**
 * Maps application-level review data into a MongoDB review document.
 * @param reviewData - The review data to map.
 * @returns The MongoDB review document.
 */
export function mapReviewDataToReviewDocument(
  reviewData: ReviewData,
): ReviewDocument {
  const validatedReviewData = validateReviewData(reviewData);

  return validateReviewDocument({
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
