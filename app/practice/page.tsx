"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  PenLine,
  Send,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface EvaluationResult {
  score: number;
  feedback: string;
  errors: Array<{
    error: string;
    correction: string;
    explanation: string;
  }>;
  suggestedTranslation: string;
  isCorrect: boolean;
}

interface SentenceState {
  original: string;
  userTranslation: string;
  evaluation: EvaluationResult | null;
  isCompleted: boolean;
}

export default function PracticePage() {
  const [sentences, setSentences] = useState<SentenceState[]>([]);
  const [topic, setTopic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const generateParagraph = async () => {
    setIsGenerating(true);
    setError("");
    setSentences([]);
    setCurrentIndex(0);
    setUserInput("");

    try {
      const response = await fetch("/api/practice/generate", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      const sentenceStates: SentenceState[] = data.sentences.map(
        (s: string) => ({
          original: s,
          userTranslation: "",
          evaluation: null,
          isCompleted: false,
        })
      );

      setSentences(sentenceStates);
      setTopic(data.topic || "Đoạn văn thực hành");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo đoạn văn"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateParagraph();
  }, []);

  useEffect(() => {
    if (!isGenerating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isGenerating]);

  const handleSubmit = async () => {
    if (!userInput.trim() || isEvaluating) return;

    const currentSentence = sentences[currentIndex];
    if (!currentSentence) return;

    setIsEvaluating(true);
    setError("");

    try {
      const response = await fetch("/api/practice/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalSentence: currentSentence.original,
          userTranslation: userInput.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      // Update current sentence with evaluation
      const newSentences = [...sentences];
      newSentences[currentIndex] = {
        ...currentSentence,
        userTranslation: userInput.trim(),
        evaluation: data,
        isCompleted: true,
      };
      setSentences(newSentences);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi chấm điểm"
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
    }
  };

  const currentSentence = sentences[currentIndex];
  const completedCount = sentences.filter((s) => s.isCompleted).length;
  const totalScore = sentences
    .filter((s) => s.evaluation)
    .reduce((sum, s) => sum + (s.evaluation?.score || 0), 0);
  const averageScore =
    completedCount > 0 ? (totalScore / completedCount).toFixed(1) : 0;
  const isAllCompleted =
    sentences.length > 0 && completedCount === sentences.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary-dark text-sm font-medium mb-4">
              <PenLine className="w-4 h-4" />
              Thực Hành Dịch
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Luyện <span className="gradient-text">Dịch Thuật</span>
            </h1>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Dịch từng câu trong đoạn văn và nhận phản hồi từ AI
            </p>
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="card p-12 text-center animate-fade-in">
              <LoadingSpinner size="lg" text="Đang tạo đoạn văn..." />
            </div>
          )}

          {/* Error State */}
          {error && !isGenerating && (
            <div className="card p-6 mb-6 bg-error/10 border-error/20 animate-fade-in">
              <p className="text-error text-center">{error}</p>
              <button
                onClick={generateParagraph}
                className="btn btn-primary mx-auto mt-4"
              >
                <RefreshCw className="w-4 h-4" />
                Thử Lại
              </button>
            </div>
          )}

          {/* Main Content */}
          {!isGenerating && sentences.length > 0 && (
            <>
              {/* Progress & Stats */}
              <div className="card p-4 mb-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">
                        {completedCount}/{sentences.length} câu
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-warning" />
                      <span className="font-medium text-foreground">
                        Điểm TB: {averageScore}/10
                      </span>
                    </div>
                  </div>

                  <div className="badge badge-primary">{topic}</div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-border-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{
                      width: `${(completedCount / sentences.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Sentences List */}
              <div className="space-y-4 mb-6">
                {sentences.map((sentence, index) => (
                  <div
                    key={index}
                    className={`card p-5 transition-all duration-300 animate-slide-in ${
                      index === currentIndex
                        ? "ring-2 ring-primary shadow-lg"
                        : sentence.isCompleted
                        ? "opacity-80"
                        : "opacity-50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Sentence Number & Status */}
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                        ${
                          index === currentIndex
                            ? "bg-primary text-white"
                            : sentence.isCompleted
                            ? sentence.evaluation?.isCorrect
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                            : "bg-border-light text-foreground-muted"
                        }
                      `}
                      >
                        {sentence.isCompleted ? (
                          sentence.evaluation?.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )
                        ) : (
                          index + 1
                        )}
                      </span>

                      {sentence.evaluation && (
                        <span
                          className={`
                          badge ${
                            sentence.evaluation.isCorrect
                              ? "badge-success"
                              : "badge-warning"
                          }
                        `}
                        >
                          {sentence.evaluation.score}/10 điểm
                        </span>
                      )}
                    </div>

                    {/* Original Sentence */}
                    <p className="text-foreground font-medium mb-3 leading-relaxed">
                      {sentence.original}
                    </p>

                    {/* Input for Current Sentence */}
                    {index === currentIndex && !sentence.isCompleted && (
                      <div className="mt-4">
                        <div className="flex gap-2">
                          <input
                            ref={inputRef}
                            type="text"
                            className="input flex-1"
                            placeholder="Nhập bản dịch tiếng Anh của bạn..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isEvaluating}
                          />
                          <button
                            onClick={handleSubmit}
                            disabled={isEvaluating || !userInput.trim()}
                            className="btn btn-primary"
                          >
                            {isEvaluating ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Evaluation Result */}
                    {sentence.isCompleted && sentence.evaluation && (
                      <div className="mt-4 space-y-3 animate-fade-in">
                        {/* User's Translation */}
                        <div className="p-3 rounded-lg bg-border-light">
                          <p className="text-sm text-foreground-muted mb-1">
                            Bản dịch của bạn:
                          </p>
                          <p className="text-foreground">
                            {sentence.userTranslation}
                          </p>
                        </div>

                        {/* Feedback */}
                        <div
                          className={`p-3 rounded-lg ${
                            sentence.evaluation.isCorrect
                              ? "bg-success/10"
                              : "bg-warning/10"
                          }`}
                        >
                          <p className="text-sm font-medium mb-1 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Nhận xét:
                          </p>
                          <p className="text-foreground-muted text-sm">
                            {sentence.evaluation.feedback}
                          </p>
                        </div>

                        {/* Errors */}
                        {sentence.evaluation.errors &&
                          sentence.evaluation.errors.length > 0 && (
                            <div className="p-3 rounded-lg bg-error/5">
                              <p className="text-sm font-medium mb-2 text-error">
                                Các lỗi cần sửa:
                              </p>
                              <ul className="space-y-2">
                                {sentence.evaluation.errors.map(
                                  (err, errIdx) => (
                                    <li key={errIdx} className="text-sm">
                                      <span className="text-error line-through">
                                        {err.error}
                                      </span>
                                      <ArrowRight className="w-3 h-3 inline mx-2 text-foreground-muted" />
                                      <span className="text-success">
                                        {err.correction}
                                      </span>
                                      {err.explanation && (
                                        <p className="text-foreground-muted mt-1 pl-4 text-xs">
                                          → {err.explanation}
                                        </p>
                                      )}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Suggested Translation */}
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="text-sm font-medium mb-1 text-primary">
                            Bản dịch mẫu:
                          </p>
                          <p className="text-foreground">
                            {sentence.evaluation.suggestedTranslation}
                          </p>
                        </div>

                        {/* Next Button */}
                        {index === currentIndex &&
                          index < sentences.length - 1 && (
                            <button
                              onClick={handleNextSentence}
                              className="btn btn-secondary w-full"
                            >
                              Câu Tiếp Theo
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Completion Section */}
              {isAllCompleted && (
                <div className="card p-8 text-center animate-fade-in bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Hoàn Thành Xuất Sắc! 🎉
                  </h2>
                  <p className="text-foreground-muted mb-4">
                    Bạn đã hoàn thành {sentences.length} câu với điểm trung bình{" "}
                    {averageScore}/10
                  </p>
                  <button
                    onClick={generateParagraph}
                    className="btn btn-primary"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Thực Hành Đoạn Mới
                  </button>
                </div>
              )}

              {/* New Paragraph Button (not completed) */}
              {!isAllCompleted && (
                <div className="text-center">
                  <button
                    onClick={generateParagraph}
                    className="btn btn-outline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Tạo Đoạn Văn Mới
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
