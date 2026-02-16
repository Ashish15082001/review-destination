import {
  ReviewDataFromMongoDB,
  ReviewDataFromMongoDBSchema,
  ReviewDataToMongoDB,
  ReviewDataToMongoDBSchema,
  UserDataFromMongoDB,
  UserDataToMongoDB,
  UserSessionDataFromMongoDB,
  UserSessionDataToMongoDB,
} from "@/schema/schema";
import { MongoClient, Db, ObjectId, Collection } from "mongodb";
import { cookies } from "next/headers";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri: string = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("review-destination");
}

export async function getReviewsCollection() {
  const db = await getDatabase();
  return db.collection("reviews");
}

export async function putReviewData(reviewData: ReviewDataToMongoDB) {
  const parseResult = ReviewDataToMongoDBSchema.safeParse(reviewData);

  if (!parseResult.success) {
    throw new Error(`Invalid review data: ${parseResult.error.message}`);
  }

  const collection = await getReviewsCollection();
  await collection.insertOne(parseResult.data);
}

export async function getReviewData(
  id: string,
): Promise<ReviewDataFromMongoDB> {
  console.log("######## getReviewData");
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const collection = await getReviewsCollection();
  const reviewData = await collection.findOne({ _id: new ObjectId(id) });

  if (!reviewData) {
    throw new Error("Review not found");
  }

  const parseResult = ReviewDataFromMongoDBSchema.safeParse(reviewData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid review data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

export async function getAllReviewsData(): Promise<ReviewDataFromMongoDB[]> {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Fetching all reviews data from MongoDB...");
  const collection = await getReviewsCollection();
  const reviewsData = await collection
    .find()
    .sort({ datePosted: -1 })
    .toArray();

  const parseResult =
    ReviewDataFromMongoDBSchema.array().safeParse(reviewsData);

  if (!parseResult.success) {
    throw new Error(
      `Invalid reviews data from DB: ${parseResult.error.message}`,
    );
  }

  return parseResult.data;
}

export async function postLikeForReview(reviewId: string) {
  const collection = await getReviewsCollection();
  await collection.updateOne(
    { _id: new ObjectId(reviewId) },
    { $inc: { totalLikes: 1 } },
  );
}

// ###################### User related functions ######################

export async function getUsersCollectionFromMongoDM(): Promise<
  Collection<UserDataFromMongoDB>
> {
  const db = await getDatabase();
  return db.collection("users");
}

export async function getUsersCollectionToMongoDB(): Promise<
  Collection<UserDataToMongoDB>
> {
  const db = await getDatabase();
  return db.collection("users");
}

export async function getUserData({
  userName,
}: {
  userName: string;
}): Promise<UserDataFromMongoDB | null> {
  const collection = await getUsersCollectionFromMongoDM();
  const userData = await collection.findOne({ userName });

  return userData;
}

export async function registerNewUser({
  userName,
  password,
  registeredAt,
}: UserDataToMongoDB) {
  const collection = await getUsersCollectionToMongoDB();
  const result = await collection.insertOne({
    userName,
    password,
    registeredAt,
  });

  return result.insertedId;
}

export async function getUserDataUsingSession(): Promise<UserDataFromMongoDB | null> {
  const sessionCookie = await cookies();

  const sessionId = sessionCookie.get("sessionId")?.value;

  if (!sessionId) return null;

  const userSessionData = await getUserSessionDataFromMongoDB(sessionId);

  if (!userSessionData) return null;

  const collection = await getUsersCollectionFromMongoDM();
  const userData = await collection.findOne({ _id: userSessionData.userId });

  return userData;
}

// ###################### User Sessionrelated functions ######################

export async function getUsersSessionCollectionFromMongoDB(): Promise<
  Collection<UserSessionDataFromMongoDB>
> {
  const db = await getDatabase();
  return db.collection("usersSessions");
}

export async function getUserSessionDataFromMongoDB(
  sessionId: string,
): Promise<UserSessionDataFromMongoDB | null> {
  const userSessionsCollection = await getUsersSessionCollectionFromMongoDB();
  const userSessionData = await userSessionsCollection.findOne({
    _id: new ObjectId(sessionId),
  });

  return userSessionData;
}

export async function getUsersSessionCollectionToMongoDB(): Promise<
  Collection<UserSessionDataToMongoDB>
> {
  const db = await getDatabase();
  return db.collection("usersSessions");
}

export async function createUserSession({
  expiresOn,
  userId,
}: UserSessionDataToMongoDB) {
  const collection = await getUsersSessionCollectionToMongoDB();
  const result = await collection.insertOne({
    expiresOn,
    userId,
  });

  return result.insertedId;
}

export async function deleteUserSession({ _id }: UserSessionDataFromMongoDB) {
  const collection = await getUsersSessionCollectionToMongoDB();
  const result = await collection.deleteOne({
    _id: new ObjectId(_id),
  });

  return result.deletedCount > 0;
}

export default clientPromise;
