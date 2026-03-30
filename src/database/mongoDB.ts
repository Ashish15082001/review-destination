import "server-only";

import { CommentDocument } from "@/schema/comment";
import { LikeDocument } from "@/schema/like";
import { ReviewDocument } from "@/schema/review";
import { UserDocument } from "@/schema/user";
import { MongoClient, Db, Collection, Document } from "mongodb";
import { UserSessionDocument } from "@/schema/userSession";
import {
  PasswordResetData,
  PasswordResetDocument,
} from "@/schema/password-reset";
import { EmailVerificationDocument } from "@/schema/email-verification";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let _prodClientPromise: Promise<MongoClient> | undefined;

export function getClientPromise(): Promise<MongoClient> {
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
  Collection<ReviewDocument>
> {
  const db = await getDatabase();
  return db.collection("reviews");
}

export async function getLikesCollection(): Promise<Collection<LikeDocument>> {
  const db = await getDatabase();
  return db.collection("likes");
}

export async function getCommentsCollection(): Promise<
  Collection<CommentDocument>
> {
  const db = await getDatabase();
  return db.collection("comments");
}

export async function getUsersCollection(): Promise<Collection<UserDocument>> {
  const db = await getDatabase();
  return db.collection("users");
}

export async function getUserSessionsCollection(): Promise<
  Collection<UserSessionDocument>
> {
  const db = await getDatabase();
  return db.collection("userSessions");
}

export async function getPasswordResetCollection(): Promise<
  Collection<PasswordResetDocument>
> {
  const db = await getDatabase();
  return db.collection("PasswordReset");
}

export async function getEmailVerificationCollection(): Promise<
  Collection<EmailVerificationDocument>
> {
  const db = await getDatabase();
  return db.collection("emailVerification");
}
