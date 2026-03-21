import { getReviewsCollection } from "@/database/mongoDB";
import {
  mapReviewDataDocumentToReviewData,
  mapReviewDataToReviewDataDocument,
} from "@/mappers/review";
import { ReviewData, ReviewDataDocument } from "@/schema/review";
import { ObjectId } from "bson";
import { cacheTag, revalidateTag } from "next/cache";
import { cache } from "react";

export async function insertReviewData(
  reviewData: Omit<ReviewData, "_id">,
): Promise<string> {
  // creating review document to be inserted
  const reviewDataDocument: ReviewDataDocument =
    mapReviewDataToReviewDataDocument({
      ...reviewData,
      _id: new ObjectId().toString(),
    });

  const collection = await getReviewsCollection();
  await collection.insertOne(reviewDataDocument);

  revalidateTag("reviewsData", "max");
  revalidateTag(`reviewsData-userId-${reviewData.userId}`, "max");

  return reviewDataDocument._id.toString();
}

export const getReviewData = cache(async function (
  reviewId: string,
): Promise<ReviewData | null> {
  "use cache";
  cacheTag(`reviewData-reviewId-${reviewId}`);

  const collection = await getReviewsCollection();
  const reviewDataDocument = await collection.findOne({
    _id: new ObjectId(reviewId),
  });

  return reviewDataDocument
    ? mapReviewDataDocumentToReviewData(reviewDataDocument)
    : null;
});

export async function getReviewsDataByUserId(
  userId: string,
): Promise<ReviewData[]> {
  "use cache";
  cacheTag(`reviewsData-userId-${userId}`);

  const collection = await getReviewsCollection();

  const reviewDataDocuments = await collection
    .find({ userId: new ObjectId(userId) })
    .sort({ datePosted: -1 })
    .toArray();

  return reviewDataDocuments.map((doc) =>
    mapReviewDataDocumentToReviewData(doc),
  );
}

export async function getReviewsDataByIds(
  reviewIds: string[],
): Promise<ReviewData[]> {
  if (reviewIds.length === 0) return [];

  const collection = await getReviewsCollection();
  const objectIds = reviewIds.map((id) => new ObjectId(id));

  const reviewDataDocuments = await collection
    .find({ _id: { $in: objectIds } })
    .sort({ datePosted: -1 })
    .toArray();

  return reviewDataDocuments.map((doc) =>
    mapReviewDataDocumentToReviewData(doc),
  );
}

export async function getReviewsCount(): Promise<number> {
  "use cache";
  cacheTag("reviewsData");

  const collection = await getReviewsCollection();
  return collection.countDocuments({});
}

export async function getReviewsData({
  pageSize = 10,
  page = 1,
}: {
  pageSize?: number;
  page?: number;
}): Promise<ReviewData[]> {
  "use cache";
  cacheTag("reviewsData");

  const collection = await getReviewsCollection();

  const reviewDataDocuments = await collection
    .find({})
    .sort({ datePosted: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  // creating reviews data to be returned
  return reviewDataDocuments.map((reviewDataDocument) =>
    mapReviewDataDocumentToReviewData(reviewDataDocument),
  );
}

export async function getMostRecentReviews(): Promise<ReviewData[]> {
  "use cache";
  cacheTag("reviewsData");

  const collection = await getReviewsCollection();

  const reviewDataDocuments = await collection
    .find({})
    .sort({ datePosted: -1 })
    .limit(4)
    .toArray();

  return reviewDataDocuments.map((reviewDataDocument) =>
    mapReviewDataDocumentToReviewData(reviewDataDocument),
  );
}
