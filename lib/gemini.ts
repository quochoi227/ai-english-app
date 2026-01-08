import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("Missing GOOGLE_API_KEY environment variable.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "dummy_key");

export const model = genAI.getGenerativeModel({
  model: "gemma-3-4b-it",
});
