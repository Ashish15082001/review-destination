import z from "zod";
import { ObjectId } from "mongodb";

export const ReviewLikeDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId), // reviewId
  likes: z.array(
    z.object({
      userId: z.instanceof(ObjectId),
      likedOn: z.date(),
    }),
  ),
});

export const ReviewLikeDataSchema = z.object({
  reviewId: z.string(),
  likes: z.array(
    z.object({
      userId: z.string(),
      likedOn: z.date(),
    }),
  ),
});

export type ReviewLikeDataDocument = z.infer<
  typeof ReviewLikeDataDocumentSchema
>;
export type ReviewLikeData = z.infer<typeof ReviewLikeDataSchema>;
