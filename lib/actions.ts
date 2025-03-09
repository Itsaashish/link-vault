// "use server";

// import { connectToDatabase } from "./db";
// import type { Link, LinkInput } from "./types";

// export async function saveLink(linkData: LinkInput): Promise<Link> {
//   const db = await connectToDatabase();
//   const collection = db.collection("links");

//   const now = new Date().toISOString();
//   const newLink = {
//     ...linkData,
//     createdAt: now,
//     updatedAt: now,
//   };

//   const result = await collection.insertOne(newLink);

//   return {
//     _id: result.insertedId.toString(),
//     ...newLink,
//   };
// }

// export async function getLinks(): Promise<Link[]> {
//   const db = await connectToDatabase();
//   const collection = db.collection("links");

//   const links = await collection.find({}).sort({ createdAt: -1 }).toArray();

//   return links.map((link) => ({
//     ...link,
//     _id: link._id.toString(),
//   }));
// }

// export async function deleteLink(id: string): Promise<boolean> {
//   const db = await connectToDatabase();
//   const collection = db.collection("links");

//   const result = await collection.deleteOne({ _id: id });

//   return result.deletedCount === 1;
// }

// export async function updateLink(
//   id: string,
//   linkData: LinkInput
// ): Promise<Link> {
//   const db = await connectToDatabase();
//   const collection = db.collection("links");

//   const updatedLink = {
//     ...linkData,
//     updatedAt: new Date().toISOString(),
//   };

//   await collection.updateOne({ _id: id }, { $set: updatedLink });

//   return {
//     _id: id,
//     ...updatedLink,
//     createdAt:
//       (await collection.findOne({ _id: id }))?.createdAt ||
//       new Date().toISOString(),
//   };
// }

"use server";

import { connectToDatabase } from "./db";
import { ObjectId } from "mongodb";
import type { Link, LinkInput, LinkDocument } from "./types";

export async function saveLink(linkData: LinkInput): Promise<Link> {
  const db = await connectToDatabase();
  const collection = db.collection<LinkDocument>("links");

  const now = new Date().toISOString();
  const newLink = {
    ...linkData,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(newLink as any);

  return {
    _id: result.insertedId.toString(),
    ...newLink,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getLinks(): Promise<Link[]> {
  const db = await connectToDatabase();
  const collection = db.collection<LinkDocument>("links");

  const links = await collection.find({}).sort({ createdAt: -1 }).toArray();

  return links.map((link) => ({
    ...link,
    _id: link._id.toString(),
  })) as Link[];
}

export async function deleteLink(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  const collection = db.collection("links");

  try {
    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  } catch (error) {
    console.error("Error deleting link:", error);
    return false;
  }
}

export async function updateLink(
  id: string,
  linkData: LinkInput
): Promise<Link> {
  const db = await connectToDatabase();
  const collection = db.collection("links");

  const updatedLink = {
    ...linkData,
    updatedAt: new Date().toISOString(),
  };

  try {
    const objectId = new ObjectId(id);
    await collection.updateOne({ _id: objectId }, { $set: updatedLink });

    const updatedDoc = await collection.findOne({ _id: objectId });

    return {
      _id: id,
      ...updatedLink,
      createdAt: updatedDoc?.createdAt || new Date().toISOString(),
    } as Link;
  } catch (error) {
    console.error("Error updating link:", error);
    throw new Error("Failed to update link");
  }
}
