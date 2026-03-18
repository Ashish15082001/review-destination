import {
  ReviewData,
  ReviewDataBrowser,
  ReviewDataBrowserSchema,
  ReviewDataDocument,
  ReviewDataDocumentSchema,
  ReviewDataSchema,
} from "@/schema/review";

/**
 * Validates review data used in the application layer.
 * @param reviewData - The review payload to validate.
 * @returns The parsed and validated review data.
 * @throws {Error} If validation fails.
 */
export default function validateReviewData(reviewData: ReviewData): ReviewData {
  const parseResult = ReviewDataSchema.safeParse(reviewData);

  if (!parseResult.success)
    throw new Error(`Invalid review data: ${parseResult.error.message}`);

  return parseResult.data;
}

/**
 * Validates a MongoDB review document.
 * @param reviewDataDocument - The review document to validate.
 * @returns The parsed and validated review document.
 * @throws {Error} If validation fails.
 */
export function validateReviewDataDocument(
  reviewDataDocument: ReviewDataDocument,
): ReviewDataDocument {
  const parseResult = ReviewDataDocumentSchema.safeParse(reviewDataDocument);

  if (!parseResult.success)
    throw new Error(
      `Invalid review data document: ${parseResult.error.message}`,
    );

  return parseResult.data;
}

/**
 * Validates review form payload coming from the browser.
 * @param reviewDataBrowser - Browser submitted review payload.
 * @returns The parsed and validated browser payload.
 * @throws {Error} If validation fails.
 */
export function validateReviewDataBrowser(
  reviewDataBrowser: ReviewDataBrowser,
): ReviewDataBrowser {
  const parseResult = ReviewDataBrowserSchema.safeParse(reviewDataBrowser);

  if (!parseResult.success)
    throw new Error(
      `Invalid review data from browser: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
