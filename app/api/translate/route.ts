// import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { text, context } = await request.json();

    if (!text || !context) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp text và ngữ cảnh" },
        { status: 400 }
      );
    }

    // const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Bạn là một chuyên gia dịch thuật Việt-Anh. Hãy dịch đoạn văn bản tiếng Việt sau sang tiếng Anh phù hợp với ngữ cảnh được cung cấp.

Văn bản cần dịch: "${text}"
Ngữ cảnh sử dụng: ${context}

Yêu cầu:
1. Dịch chính xác, tự nhiên, phù hợp với ngữ cảnh
2. Nếu câu cần dịch dài (hơn 10 từ), hãy thêm phần giải thích ngắn gọn bằng tiếng Việt về cách dùng từ/cấu trúc ngữ pháp đặc biệt
3. Trả về JSON format với các trường:
   - translation: bản dịch tiếng Anh
   - explanation: giải thích (nếu cần, để null nếu không cần)
   - alternatives: mảng các cách dịch thay thế (tối đa 2 cách, nếu có)

Chỉ trả về JSON, không thêm markdown hay text khác.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Parse JSON response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
      parsedResponse = JSON.parse(cleanedText);
    } catch {
      // If parsing fails, return raw translation
      parsedResponse = {
        translation: responseText,
        explanation: null,
        alternatives: [],
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi dịch. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
