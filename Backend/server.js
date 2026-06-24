import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error_middleware.js";

const app = express();

//* Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//* Routes
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    message: "Server is running | TTP CRM API",
  });
});

//* Error handlers
app.use(notFound);
app.use(errorHandler);

//* Connect to DB & start server
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
  } catch (err) {
    console.error("💥", "Failed to start server: ", err);
    process.exit(1);
  }
};

startServer();
export default app;
