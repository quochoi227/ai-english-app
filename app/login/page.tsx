"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LogIn, AlertCircle } from "lucide-react";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }

      // Redirect về trang trước đó hoặc trang chủ
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="card p-6 sm:p-8 animate-fade-in"
      style={{ animationDelay: "100ms" }}
    >
      <form onSubmit={handleSubmit}>
        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="label">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              className="input pl-10!"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <Lock className="w-5 h-5 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Đăng Nhập
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Đăng Nhập</h1>
          <p className="text-foreground-muted">
            Nhập mật khẩu để truy cập ứng dụng
          </p>
        </div>

        {/* Login Form wrapped in Suspense */}
        <Suspense
          fallback={
            <div className="card p-6 sm:p-8">
              <div className="animate-pulse">
                <div className="h-4 bg-border rounded w-20 mb-2"></div>
                <div className="h-12 bg-border rounded mb-6"></div>
                <div className="h-12 bg-primary/50 rounded"></div>
              </div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <p
          className="text-center text-foreground-muted text-sm mt-6 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          AI English Learning App
        </p>
      </div>
    </div>
  );
}
