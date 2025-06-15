import { db } from "../db";
import { photos } from "../db/schema";
import { eq } from "drizzle-orm";

export interface NewPhoto {
  userId: number;
  city?: string;
  latitude?: number;
  longitude?: number;
  description: string;
  category?: string;
  filePath: string;
}

export async function savePhoto(data: NewPhoto) {
  const [saved] = await db.insert(photos).values(data).returning();
  return saved;
}

export async function getAllPhotos() {
  return await db.select().from(photos);
}

export async function getPhotosByUser(userId: number) {
  return await db.select().from(photos).where(eq(photos.userId, userId));
}
