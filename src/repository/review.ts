import {
  getCommentsCollection,
  getLikesCollection,
  getReviewsCollection,
} from "@/database/mongoDB";
import {
  mapReviewDocumentToReviewData,
  mapReviewDataToReviewDocument,
} from "@/mappers/review";
import { ReviewData, ReviewDocument } from "@/schema/review";
import { ObjectId } from "bson";
import { cacheTag } from "next/cache";
import { cache } from "react";

/**
 * Validates and inserts a new review data into the reviews collection.
 * @param reviewData - The review data to insert.
 * @returns The ID of the inserted review data.
 */
export async function insertReviewData(
  reviewData: Omit<ReviewData, "_id">,
): Promise<string> {
  const reviewDocument: ReviewDocument = mapReviewDataToReviewDocument({
    ...reviewData,
    _id: new ObjectId().toString(),
  });

  const collection = await getReviewsCollection();
  await collection.insertOne(reviewDocument);

  return reviewDocument._id.toString();
}

/**
 * Validates and retrieves review data by its ID.
 * @param reviewId - The ID of the review data to retrieve.
 * @returns The review data if found, otherwise null.
 */
export const getReviewData = cache(async function (
  reviewId: string,
): Promise<ReviewData | null> {
  "use cache";
  cacheTag(`reviewData-reviewId-${reviewId}`);

  const collection = await getReviewsCollection();
  const reviewDocument = await collection.findOne({
    _id: new ObjectId(reviewId),
  });

  return reviewDocument ? mapReviewDocumentToReviewData(reviewDocument) : null;
});

/**
 * Retrieves multiple comments data by their IDs, each enriched with the commenter's info.
 * @param commentIds - An array of comment ID strings to look up.
 * @returns An array of validated comments with commenter data. Returns an empty array if none are found.
 */
export async function getReviewsDataByReviewIds({
  reviewIds,
}: {
  reviewIds: Array<string>;
}): Promise<Array<ReviewData>> {
  const reviewDataPromises = reviewIds.map((reviewId) =>
    getReviewData(reviewId),
  );

  const reviewsData = await Promise.all(reviewDataPromises);

  return reviewsData.filter((reviewData) => reviewData !== null);
}

/**
 * Validates and retrieves review data by the user ID of the reviewer.
 * @param userId - The ID of the user who posted the reviews.
 * @returns The review data if found, otherwise null.
 */
export async function getReviewsDataByUserId(
  userId: string,
): Promise<ReviewData[]> {
  const collection = await getReviewsCollection();
  const reviewDocumentIds = await collection
    .find(
      { userId: new ObjectId(userId) },
      {
        projection: { _id: 1 },
      },
    )
    .sort({ datePosted: -1 })
    .toArray();

  const reviewIds = reviewDocumentIds.map((reviewDocument) =>
    reviewDocument._id.toString(),
  );

  const reviewsData = await getReviewsDataByReviewIds({ reviewIds });

  return reviewsData;
}

/**
 * Retrieves the total count of reviews in the reviews collection.
 * @returns The total count of reviews in the reviews collection.
 */
export async function getReviewsCount(): Promise<number> {
  // "use cache";
  // cacheTag("reviewsData");

  const collection = await getReviewsCollection();
  return collection.countDocuments({});
}

/**
 * Retrieves a paginated list of review data.
 * @param pageSize - The number of reviews to retrieve per page (default is 10).
 * @param page - The page number to retrieve (default is 1).
 * @returns An array of review data for the specified page.
 */
export async function getReviewsDataByPage({
  pageSize = 10,
  page = 1,
}: {
  pageSize?: number;
  page?: number;
}): Promise<ReviewData[]> {
  const collection = await getReviewsCollection();

  const reviewDocumentIds = await collection
    .find({}, { projection: { _id: 1 } })
    .sort({ datePosted: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const reviewIds = reviewDocumentIds.map((reviewDocument) =>
    reviewDocument._id.toString(),
  );

  const reviewsData = await getReviewsDataByReviewIds({ reviewIds });

  return reviewsData;
}

/**
 * Retrieves the most recent reviews data.
 * @return An array of the most recent reviews data.
 *
 * Note: The number of recent reviews retrieved is currently set to 4, but this can be adjusted as needed.
 */
export async function getMostRecentReviews(): Promise<ReviewData[]> {
  const collection = await getReviewsCollection();

  const reviewDocumentIds = await collection
    .find({}, { projection: { _id: 1 } })
    .sort({ datePosted: -1 })
    .limit(4)
    .toArray();

  const reviewIds = reviewDocumentIds.map((reviewDocument) =>
    reviewDocument._id.toString(),
  );

  const reviewsData = await getReviewsDataByReviewIds({ reviewIds });

  return reviewsData;
}

/**
 * Retrieves statistics for a review, including the total number of comments and likes.
 * Results are memoised per request via React's `cache`.
 * @param reviewId - The string representation of the review's ObjectId.
 * @returns An object containing the review statistics. Returns an empty object if none are found.
 */
export const getReviewStatsData = async function ({
  reviewId,
}: {
  reviewId: string;
}): Promise<{
  totalComments: number;
  totalLikes: number;
}> {
  const commentsCollection = await getCommentsCollection();
  const likesCollection = await getLikesCollection();

  const totalComments = await commentsCollection.countDocuments({
    reviewId: new ObjectId(reviewId),
  });
  const totalLikes = await likesCollection.countDocuments({
    reviewId: new ObjectId(reviewId),
  });

  return {
    totalComments,
    totalLikes,
  };
};
