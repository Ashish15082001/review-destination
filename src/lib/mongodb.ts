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
import { cacheTag, updateTag } from "next/cache";

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

// ###################### reviews related functions ######################

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

  updateTag("reviewsData");

  return newReviewDataDocument._id.toString();
}

export const getReviewData = cache(async function (
  reviewId: string,
): Promise<ReviewData | null> {
  "use cache";

  console.log("getReviewData called with reviewId:", reviewId);
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

export async function getAllReviewsData(): Promise<ReviewData[]> {
  "use cache";

  cacheTag("reviewsData");

  const collection = await getReviewsCollection();
  const reviewDataDocuments = await collection
    .find()
    .sort({ datePosted: -1 })
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

// ###################### like related functions ######################

export async function getLikesCollection(): Promise<
  Collection<LikeDataDocument>
> {
  const db = await getDatabase();
  return db.collection("likes");
}

export async function insertLikeData(
  likeData: Omit<LikeData, "_id">,
): Promise<string> {
  const collection = await getLikesCollection();
  const likeDataDocument: LikeDataDocument = {
    ...likeData,
    _id: new ObjectId(),
    reviewId: new ObjectId(likeData.reviewId),
    likedBy: new ObjectId(likeData.likedBy),
  };

  const parseResult = LikeDataDocumentSchema.safeParse(likeDataDocument);

  if (!parseResult.success) {
    throw new Error(`Invalid like data: ${parseResult.error.message}`);
  }

  await collection.insertOne(parseResult.data);

  return likeDataDocument._id.toString();
}

export async function getLikeData({
  likeId,
}: {
  likeId: string;
}): Promise<LikeData | null> {
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

export async function getLikesData({
  likeIds,
}: {
  likeIds: string[];
}): Promise<LikeData[] | null> {
  const collection = await getLikesCollection();

  const LikeDataDocuments = await collection
    .find({
      _id: { $in: likeIds.map((id) => new ObjectId(id)) },
    })
    .toArray();

  if (!LikeDataDocuments || LikeDataDocuments.length === 0) return null;

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

export async function getLikesDataByReviewId({
  reviewId,
}: {
  reviewId: string;
}): Promise<LikeData[] | null> {
  "use cache";
  cacheTag(`likesData-${reviewId}`);

  console.log("getLikesDataByReviewId called with reviewId:", reviewId);

  const collection = await getLikesCollection();

  const LikeDataDocuments = await collection
    .find({
      reviewId: new ObjectId(reviewId),
    })
    .toArray();

  if (!LikeDataDocuments || LikeDataDocuments.length === 0) return null;

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

// ###################### comment related functions ######################

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
  };

  const parseResult = CommentDataDocumentSchema.safeParse(commentDataDocument);

  if (!parseResult.success) {
    throw new Error(`Invalid comment data: ${parseResult.error.message}`);
  }

  await collection.insertOne(parseResult.data);

  return commentDataDocument._id.toString();
}

export async function getCommentData({
  commentId,
}: {
  commentId: string;
}): Promise<CommentData | null> {
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
  };

  const parseResult = CommentDataSchema.safeParse(commentData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid comment data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

export async function getCommentsData({
  commentIds,
}: {
  commentIds: string[];
}): Promise<CommentData[] | null> {
  const collection = await getCommentsCollection();

  const commentDataDocuments = await collection
    .find({
      _id: { $in: commentIds.map((id) => new ObjectId(id)) },
    })
    .toArray();

  if (!commentDataDocuments || commentDataDocuments.length === 0) return null;

  const commentsData: CommentData[] = commentDataDocuments.map(
    (commentDataDocument) => ({
      ...commentDataDocument,
      _id: commentDataDocument._id.toString(),
      reviewId: commentDataDocument.reviewId.toString(),
      commentedBy: commentDataDocument.commentedBy.toString(),
    }),
  );

  const parseResult = CommentDataSchema.array().safeParse(commentsData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid comment data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

export async function getCommentsDataByReviewId({
  reviewId,
}: {
  reviewId: string;
}): Promise<CommentData[] | null> {
  "use cache";
  cacheTag(`commentsData-${reviewId}`);

  const collection = await getCommentsCollection();

  const commentDataDocuments = await collection
    .find({
      reviewId: new ObjectId(reviewId),
    })
    .toArray();

  if (!commentDataDocuments || commentDataDocuments.length === 0) return null;

  const commentsData: CommentData[] = commentDataDocuments.map(
    (commentDataDocument) => ({
      ...commentDataDocument,
      _id: commentDataDocument._id.toString(),
      reviewId: commentDataDocument.reviewId.toString(),
      commentedBy: commentDataDocument.commentedBy.toString(),
    }),
  );

  const parseResult = CommentDataSchema.array().safeParse(commentsData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid comment data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

// ###################### User related functions ######################

export async function getUsersCollection(): Promise<
  Collection<UserDataDocument>
> {
  const db = await getDatabase();
  return db.collection("users");
}

export async function getUserDataByUserName({
  userName,
}: {
  userName: string;
}): Promise<UserData | null> {
  const collection = await getUsersCollection();
  const userDataDomument = await collection.findOne({ userName });

  if (!userDataDomument) return null;

  const userData: UserData = {
    ...userDataDomument,
    _id: userDataDomument._id.toString(),
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
  console.log("getUserDataByUserId called with userId:", userId);
  const collection = await getUsersCollection();
  const userDataDomument = await collection.findOne({
    _id: new ObjectId(userId),
  });

  if (!userDataDomument) return null;

  const userData: UserData = {
    ...userDataDomument,
    _id: userDataDomument._id.toString(),
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
    throw new Error(`Invalid review data: ${parseResult.error.message}`);
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

  const userData = await getUserDataByUserId({
    userId: userSessionData.userId,
  });

  return userData;
}

// ###################### User Sessionrelated functions ######################

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

export async function deleteUserSession(_id: string) {
  const collection = await getUsersSessionCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });

  return result.deletedCount > 0;
}
