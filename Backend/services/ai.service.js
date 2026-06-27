import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError.js";
import app from "./../server";

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

const generateJSON = async (prompt, schema) => {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: MODEL(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.6,
      },
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error("💥", "Gemini JSON error: ", err, err?.message);
    throw new ApiError(
      500,
      err?.message || "AI Request failed, please try again.",
    );
  }
};
