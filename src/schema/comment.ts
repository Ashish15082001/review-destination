import z from "zod";
import { ObjectId } from "mongodb";

export const CommentDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  reviewId: z.instanceof(ObjectId),
  commentedBy: z.instanceof(ObjectId),
  commentedOn: z.date(),
  comment: z.string(),
});

export const CommentDataSchema = z.object({
  _id: z.string(),
  reviewId: z.string(),
  commentedBy: z.string(),
  commentedOn: z.date(),
  comment: z.string(),
});

export type CommentDataDocument = z.infer<typeof CommentDataDocumentSchema>;
export type CommentData = z.infer<typeof CommentDataSchema>;
