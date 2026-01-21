import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// 中间件
app.use(cors()); // 启用 CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());
// 健康检查端点
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API 路由（待添加）
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

//serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../web/dist")));

  app.get("/{*}", (req, res) => {
    res.sendFile(path.join(__dirname, "../../web/dist", "index.html"));
  });
}
export default app;
