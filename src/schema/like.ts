import z from "zod";
import { ObjectId } from "mongodb";

/**
 * MongoDB representation of a like document.
 */
export const LikeDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  reviewId: z.instanceof(ObjectId),
  likedBy: z.instanceof(ObjectId),
  likedOn: z.date(),
});

/**
 * Application-level representation of a like.
 */
export const LikeDataSchema = z.object({
  _id: z.string(),
  reviewId: z.string(),
  likedBy: z.string(),
  likedOn: z.date(),
});

/**
 * Inferred TypeScript type for MongoDB like documents.
 */
export type LikeDocument = z.infer<typeof LikeDocumentSchema>;

/**
 * Inferred TypeScript type for application-level likes.
 */
export type LikeData = z.infer<typeof LikeDataSchema>;
