import { getLikesCollection } from "@/database/mongoDB";
import {
  mapLikeDocumentToLikeData,
  mapLikeDataToLikeDocument,
} from "@/mappers/like";
import { LikeData, LikeDocument } from "@/schema/like";
import { ObjectId } from "bson";
import { cacheTag, revalidateTag } from "next/cache";

/**
 * Validates and inserts a new like data into the likes collection.
 * @param likeData - The like data to insert.
 * @returns The inserted like data with its generated _id.
 */
export async function insertLikeData(
  likeData: Omit<LikeData, "_id">,
): Promise<LikeData> {
  const collection = await getLikesCollection();

  const validatedLikeDocument: LikeDocument = mapLikeDataToLikeDocument({
    ...likeData,
    _id: new ObjectId().toString(),
  });

  // make sure that current user hasn't already liked the review by checking if there's an existing like  with the same reviewId and likedBy
  const existingLikeDocument = await collection.findOne({
    reviewId: validatedLikeDocument.reviewId,
    likedBy: validatedLikeDocument.likedBy,
  });

  if (existingLikeDocument) {
    const existingLikeData: LikeData =
      mapLikeDocumentToLikeData(existingLikeDocument);
    return existingLikeData;
  }

  await collection.insertOne(validatedLikeDocument);

  return mapLikeDocumentToLikeData(validatedLikeDocument);
}

/**
 * Validates and retrieves like data by its ID.
 * @param likeData - The like data to insert.
 * @returns The inserted like data with its generated _id.
 */
export async function getLikeData({
  likeId,
}: {
  likeId: string;
}): Promise<LikeData | null> {
  "use cache";
  cacheTag(`likeData-likeId-${likeId}`);

  const collection = await getLikesCollection();
  const likeDocument = await collection.findOne({
    _id: new ObjectId(likeId),
  });

  return likeDocument ? mapLikeDocumentToLikeData(likeDocument) : null;
}

export async function getLikesDataByLikeIds({
  likeIds,
}: {
  likeIds: Array<string>;
}): Promise<Array<LikeData>> {
  const likeDataPromises = likeIds.map((likeId) => getLikeData({ likeId }));

  const likesData = await Promise.all(likeDataPromises);

  return likesData.filter((likeData) => likeData !== null);
}

/**
 * Validates and retrieves like data by review ID.
 * @param reviewId - The ID of the review for which to retrieve like data.
 * @returns An array of like data associated with the specified review ID.
 */
export async function getLikesDataByReviewId({
  reviewId,
}: {
  reviewId: string;
}): Promise<Array<LikeData>> {
  const collection = await getLikesCollection();
  const likeDocumentIds = await collection
    .find(
      {
        reviewId: new ObjectId(reviewId),
      },
      {
        projection: { _id: 1 },
      },
    )
    .toArray();

  const likeIds = likeDocumentIds.map((doc) => doc._id.toString());

  const likesData = await getLikesDataByLikeIds({
    likeIds,
  });

  return likesData;
}

/**
 * Validates and deletes like data by its ID.
 * @param likeId - The ID of the like data to delete.
 * @param reviewId - The ID of the review associated with the like data (used for cache revalidation).
 * @returns A boolean indicating whether the like data was successfully deleted.
 */
export async function deleteLikeData({
  likeId,
  reviewId,
}: {
  likeId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getLikesCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(likeId),
  });

  // revalidateTag(`likesData-reviewId-${reviewId}`, "max");

  return result.deletedCount > 0;
}
