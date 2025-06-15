import { FastifyInstance } from "fastify";
import {
  uploadPhotoHandler,
  getAllPhotosHandler,
  getUserPhotosHandler,
} from "../controllers/photoController";
import { registerProtectedRoute, registerPublicRoute } from "../middleware/routeHelpers";

async function photoRoutes(fastify: FastifyInstance) {
  registerProtectedRoute(fastify, "post", "/upload", uploadPhotoHandler as any);
  registerPublicRoute(fastify, "get", "/", getAllPhotosHandler as any);
  registerProtectedRoute(fastify, "get", "/mine", getUserPhotosHandler as any);
}

export default photoRoutes;
