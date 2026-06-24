import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  //* avoid deprecation warnings/noise & make queries fail fast instead of buffering forever
  mongoose.set("strictQuery", true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
  });

  console.log(
    `✅,MongoDB connected: ${conn.connection.host}/${conn.connection.name}`,
  );

  return conn;
};
