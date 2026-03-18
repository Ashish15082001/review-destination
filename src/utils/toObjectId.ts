import { ObjectId } from "mongodb";

function toObjectId(value: string, fieldName: string): ObjectId {
  if (!ObjectId.isValid(value)) {
    throw new Error(`Invalid ObjectId for field '${fieldName}': ${value}`);
  }

  return new ObjectId(value);
}

export default toObjectId;
