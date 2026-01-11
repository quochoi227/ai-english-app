"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Bot,
  User,
  Sparkles,
  MoreVertical
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // Auto scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  // Auto resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 200) + "px";
    }
  }, [inputValue]);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: "Cuộc trò chuyện mới",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setInputValue("");
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const generateTitle = (content: string) => {
    // Lấy 30 ký tự đầu tiên làm title
    const title = content.slice(0, 30).trim();
    return title.length < content.length ? title + "..." : title;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    let conversationId = activeConversationId;

    // Tạo conversation mới nếu chưa có
    if (!conversationId) {
      const newConversation: Conversation = {
        id: generateId(),
        title: generateTitle(inputValue),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      conversationId = newConversation.id;
      setActiveConversationId(conversationId);
    }

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    // Thêm tin nhắn user vào conversation
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const isFirstMessage = conv.messages.length === 0;
          return {
            ...conv,
            title: isFirstMessage ? generateTitle(inputValue) : conv.title,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date(),
          };
        }
        return conv;
      })
    );

    setInputValue("");
    setIsLoading(true);
    inputRef.current?.focus();

    try {
      // Lấy lịch sử tin nhắn
      const currentConv = conversations.find((c) => c.id === conversationId);
      const allMessages = [...(currentConv?.messages || []), userMessage];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      // Thêm tin nhắn AI vào conversation
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMessage],
              updatedAt: new Date(),
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error("Chat error:", error);
      // Thêm tin nhắn lỗi
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
        timestamp: new Date(),
      };
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, errorMessage],
              updatedAt: new Date(),
            };
          }
          return conv;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen max-h-screen flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
          bg-background-secondary border-r border-border
        transition-all duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "w-72"
              : "w-0 overflow-hidden"
          }
        `}
        >
          <div className="h-full flex flex-col">
            {/* New Chat Button */}
            <div className="p-4">
              <button
                onClick={createNewConversation}
                className="btn btn-primary w-full min-w-max"
              >
                <Plus className="w-5 h-5" />
                Cuộc trò chuyện mới
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-foreground-muted">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`
                        group flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer
                        transition-all duration-200
                        ${
                          activeConversationId === conv.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-border-light text-foreground"
                        }
                      `}
                      onClick={() => setActiveConversationId(conv.id)}
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate text-sm font-medium">
                        {conv.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 hover:text-error rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {/* {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )} */}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className={`flex items-center gap-2 px-4 py-2 border-b border-border bg-background-secondary ${!isSidebarOpen ? "" : "lg:hidden"}`}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-border-light rounded-lg"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <span className="font-medium truncate">
              {activeConversation?.title || "Chat với AI"}
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {!activeConversation || activeConversation.messages.length === 0 ? (
              /* Welcome Screen */
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center max-w-md animate-fade-in">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-3">
                    Xin chào! Tôi là AI Assistant
                  </h1>
                  <p className="text-foreground-muted mb-6">
                    Tôi có thể giúp bạn với nhiều việc như trả lời câu hỏi, viết
                    văn bản, dịch thuật, và nhiều hơn nữa.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Hỏi về tiếng Anh", "Dịch văn bản", "Viết email"].map(
                      (suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInputValue(suggestion)}
                          className="px-4 py-2 rounded-full bg-border-light hover:bg-border text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
                        >
                          {suggestion}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Messages List */
              <div className="max-w-3xl mx-auto px-4 py-6">
                {activeConversation.messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 mb-6 animate-fade-in ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Avatar */}
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center shrink-0
                      ${
                        message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-linear-to-br from-secondary to-primary text-white"
                      }
                    `}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col max-w-[70%] ${
                      message.role === "user" ? "items-end" : "items-start"
                    }`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="font-medium text-xs text-foreground-muted">
                          {message.role === "user" ? "Bạn" : "AI Assistant"}
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div
                        className={`
                        px-4 py-3 rounded-2xl shadow-sm
                        ${
                          message.role === "user"
                            ? "bg-primary text-white rounded-tr-sm"
                            : "bg-background-secondary border border-border text-foreground rounded-tl-sm"
                        }
                      `}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3 mb-6 animate-fade-in flex-row">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-secondary to-primary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col max-w-[70%] items-start">
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="font-medium text-xs text-foreground-muted">
                          AI Assistant
                        </span>
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm bg-background-secondary border border-border">
                        <div className="flex gap-1">
                          <span
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-background-secondary p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn của bạn..."
                    disabled={isLoading}
                    rows={1}
                    className="input resize-none overflow-hidden min-h-12 max-h-50 py-3"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="btn btn-primary self-start shrink-0 p-3! min-h-12 min-w-12"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-foreground-muted text-center mt-2">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
              </p>
            </div>
          </div>
        </main>
      </div>
  );
}
