import z from "zod";
import { ObjectId } from "mongodb";

export const CommentDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  reviewId: z.instanceof(ObjectId),
  commentedBy: z.instanceof(ObjectId),
  commentedOn: z.date(),
  comment: z.string(),
  replyCommentId: z.instanceof(ObjectId).optional(),
  // array of ObjectIds representing users who liked the comment
  idsOfUsersWhoLiked: z.array(z.instanceof(ObjectId)),
  // array of ObjectIds representing users who unliked the comment
  idsOfUsersWhoDisliked: z.array(z.instanceof(ObjectId)),
});

export const CommentDataSchema = z.object({
  _id: z.string(),
  reviewId: z.string(),
  commentedBy: z.string(),
  commentedOn: z.date(),
  comment: z.string(),
  replyCommentId: z.string().optional(),
  // array of strings representing user IDs who liked the comment
  idsOfUsersWhoLiked: z.array(z.string()),
  // array of strings representing user IDs who unliked the comment
  idsOfUsersWhoDisliked: z.array(z.string()),
});

export type CommentDataDocument = z.infer<typeof CommentDataDocumentSchema>;
export type CommentData = z.infer<typeof CommentDataSchema>;
