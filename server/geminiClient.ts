import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export function getApiKey(): string {
  return process.env.GEMINI_API_KEY || process.env.API_KEY || "";
}

export function getAiClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}
