import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError.js";

let client = null;

const getClient = () => {
  const apiKey = process.env.GEMENI_API_KEY;

  if (!apiKey) {
    throw new ApiError(
      503,
      "Api Key is not configured in .env file, or is invalid. Service Unavailable",
    );
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

const MODEL = () => process.env.GEMENI_MODEL || "gemini-2.5-flash";
export const isAIConfigured = () => Boolean(process.env.GEMENI_API_KEY);
