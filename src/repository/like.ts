import { getLikesCollection } from "@/database/mongoDB";
import {
  mapLikeDataDocumentToLikeData,
  mapLikeDataToLikeDataDocument,
} from "@/mappers/like";
import { LikeData, LikeDataDocument } from "@/schema/like";
import validateLikeData from "@/validators/like";
import { ObjectId } from "bson";

export async function insertLikeData(
  likeData: Omit<LikeData, "_id">,
): Promise<LikeData> {
  const collection = await getLikesCollection();

  const validatedLikeData = validateLikeData({
    ...likeData,
    _id: new ObjectId().toString(),
  });
  const likeDataDocument: LikeDataDocument =
    mapLikeDataToLikeDataDocument(validatedLikeData);

  // make sure that current user hasn't already liked the review by checking if there's an existing like  with the same reviewId and likedBy
  const existingLikeDataDocument = await collection.findOne({
    reviewId: likeDataDocument.reviewId,
    likedBy: likeDataDocument.likedBy,
  });

  if (existingLikeDataDocument) {
    const existingLikeData: LikeData = mapLikeDataDocumentToLikeData(
      existingLikeDataDocument,
    );
    return existingLikeData;
  }

  await collection.insertOne(likeDataDocument);

  // revalidateTag(`likesData-reviewId-${likeData.reviewId}`, "max");

  return validatedLikeData;
}

export async function getLikeData({
  likeId,
}: {
  likeId: string;
}): Promise<LikeData | null> {
  // "use cache";
  // cacheTag(`likeData-${likeId}`);

  const collection = await getLikesCollection();

  const likeDataDocument = await collection.findOne({
    _id: new ObjectId(likeId),
  });

  return likeDataDocument
    ? mapLikeDataDocumentToLikeData(likeDataDocument)
    : null;
}

export async function getLikesDataByReviewId({
  reviewId,
}: {
  reviewId: string;
}): Promise<LikeData[]> {
  // "use cache";
  // cacheTag(`likesData-reviewId-${reviewId}`);

  const collection = await getLikesCollection();

  const likeDataDocuments = await collection
    .find({
      reviewId: new ObjectId(reviewId),
    })
    .toArray();

  if (!likeDataDocuments || likeDataDocuments.length === 0) return [];

  return likeDataDocuments.map((likeDataDocument) =>
    mapLikeDataDocumentToLikeData(likeDataDocument),
  );
}

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
