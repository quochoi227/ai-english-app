// import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST() {
  try {
    // const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Bạn là một giáo viên tiếng Anh chuyên nghiệp. Hãy tạo một đoạn văn "tiếng Việt" để người học dịch sang "tiếng Anh".

Yêu cầu:
1. Đoạn văn có từ 7 đến 10 câu
2. Nội dung đa dạng, thú vị (có thể về cuộc sống hàng ngày, công việc, du lịch, học tập, v.v.)
3. Độ khó vừa phải, phù hợp với người học trung cấp
4. Mỗi câu nên có độ dài từ 8-20 từ
5. Sử dụng ngữ pháp và từ vựng đa dạng

Trả về JSON format với trường:
- sentences: mảng các câu tiếng Việt
- topic: chủ đề của đoạn văn

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
        sentences: [
          "Hôm nay là một ngày đẹp trời.",
          "Tôi thức dậy lúc 6 giờ sáng.",
          "Sau khi tập thể dục, tôi ăn sáng cùng gia đình.",
          "Công việc hôm nay rất bận rộn.",
          "Tôi có một cuộc họp quan trọng lúc 10 giờ.",
          "Buổi trưa, tôi ăn cơm với đồng nghiệp.",
          "Chiều nay tôi sẽ hoàn thành dự án.",
        ],
        topic: "Một ngày làm việc",
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi tạo đoạn văn. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
