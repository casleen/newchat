import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { User } from "../models/User";

interface SocketWithUserId extends Socket {
  userId?: string;
}

export const onlineUsers: Map<string, string> = new Map<string, string>();

export const initializeSocket = (httpServer: HttpServer) => {
  const allowedOrigins = [
    "http://localhost:8081", //Expo mobile
    "http://localhost:5173", //Vite web dev
    process.env.FRONTEND_URL, //Production
  ].filter(Boolean) as string[];
  const io = new SocketServer(httpServer, {
    cors: {
      origin: allowedOrigins,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY as string,
      });

      const clerkId = session.sub;

      const user = await User.findOne({ clerkId });
      if (!user) {
        throw new Error("User not found");
      }

      socket.data.userId = user._id.toString();

      return next();
    } catch (error: any) {
      return next(
        error instanceof Error ? error : new Error("Authentication error"),
      );
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as SocketWithUserId).userId;

    socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });

    onlineUsers.set(userId!, socket.id);

    socket.broadcast.emit("user-online", { userId });

    socket.join(`user:${userId}`);

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });
    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          const chat = await Chat.findOne({
            _id: chatId,
            participants: userId,
          });
          if (!chat) {
            socket.emit("socket-error", {
              message: "Chat not found or access denied.",
            });
            return;
          }

          const message = await Message.create({
            chat: chatId,
            sender: userId,
            text,
          });
          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();
          await chat.save();

          await message.populate("sender", "username  avatar");

          io.to(`chat:${chatId}`).emit("message-received", message);

          for (const participantId of chat.participants) {
            io.to(`user:${participantId}`).emit("new-message", message);
          }
        } catch (error) {
          socket.emit("socket-error", {
            message: "Failed to send message.",
          });
        }
      },
    );

    //TODO:LATER
    socket.on("typing", async (data) => {});
    socket.on("disconnect", () => {
      onlineUsers.delete(userId!);
      socket.broadcast.emit("user-offline", { userId });
    });
  });

  return io;
};
