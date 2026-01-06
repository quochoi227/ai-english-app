// import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { originalSentence, userTranslation } = await request.json();

    if (!originalSentence || !userTranslation) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp câu gốc và bản dịch" },
        { status: 400 }
      );
    }

    // const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Bạn là một giáo viên tiếng Anh chuyên nghiệp. Hãy chấm điểm và nhận xét bản dịch của học viên.

Câu gốc (tiếng Việt): "${originalSentence}"
Bản dịch của học viên: "${userTranslation}"

Yêu cầu:
1. Chấm điểm từ 0-10 dựa trên độ chính xác ngữ pháp, từ vựng và ý nghĩa
2. Nhận xét bằng tiếng Việt, ngắn gọn và mang tính xây dựng
3. Chỉ ra các lỗi cụ thể (nếu có) và cách sửa
4. Cung cấp bản dịch mẫu chuẩn

Trả về JSON format với các trường:
- score: điểm số (0-10)
- feedback: nhận xét tổng quan bằng tiếng Việt
- errors: mảng các lỗi (mỗi lỗi có: error, correction, explanation)
- suggestedTranslation: bản dịch mẫu chuẩn
- isCorrect: true nếu điểm >= 7, false nếu điểm < 7

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
      // If parsing fails, create default structure
      parsedResponse = {
        score: 5,
        feedback: "Không thể phân tích kết quả. Vui lòng thử lại.",
        errors: [],
        suggestedTranslation: "",
        isCorrect: false,
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Evaluate error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
