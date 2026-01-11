"use client";

import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Languages,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";

const contextOptions = [
  { value: "casual", label: "Chat thân mật với bạn bè" },
  { value: "formal_email", label: "Viết email công việc" },
  { value: "business", label: "Giao tiếp công việc" },
  { value: "academic", label: "Văn bản học thuật" },
  { value: "travel", label: "Du lịch, hỏi đường" },
  { value: "shopping", label: "Mua sắm" },
  { value: "restaurant", label: "Nhà hàng, đặt món" },
  { value: "custom", label: "Tự nhập ngữ cảnh..." },
];

interface TranslationResult {
  translation: string;
  explanation: string | null;
  alternatives: string[];
}

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [selectedContext, setSelectedContext] = useState("casual");
  const [customContext, setCustomContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const getContextLabel = () => {
    if (selectedContext === "custom") {
      return customContext || "Ngữ cảnh tùy chỉnh";
    }
    return (
      contextOptions.find((opt) => opt.value === selectedContext)?.label ||
      selectedContext
    );
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Vui lòng nhập text cần dịch");
      return;
    }

    if (selectedContext === "custom" && !customContext.trim()) {
      setError("Vui lòng nhập ngữ cảnh");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          context: getContextLabel(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi dịch");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.translation) {
      await navigator.clipboard.writeText(result.translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setText("");
    setResult(null);
    setError("");
    setCustomContext("");
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Languages className="w-4 h-4" />
              Dịch Nghĩa Theo Ngữ Cảnh
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Dịch <span className="gradient-text">Thông Minh</span>
            </h1>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Nhập văn bản tiếng Việt và chọn ngữ cảnh để nhận bản dịch tiếng
              Anh phù hợp nhất
            </p>
          </div>

          {/* Translation Form */}
          <div
            className="card p-6 sm:p-8 mb-8 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            {/* Text Input */}
            <div className="mb-6">
              <label className="label">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Văn bản cần dịch (tiếng Việt)
              </label>
              <textarea
                className="input textarea"
                placeholder="Nhập từ, cụm từ hoặc câu cần dịch..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>

            {/* Context Selection */}
            <div className="mb-6">
              <label className="label">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Ngữ cảnh sử dụng
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {contextOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedContext(option.value)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        selectedContext === option.value
                          ? "bg-primary text-white shadow-md"
                          : "bg-border-light text-foreground-muted hover:bg-border hover:text-foreground"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Custom Context Input */}
              {selectedContext === "custom" && (
                <input
                  type="text"
                  className="input mt-3"
                  placeholder="Mô tả ngữ cảnh cụ thể của bạn..."
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                />
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleTranslate}
                disabled={isLoading}
                className="btn btn-primary flex-1"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Đang dịch...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Dịch Ngay
                  </>
                )}
              </button>
              <button onClick={handleReset} className="btn btn-outline">
                <RefreshCw className="w-4 h-4" />
                Làm Mới
              </button>
            </div>
          </div>

          {/* Translation Result */}
          {result && (
            <div className="card p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  Kết Quả Dịch
                </h2>
                <button
                  onClick={handleCopy}
                  className="btn btn-outline py-2 px-3"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Sao chép
                    </>
                  )}
                </button>
              </div>

              {/* Main Translation */}
              <div className="p-4 rounded-lg bg-linear-to-r from-primary/5 to-secondary/5 border border-primary/20 mb-4">
                <p className="text-lg text-foreground font-medium leading-relaxed">
                  {result.translation}
                </p>
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    Giải thích
                  </h3>
                  <p className="text-foreground-muted text-sm leading-relaxed p-3 rounded-lg bg-border-light">
                    {result.explanation}
                  </p>
                </div>
              )}

              {/* Alternatives */}
              {result.alternatives && result.alternatives.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Cách dịch khác
                  </h3>
                  <div className="space-y-2">
                    {result.alternatives.map((alt, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-border-light text-foreground-muted text-sm"
                      >
                        {alt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
  );
}
