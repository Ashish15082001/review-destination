import z from "zod";
import { ObjectId } from "mongodb";

export const LikeDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId), // reviewId
  likes: z.array(
    z.object({
      userId: z.instanceof(ObjectId),
      likedOn: z.date(),
    }),
  ),
});

export const LikeDataSchema = z.object({
  reviewId: z.string(),
  likes: z.array(
    z.object({
      userId: z.string(),
      likedOn: z.date(),
    }),
  ),
});

export type LikeDataDocument = z.infer<typeof LikeDataDocumentSchema>;
export type LikeData = z.infer<typeof LikeDataSchema>;
