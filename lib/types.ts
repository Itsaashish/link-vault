import { ObjectId } from "mongodb";

export interface Link {
  _id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkInput {
  title: string;
  url: string;
  description?: string;
}

// Add this interface for MongoDB documents
export interface LinkDocument {
  _id: ObjectId;
  title: string;
  url: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
