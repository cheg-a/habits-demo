import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { savePhoto, getAllPhotos, getPhotosByUser } from "../services/photoService";

const uploadSchema = z.object({
  description: z.string().min(1, "Description is required"),
  city: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  category: z.string().optional(),
});

export const uploadPhotoHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = await request.file();
  if (!data) {
    return reply.status(400).send({ message: "No file uploaded" });
  }

  const fields = uploadSchema.safeParse(request.body || {});
  if (!fields.success) {
    return reply.status(400).send({ message: "Invalid fields", errors: fields.error.flatten().fieldErrors });
  }

  const userId = (request as any).session.userId as number;
  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.promises.mkdir(uploadDir, { recursive: true });
  const fileName = Date.now() + "-" + data.filename;
  const filePath = path.join(uploadDir, fileName);
  await fs.promises.writeFile(filePath, await data.toBuffer());

  const saved = await savePhoto({
    userId,
    description: fields.data.description,
    city: fields.data.city,
    latitude: fields.data.latitude ? parseFloat(fields.data.latitude) : undefined,
    longitude: fields.data.longitude ? parseFloat(fields.data.longitude) : undefined,
    category: fields.data.category,
    filePath,
  });
  return reply.status(201).send(saved);
};

export const getAllPhotosHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const photos = await getAllPhotos();
  return reply.send(photos);
};

export const getUserPhotosHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = (request as any).session.userId as number;
  const photos = await getPhotosByUser(userId);
  return reply.send(photos);
};
