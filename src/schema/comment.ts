import z from "zod";
import { ObjectId } from "mongodb";

/**
 * MongoDB document schema for comments.
 *
 * Uses native ObjectId values for persisted records.
 */
export const CommentDataDocumentSchema = z.object({
  _id: z.instanceof(ObjectId),
  parentCommentId: z.instanceof(ObjectId).nullable(),
  reviewId: z.instanceof(ObjectId),
  commentedBy: z.instanceof(ObjectId),
  commentedOn: z.date(),
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be at most 500 characters"),
  // array of ObjectIds representing comments that are replies to this comment
  replyCommentIds: z.array(z.instanceof(ObjectId)),
  // array of ObjectIds representing users who liked the comment
  idsOfUsersWhoLiked: z.array(z.instanceof(ObjectId)),
  // array of ObjectIds representing users who unliked the comment
  idsOfUsersWhoDisliked: z.array(z.instanceof(ObjectId)),
});

/**
 * Application-level comment schema.
 *
 * Uses string IDs for values sent across app boundaries (UI/API).
 */
export const CommentDataSchema = z.object({
  _id: z.string(),
  parentCommentId: z.string().nullable(),
  reviewId: z.string(),
  commentedBy: z.string(),
  commentedOn: z.date(),
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be at most 500 characters"),
  // array of strings representing IDs of comments that are replies to this comment
  replyCommentIds: z.array(z.string()),
  // array of strings representing user IDs who liked the comment
  idsOfUsersWhoLiked: z.array(z.string()),
  // array of strings representing user IDs who unliked the comment
  idsOfUsersWhoDisliked: z.array(z.string()),
});

/**
 * Enriched comment schema containing commenter profile fields.
 */
export const CommentDataWithCommenterDataSchema = CommentDataSchema.extend({
  commenterName: z.string(),
  profilePictureUrl: z.string(),
});

/**
 * MongoDB document schema enriched with commenter profile fields.
 */
export const CommentDataWithCommenterDataDocumentSchema =
  CommentDataDocumentSchema.extend({
    commenterName: z.string(),
    profilePictureUrl: z.string(),
  });

/** Type inferred from CommentDataDocumentSchema. */
export type CommentDataDocument = z.infer<typeof CommentDataDocumentSchema>;

/** Type inferred from CommentDataSchema. */
export type CommentData = z.infer<typeof CommentDataSchema>;

/** Type inferred from CommentDataWithCommenterDataSchema. */
export type CommentDataWithCommenterData = z.infer<
  typeof CommentDataWithCommenterDataSchema
>;

/** Type inferred from CommentDataWithCommenterDataDocumentSchema. */
export type CommentDataWithCommenterDataDocument = z.infer<
  typeof CommentDataWithCommenterDataDocumentSchema
>;
