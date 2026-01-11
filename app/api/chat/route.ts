import { model } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { messages, systemPrompt } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Vui lòng cung cấp tin nhắn' },
                { status: 400 }
            );
        }

        // Xây dựng prompt từ lịch sử chat
        const chatHistory = messages.map((msg: { role: string; content: string }) => {
            return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`;
        }).join('\n\n');

        const fullPrompt = `${systemPrompt || 'Bạn là một trợ lý AI thông minh, thân thiện và hữu ích. Hãy trả lời bằng tiếng Việt khi người dùng hỏi bằng tiếng Việt, và bằng tiếng Anh khi người dùng hỏi bằng tiếng Anh.'}

Lịch sử cuộc trò chuyện:
${chatHistory}

Hãy trả lời tin nhắn cuối cùng của người dùng một cách tự nhiên và hữu ích.`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const responseText = response.text();

        return NextResponse.json({
            content: responseText,
            role: 'assistant'
        });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}
