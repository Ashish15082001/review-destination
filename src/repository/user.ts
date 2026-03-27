import {
  getCommentsCollection,
  getLikesCollection,
  getReviewsCollection,
  getUsersCollection,
} from "@/database/mongoDB";
import { UserData } from "@/schema/user";
import { ObjectId } from "bson";
import { deleteUserSession, getUserSessionData } from "./userSession";
import {
  mapUserDocumentToUserData,
  mapUserDataToUserDocument,
} from "@/mappers/user";
import { cacheTag, revalidateTag } from "next/cache";
import getCookie from "@/utils/getCookie";
import { cookies } from "next/headers";

/**
 * Validates and retrieves user data by email.
 * @param email - The email of the user to retrieve.
 * @returns The user data or null if not found.
 */
export async function getUserDataByEmail({
  email,
}: {
  email: string;
}): Promise<UserData | null> {
  "use cache";
  cacheTag(`userData-email-${email}`);

  const collection = await getUsersCollection();
  const userDataDocument = await collection.findOne({ email });

  return userDataDocument ? mapUserDocumentToUserData(userDataDocument) : null;
}

/**
 * Validates and retrieves user data by ID.
 * @param userId - The ID of the user to retrieve.
 * @returns The user data or null if not found.
 */
export async function getUserDataById({
  userId,
}: {
  userId: string;
}): Promise<UserData | null> {
  "use cache";
  cacheTag(`userData-userId-${userId}`);

  const collection = await getUsersCollection();
  const userDocument = await collection.findOne({
    _id: new ObjectId(userId),
  });

  return userDocument ? mapUserDocumentToUserData(userDocument) : null;
}

/**
 * Validates and retrieves user data by IDs.
 * @param userIds - The IDs of the users to retrieve.
 * @returns The user data or null if not found.
 */
export async function getUsersDataByUserIds({
  userIds,
}: {
  userIds: string[];
}): Promise<UserData[]> {
  const userDataPromises = userIds.map((userId) => getUserDataById({ userId }));

  const usersData = await Promise.all(userDataPromises);

  return usersData.filter((userData) => userData !== null);
}

/**
 * Validates and inserts a new user data into the users collection.
 * @param userData - The user data to insert.
 * @returns The ID of the inserted user data.
 */
export async function registerNewUser(
  userData: Omit<UserData, "_id">,
): Promise<string> {
  const userDocument = mapUserDataToUserDocument({
    ...userData,
    _id: new ObjectId().toString(),
  });

  const collection = await getUsersCollection();
  await collection.insertOne(userDocument);

  return userDocument._id.toString();
}

/**
 * Validates and inserts a new review data into the reviews collection.
 * @param reviewData - The review data to insert.
 * @returns The ID of the inserted review data.
 */
export async function updateUserPasswordByEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserData | null> {
  const collection = await getUsersCollection();

  const updatedUserDocument = await collection.findOneAndUpdate(
    { email },
    { $set: { password } },
    { returnDocument: "after" },
  );

  if (!updatedUserDocument) return null;

  revalidateTag(`userData-userId-${updatedUserDocument._id.toString()}`, "max");
  revalidateTag(`userData-email-${email}`, "max");

  return mapUserDocumentToUserData(updatedUserDocument);
}

/**
 * Validates and retrieves user data using a session.
 * @returns The user data or null if not found.
 */
export async function getUserDataUsingSession(): Promise<UserData | null> {
  const sessionId = await getCookie("sessionId");

  if (!sessionId) return null;

  const userSessionData = await getUserSessionData(sessionId);

  if (!userSessionData || !userSessionData.userId) return null;

  // Reject expired sessions
  if (userSessionData.expiresOn < new Date()) {
    await deleteUserSession(sessionId);
    return null;
  }

  const userData = await getUserDataById({
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

/**
 * Validates and retrieves user stats.
 * @returns The user stats or null if not found.
 */
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

/**
 * Validates and sets a user as verified.
 * @param email - The email of the user to verify.
 * @returns A boolean indicating whether the operation was successful.
 */
export async function setUserAsVerified({
  email,
}: {
  email: string;
}): Promise<boolean> {
  const collection = await getUsersCollection();

  const updatedUserDoc = await collection.findOneAndUpdate(
    { email },
    { $set: { isEmailVerified: true } },
    { returnDocument: "after" },
  );

  if (!updatedUserDoc) return false;

  revalidateTag(`userData-userId-${updatedUserDoc._id.toString()}`, "max");
  revalidateTag(`userData-email-${email}`, "max");

  return true;
}
