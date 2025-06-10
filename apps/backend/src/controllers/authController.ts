import { AuthService } from "./../services/authService";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { db } from "../db/index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const authService = new AuthService();

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const updatePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Новый пароль должен содержать минимум 6 символов"),
});

export const loginHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const parsedBody = loginSchema.safeParse(request.body);
    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid input",
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { username, password } = parsedBody.data;
    const user = await authService.verifyUser(username, password);

    if (!user) {
      return reply
        .status(401)
        .send({ message: "Invalid username or password" });
    }

    request.session.userId = user.id;

    await request.session.save();
    // Получаем полную информацию о пользователе из базы данных, включая isDefaultPassword
    const userArray = await db
      .select({
        id: users.id,
        username: users.username,
        isDefaultPassword: users.isDefaultPassword,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const isDefaultPassword =
      userArray.length > 0 ? userArray[0].isDefaultPassword : false;

    const { ...userResponse } = user;
    return reply.send({
      ...user,
      isDefaultPassword,
    });
  } catch (error) {
    request.log.error(error, "Login handler error");
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

export const logoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // Авторизация уже проверена в middleware, userId точно существует
    request.session.destroy((err) => {
      if (err) {
        request.log.error(err, "Session destruction failed during logout");
        return reply.status(500).send({
          message:
            "Logout failed due to server error during session destruction.",
        });
      }
      return reply.send({ message: "Logout successful" });
    });
  } catch (error) {
    request.log.error(error, "Logout handler error");
    return reply
      .status(500)
      .send({ message: "Internal Server Error during logout process" });
  }
};

export const whoamiHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    // Авторизация уже проверена в middleware, userId точно существует
    const userId = request.session.userId!;
    const user = await authService.findUserById(userId);

    if (!user) {
      request.log.warn(`User with ID ${userId} from session not found in DB`);
      request.session.destroy((err) => {
        if (err) {
          request.log.error(err, "Session destruction failed during whoami");
        }
      });
      return reply
        .status(404)
        .send({ message: "User not found, session cleared" });
    }

    return reply.send(user);
  } catch (error) {
    request.log.error(error, "Whoami handler error");
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

export const updatePasswordHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const parsedBody = updatePasswordSchema.safeParse(request.body);
    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Некорректные данные",
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { newPassword } = parsedBody.data;
    const userId = request.session.userId!;

    const result = await authService.updatePassword(userId, newPassword);
    if (!result) {
      return reply.status(500).send({ message: "Не удалось обновить пароль" });
    }

    return reply.send({ message: "Пароль успешно обновлен" });
  } catch (error) {
    request.log.error(error, "Update password handler error");
    return reply.status(500).send({ message: "Внутренняя ошибка сервера" });
  }
};
