import "server-only";

import {
  CommentData,
  CommentDataDocument,
  CommentDataDocumentSchema,
  CommentDataSchema,
} from "@/schema/comment";
import {
  LikeData,
  LikeDataDocument,
  LikeDataDocumentSchema,
  LikeDataSchema,
} from "@/schema/like";
import {
  ReviewData,
  ReviewDataDocument,
  ReviewDataDocumentSchema,
  ReviewDataSchema,
} from "@/schema/review";
import {
  UserData,
  UserDataDocument,
  UserDataDocumentSchema,
  UserDataSchema,
} from "@/schema/user";
import { MongoClient, Db, ObjectId, Collection } from "mongodb";
import { cookies } from "next/headers";
import {
  UserSessionData,
  UserSessionDataDocument,
  UserSessionDataDocumentSchema,
  UserSessionDataSchema,
} from "@/schema/userSession";
import { cache } from "react";
import { cacheTag, revalidateTag } from "next/cache";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let _prodClientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local");
  }
  const uri: string = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the client across hot reloads
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise!;
  } else {
    // In production mode, cache the promise at module scope
    if (!_prodClientPromise) {
      const client = new MongoClient(uri);
      _prodClientPromise = client.connect();
    }
    return _prodClientPromise;
  }
}

export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db("review-destination");
}

// ############################################
// ###################### reviews related functions ######################
// ############################################

export async function getReviewsCollection(): Promise<
  Collection<ReviewDataDocument>
> {
  const db = await getDatabase();
  return db.collection("reviews");
}

export async function insertReviewData(
  reviewData: Omit<ReviewData, "_id">,
): Promise<string> {
  // creating review document to be inserted
  const newReviewDataDocument: ReviewDataDocument = {
    ...reviewData,
    userId: new ObjectId(reviewData.userId),
    _id: new ObjectId(),
  };
  const parseResult = ReviewDataDocumentSchema.safeParse(newReviewDataDocument);

  if (!parseResult.success) {
    throw new Error(`Invalid review data: ${parseResult.error.message}`);
  }

  const collection = await getReviewsCollection();
  await collection.insertOne(parseResult.data);

  revalidateTag("reviewsData", "max");

  return newReviewDataDocument._id.toString();
}

