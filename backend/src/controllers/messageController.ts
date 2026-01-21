import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Types } from "mongoose";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export async function getMessages(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { chatId } = req.params;
    if (
      !chatId ||
      typeof chatId !== "string" ||
      !Types.ObjectId.isValid(chatId)
    ) {
      res.status(400).json({ message: "Invalid chat ID" });
      return;
    }
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email avatar")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(messages);
  } catch (error) {
    next(error);
  }
}
