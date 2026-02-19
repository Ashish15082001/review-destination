import z from "zod";
import { ObjectId } from "mongodb";

export const UserSessionDataFromMongoDBSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.instanceof(ObjectId),
  expiresOn: z.date(),
});

export const UserSessionDataToMongoDBSchema = z.object({
  userId: z.instanceof(ObjectId),
  expiresOn: z.date(),
});

export interface UserSessionDataFromMongoDB extends z.infer<
  typeof UserSessionDataFromMongoDBSchema
> {}

export interface UserSessionDataToMongoDB extends z.infer<
  typeof UserSessionDataToMongoDBSchema
> {}