export const getReviewData = cache(async function (
  reviewId: string,
): Promise<ReviewData | null> {
  "use cache";

  cacheTag(`reviewData-${reviewId}`);

  const collection = await getReviewsCollection();
  const reviewDataDocument = await collection.findOne({
    _id: new ObjectId(reviewId),
  });

  if (!reviewDataDocument) return null;

  // creating review data to be returned
  const reviewData: ReviewData = {
    ...reviewDataDocument,
    _id: reviewDataDocument._id.toString(),
    userId: reviewDataDocument.userId.toString(),
  };

  const parseResult = ReviewDataSchema.safeParse(reviewData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid review data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
});

export async function getReviewsDataByUserId(
  userId: string,
): Promise<ReviewData[]> {
  const collection = await getReviewsCollection();

  const reviewDataDocuments = await collection
    .find({ userId: new ObjectId(userId) })
    .sort({ datePosted: -1 })
    .toArray();

  const reviewsData: ReviewData[] = reviewDataDocuments.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
  }));

  const parseResult = ReviewDataSchema.array().safeParse(reviewsData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid reviews data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

export async function getReviewsByIds(
  reviewIds: string[],
): Promise<ReviewData[]> {
  if (reviewIds.length === 0) return [];

  const collection = await getReviewsCollection();
  const objectIds = reviewIds.map((id) => new ObjectId(id));

  const reviewDataDocuments = await collection
    .find({ _id: { $in: objectIds } })
    .sort({ datePosted: -1 })
    .toArray();

  const reviewsData: ReviewData[] = reviewDataDocuments.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
  }));

  const parseResult = ReviewDataSchema.array().safeParse(reviewsData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid reviews data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

export async function getReviewsData({
  pageSize = 10,
  cursor,
}: {
  pageSize?: number;
  // objectId string of the last review from the previous page, used for pagination.
  cursor?: string;
}): Promise<ReviewData[]> {
  "use cache";

  cacheTag("reviewsData");

  const collection = await getReviewsCollection();

  const query = cursor ? { _id: { $lt: new ObjectId(cursor) } } : {};

  const reviewDataDocuments = await collection
    .find(query)
    .sort({ datePosted: -1 })
    .limit(pageSize)
    .toArray();

  // creating reviews data to be returned
  const reviewsData: ReviewData[] = reviewDataDocuments.map(
    (reviewDataDocument) => ({
      ...reviewDataDocument,
      _id: reviewDataDocument._id.toString(),
      userId: reviewDataDocument.userId.toString(),
    }),
  );

  const parseResult = ReviewDataSchema.array().safeParse(reviewsData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid reviews data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
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

  const reviewsData: ReviewData[] = reviewDataDocuments.map(
    (reviewDataDocument) => ({
      ...reviewDataDocument,
      _id: reviewDataDocument._id.toString(),
      userId: reviewDataDocument.userId.toString(),
    }),
  );

  const parseResult = ReviewDataSchema.array().safeParse(reviewsData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid reviews data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

// ############################################
// ###################### like related functions ######################
// ############################################

export async function getLikesCollection(): Promise<
  Collection<LikeDataDocument>
> {
  const db = await getDatabase();
  return db.collection("likes");
}

export async function insertLikeData(
  likeData: Omit<LikeData, "_id">,
): Promise<LikeData> {
  const collection = await getLikesCollection();
  const likeDataDocument: LikeDataDocument = {
    ...likeData,
    _id: new ObjectId(),
    reviewId: new ObjectId(likeData.reviewId),
    likedBy: new ObjectId(likeData.likedBy),
  };

  // make sure that current user hasn't already liked the review by checking if there's an existing like document with the same reviewId and likedBy
  const existingLike = await collection.findOne({
    reviewId: likeDataDocument.reviewId,
    likedBy: likeDataDocument.likedBy,
  });

  if (existingLike) {
    throw new Error("User has already liked this review");
  }

  const parseResult = LikeDataDocumentSchema.safeParse(likeDataDocument);

  if (!parseResult.success) {
    throw new Error(`Invalid like data: ${parseResult.error.message}`);
  }

  await collection.insertOne(parseResult.data);

  revalidateTag(`likesData-reviewId-${likeData.reviewId}`, "max");

  return {
    ...likeDataDocument,
    _id: likeDataDocument._id.toString(),
    reviewId: likeDataDocument.reviewId.toString(),
    likedBy: likeDataDocument.likedBy.toString(),
  };
}

export async function getLikeData({
  likeId,
}: {
  likeId: string;
}): Promise<LikeData | null> {
  "use cache";
  cacheTag(`likeData-${likeId}`);

  const collection = await getLikesCollection();

  const LikeDataDocument = await collection.findOne({
    _id: new ObjectId(likeId),
  });

  if (!LikeDataDocument) return null;

  const LikeData: LikeData = {
    ...LikeDataDocument,
    _id: LikeDataDocument._id.toString(),
    reviewId: LikeDataDocument.reviewId.toString(),
    likedBy: LikeDataDocument.likedBy.toString(),
  };

  const parseResult = LikeDataSchema.safeParse(LikeData);

  if (!parseResult.success) {
    throw new Error(`Invalid like data from DB: ${parseResult.error.message}`);
  }

  return parseResult.data;
}

export async function getLikesDataByReviewId({
  reviewId,
}: {
  reviewId: string;
}): Promise<LikeData[]> {
  "use cache";
  cacheTag(`likesData-reviewId-${reviewId}`);

  const collection = await getLikesCollection();

  const LikeDataDocuments = await collection
    .find({
      reviewId: new ObjectId(reviewId),
    })
    .toArray();

  if (!LikeDataDocuments || LikeDataDocuments.length === 0) return [];

  const LikeData: LikeData[] = LikeDataDocuments.map((LikeDataDocument) => ({
    ...LikeDataDocument,
    _id: LikeDataDocument._id.toString(),
    reviewId: LikeDataDocument.reviewId.toString(),
    likedBy: LikeDataDocument.likedBy.toString(),
  }));

  const parseResult = LikeDataSchema.array().safeParse(LikeData);

  if (!parseResult.success) {
    throw new Error(`Invalid like data from DB: ${parseResult.error.message}`);
  }

  return parseResult.data;
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

  revalidateTag(`likesData-reviewId-${reviewId}`, "max");

  return result.deletedCount > 0;
}

// ############################################
// ###################### comment related functions ######################
// ############################################

export async function getCommentsCollection(): Promise<
  Collection<CommentDataDocument>
> {
  const db = await getDatabase();
  return db.collection("comments");
}

export async function insertCommentData(
  commentData: Omit<CommentData, "_id">,
): Promise<string> {
  const collection = await getCommentsCollection();
  const commentDataDocument: CommentDataDocument = {
    ...commentData,
    _id: new ObjectId(),
    reviewId: new ObjectId(commentData.reviewId),
    commentedBy: new ObjectId(commentData.commentedBy),
    idsOfUsersWhoDisliked: commentData.idsOfUsersWhoDisliked.map(
      (userId) => new ObjectId(userId),
    ),
    idsOfUsersWhoLiked: commentData.idsOfUsersWhoLiked.map(
      (userId) => new ObjectId(userId),
    ),
    replyCommentId: undefined,
  };

  const parseResult = CommentDataDocumentSchema.safeParse(commentDataDocument);

  if (!parseResult.success) {
    throw new Error(`Invalid comment data: ${parseResult.error.message}`);
  }

  await collection.insertOne(parseResult.data);

  revalidateTag(`commentsData-reviewId-${commentData.reviewId}`, "max");

  return commentDataDocument._id.toString();
}

export async function getCommentData({
  commentId,
}: {
  commentId: string;
}): Promise<CommentData | null> {
  "use cache";
  cacheTag(`commentData-${commentId}`);

  const collection = await getCommentsCollection();

  const commentDataDocument = await collection.findOne({
    _id: new ObjectId(commentId),
  });

  if (!commentDataDocument) return null;

  const commentData: CommentData = {
    ...commentDataDocument,
    _id: commentDataDocument._id.toString(),
    reviewId: commentDataDocument.reviewId.toString(),
    commentedBy: commentDataDocument.commentedBy.toString(),
    idsOfUsersWhoLiked: commentDataDocument.idsOfUsersWhoLiked.map((userId) =>
      userId.toString(),
    ),
    idsOfUsersWhoDisliked: commentDataDocument.idsOfUsersWhoDisliked.map(
      (userId) => userId.toString(),
    ),
    replyCommentId: commentDataDocument.replyCommentId
      ? commentDataDocument.replyCommentId.toString()
      : undefined,
  };

  const parseResult = CommentDataSchema.safeParse(commentData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid comment data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

export const getCommentsDataByReviewId = cache(async function ({
  reviewId,
}: {
  reviewId: string;
}): Promise<CommentData[]> {
  "use cache";

  cacheTag(`commentsData-reviewId-${reviewId}`);

  const collection = await getCommentsCollection();

  const commentDataDocuments = await collection
    .find({
      reviewId: new ObjectId(reviewId),
    })
    .toArray();

  if (!commentDataDocuments || commentDataDocuments.length === 0) return [];

  const commentsData: CommentData[] = commentDataDocuments.map(
    (commentDataDocument) => ({
      ...commentDataDocument,
      _id: commentDataDocument._id.toString(),
      reviewId: commentDataDocument.reviewId.toString(),
      commentedBy: commentDataDocument.commentedBy.toString(),
      idsOfUsersWhoLiked: commentDataDocument.idsOfUsersWhoLiked.map((userId) =>
        userId.toString(),
      ),
      idsOfUsersWhoDisliked: commentDataDocument.idsOfUsersWhoDisliked.map(
        (userId) => userId.toString(),
      ),
      replyCommentId: commentDataDocument.replyCommentId
        ? commentDataDocument.replyCommentId.toString()
        : undefined,
    }),
  );

  const parseResult = CommentDataSchema.array().safeParse(commentsData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid comment data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
});

export async function addLikeToComment({
  commentId,
  userId,
  reviewId,
}: {
  commentId: string;
  userId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(commentId) },
    {
      $addToSet: { idsOfUsersWhoLiked: new ObjectId(userId) },
      $pull: { idsOfUsersWhoDisliked: new ObjectId(userId) },
    },
  );

  revalidateTag(`commentData-${commentId}`, "max");
  revalidateTag(`commentsData-reviewId-${reviewId}`, "max");

  return result.modifiedCount > 0;
}

export async function removeLikeFromComment({
  commentId,
  userId,
  reviewId,
}: {
  commentId: string;
  userId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(commentId) },
    {
      $pull: { idsOfUsersWhoLiked: new ObjectId(userId) },
    },
  );

  revalidateTag(`commentData-${commentId}`, "max");
  revalidateTag(`commentsData-reviewId-${reviewId}`, "max");

  return result.modifiedCount > 0;
}

export async function addDislikeToComment({
  commentId,
  userId,
  reviewId,
}: {
  commentId: string;
  userId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(commentId) },
    {
      $addToSet: { idsOfUsersWhoDisliked: new ObjectId(userId) },
      $pull: { idsOfUsersWhoLiked: new ObjectId(userId) },
    },
  );

  revalidateTag(`commentData-${commentId}`, "max");
  revalidateTag(`commentsData-reviewId-${reviewId}`, "max");

  return result.modifiedCount > 0;
}

export async function removeDislikeFromComment({
  commentId,
  userId,
  reviewId,
}: {
  commentId: string;
  userId: string;
  reviewId: string;
}): Promise<boolean> {
  const collection = await getCommentsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(commentId) },
    {
      $pull: { idsOfUsersWhoDisliked: new ObjectId(userId) },
    },
  );

  revalidateTag(`commentData-${commentId}`, "max");
  revalidateTag(`commentsData-reviewId-${reviewId}`, "max");

  return result.modifiedCount > 0;
}

// ############################################
// ###################### User related functions ######################
// ############################################

export async function getUsersCollection(): Promise<
  Collection<UserDataDocument>
> {
  const db = await getDatabase();
  return db.collection("users");
}

export async function getUserDataByEmail({
  email,
}: {
  email: string;
}): Promise<UserData | null> {
  "use cache";
  cacheTag(`userData-email-${email}`);

  const collection = await getUsersCollection();
  const userDataDocument = await collection.findOne({ email });

  if (!userDataDocument) return null;

  const userData: UserData = {
    ...userDataDocument,
    _id: userDataDocument._id.toString(),
    savedReviewesIds: userDataDocument.savedReviewesIds.map((id) =>
      id.toString(),
    ),
  };

  const parseResult = UserDataSchema.safeParse(userData);

  if (!parseResult.success) {
    throw new Error(`Invalid user data from DB: ${parseResult.error.message}`);
  }

  return parseResult.data;
}

export async function getUserDataByUserId({
  userId,
}: {
  userId: string;
}): Promise<UserData | null> {
  "use cache";
  cacheTag(`userData-userId-${userId}`);

  const collection = await getUsersCollection();
  const userDataDocument = await collection.findOne({
    _id: new ObjectId(userId),
  });

  if (!userDataDocument) return null;

  const userData: UserData = {
    ...userDataDocument,
    _id: userDataDocument._id.toString(),
    savedReviewesIds: userDataDocument.savedReviewesIds.map((id) =>
      id.toString(),
    ),
  };

  const parseResult = UserDataSchema.safeParse(userData);

  if (!parseResult.success) {
    throw new Error(`Invalid user data from DB: ${parseResult.error.message}`);
  }

  return parseResult.data;
}

export async function registerNewUser(
  userData: Omit<UserData, "_id">,
): Promise<string> {
  const newUserDataDocumentId = new ObjectId();
  const newUserDataDocument = {
    ...userData,
    _id: newUserDataDocumentId,
  };
  const parseResult = UserDataDocumentSchema.safeParse(newUserDataDocument);

  if (!parseResult.success) {
    throw new Error(`Invalid user data: ${parseResult.error.message}`);
  }

  const collection = await getUsersCollection();
  await collection.insertOne(parseResult.data);
  return newUserDataDocumentId.toString();
}

export async function getUserDataUsingSession(): Promise<UserData | null> {
  const sessionCookie = await cookies();

  const sessionId = sessionCookie.get("sessionId")?.value;

  if (!sessionId) return null;

  const userSessionData = await getUserSessionDataFromMongoDB(sessionId);

  if (!userSessionData || !userSessionData.userId) return null;

  // Reject expired sessions
  if (new Date(userSessionData.expiresOn) < new Date()) return null;

  const userData = await getUserDataByUserId({
    userId: userSessionData.userId,
  });

  return userData;
}

export interface UserStats {
  reviews: {
    /** Total reviews posted by the current user */
    posted: number;
    /** Total reviews the current user has liked */
    likedByMe: number;
    /** Total likes received on the current user's reviews */
    likesReceived: number;
  };
  comments: {
    /** Total comments posted by the current user */
    posted: number;
    /** Total comments received on the current user's reviews */
    receivedOnMyReviews: number;
    /** Total likes the current user has given to comments */
    likesGivenByMe: number;
    /** Total dislikes the current user has given to comments */
    dislikesGivenByMe: number;
    /** Total likes received on the current user's comments */
    likesReceived: number;
    /** Total dislikes received on the current user's comments */
    dislikesReceived: number;
  };
}

export async function getUserStats(): Promise<UserStats | null> {
  const userData = await getUserDataUsingSession();

  if (!userData) return null;

  const userId = new ObjectId(userData._id);

  const [likesCollection, commentsCollection, reviewsCollection] =
    await Promise.all([
      getLikesCollection(),
      getCommentsCollection(),
      getReviewsCollection(),
    ]);

  const postedReviews = await reviewsCollection
    .find({ userId }, { projection: { _id: 1 } })
    .toArray();
  const postedReviewObjectIds = postedReviews.map((r) => r._id);

  const [
    totalReviewsLikedByMe,
    totalLikesMyReviewsGot,
    totalCommentsPosted,
    totalCommentsReceivedOnMyReviews,
    totalCommentLikesMadeByMe,
    totalCommentDislikesMadeByMe,
    myCommentsReactionsAggregation,
  ] = await Promise.all([
    // Total reviews liked by me
    likesCollection.countDocuments({ likedBy: userId }),

    // Total likes my reviews got
    postedReviewObjectIds.length > 0
      ? likesCollection.countDocuments({
          reviewId: { $in: postedReviewObjectIds },
        })
      : Promise.resolve(0),

    // Total comments I posted
    commentsCollection.countDocuments({ commentedBy: userId }),

    // Total comments received on my reviews
    postedReviewObjectIds.length > 0
      ? commentsCollection.countDocuments({
          reviewId: { $in: postedReviewObjectIds },
        })
      : Promise.resolve(0),

    // Total likes I gave to comments
    commentsCollection.countDocuments({ idsOfUsersWhoLiked: userId }),

    // Total dislikes I gave to comments
    commentsCollection.countDocuments({ idsOfUsersWhoDisliked: userId }),

    // Aggregate total likes & dislikes received on my comments
    commentsCollection
      .aggregate<{ totalLikesReceived: number; totalDislikesReceived: number }>(
        [
          { $match: { commentedBy: userId } },
          {
            $group: {
              _id: null,
              totalLikesReceived: { $sum: { $size: "$idsOfUsersWhoLiked" } },
              totalDislikesReceived: {
                $sum: { $size: "$idsOfUsersWhoDisliked" },
              },
            },
          },
        ],
      )
      .toArray(),
  ]);

  const myCommentsReactions = myCommentsReactionsAggregation[0] ?? {
    totalLikesReceived: 0,
    totalDislikesReceived: 0,
  };

  return {
    reviews: {
      posted: postedReviewObjectIds.length,
      likedByMe: totalReviewsLikedByMe,
      likesReceived: totalLikesMyReviewsGot,
    },
    comments: {
      posted: totalCommentsPosted,
      receivedOnMyReviews: totalCommentsReceivedOnMyReviews,
      likesGivenByMe: totalCommentLikesMadeByMe,
      dislikesGivenByMe: totalCommentDislikesMadeByMe,
      likesReceived: myCommentsReactions.totalLikesReceived,
      dislikesReceived: myCommentsReactions.totalDislikesReceived,
    },
  };
}

// ############################################
// ###################### User Sessionrelated functions ######################
// ############################################

export async function getUsersSessionCollection(): Promise<
  Collection<UserSessionDataDocument>
> {
  const db = await getDatabase();
  return db.collection("usersSessions");
}

export async function getUserSessionDataFromMongoDB(
  sessionId: string,
): Promise<UserSessionData | null> {
  "use cache";

  cacheTag(`userSessionData-${sessionId}`);

  const userSessionsCollection = await getUsersSessionCollection();

  const userSessionDataDocument = await userSessionsCollection.findOne({
    _id: new ObjectId(sessionId),
  });

  if (!userSessionDataDocument) return null;

  const userSessionData: UserSessionData = {
    ...userSessionDataDocument,
    _id: userSessionDataDocument._id.toString(),
    userId: userSessionDataDocument.userId.toString(),
  };

  const parseResult = UserSessionDataSchema.safeParse(userSessionData);

  if (!parseResult.success) {
    throw new Error(`Invalid user session data: ${parseResult.error.message}`);
  }

  return parseResult.data;
}

export async function insertUserSession(
  userSessionData: Omit<UserSessionData, "_id">,
): Promise<string> {
  const collection = await getUsersSessionCollection();
  const userSessionDataDocumentId = new ObjectId();
  const userSessionDataDocument: UserSessionDataDocument = {
    _id: userSessionDataDocumentId,
    userId: new ObjectId(userSessionData.userId),
    expiresOn: userSessionData.expiresOn,
  };

  const parseResult = UserSessionDataDocumentSchema.safeParse(
    userSessionDataDocument,
  );

  if (!parseResult.success) {
    throw new Error(`Invalid user session data: ${parseResult.error.message}`);
  }

  await collection.insertOne(parseResult.data);

  return userSessionDataDocumentId.toString();
}

export async function deleteUserSession(_id: string): Promise<boolean> {
  const collection = await getUsersSessionCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });
  return result.deletedCount > 0;
}
