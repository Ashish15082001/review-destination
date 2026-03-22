import "server-only";

import { CommentDataDocument } from "@/schema/comment";
import { LikeDataDocument } from "@/schema/like";
import { ReviewDataDocument } from "@/schema/review";
import { UserDataDocument } from "@/schema/user";
import { MongoClient, Db, Collection, Document } from "mongodb";
import { UserSessionDataDocument } from "@/schema/userSession";

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

export async function getReviewsCollection(): Promise<
  Collection<ReviewDataDocument>
> {
  const db = await getDatabase();
  return db.collection("reviews");
}

export async function getLikesCollection(): Promise<
  Collection<LikeDataDocument>
> {
  const db = await getDatabase();
  return db.collection("likes");
}

export async function getCommentsCollection(): Promise<
  Collection<CommentDataDocument>
> {
  const db = await getDatabase();
  return db.collection("comments");
}

export async function getUsersCollection(): Promise<
  Collection<UserDataDocument>
> {
  const db = await getDatabase();
  return db.collection("users");
}

export async function getUserSessionsCollection(): Promise<
  Collection<UserSessionDataDocument>
> {
  const db = await getDatabase();
  return db.collection("userSessions");
}

export async function getUserScrapedDataCollection(): Promise<
  Collection<Document>
> {
  const db = await getDatabase();
  return db.collection("userScrapedData");
}

export async function getPasswordResetValidationTokensCollection(): Promise<
  Collection<Document>
> {
  const db = await getDatabase();
  return db.collection("userPasswordReset");
}
