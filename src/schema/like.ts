import z from "zod";
import { ObjectId } from "mongodb";

export const LikeDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  reviewId: z.instanceof(ObjectId),
  likedBy: z.instanceof(ObjectId),
  likedOn: z.date(),
});

export const LikeDataSchema = z.object({
  _id: z.string(),
  reviewId: z.string(),
  likedBy: z.string(),
  likedOn: z.date(),
});

export type LikeDataDocument = z.infer<typeof LikeDataDocumentSchema>;
export type LikeData = z.infer<typeof LikeDataSchema>;
