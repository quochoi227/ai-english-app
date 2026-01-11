import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI English Learning - Học Tiếng Anh với AI",
  description: "Ứng dụng học tiếng Anh cá nhân với sự hỗ trợ của AI. Dịch nghĩa theo ngữ cảnh và thực hành dịch thông minh.",
  keywords: ["học tiếng anh", "AI", "dịch thuật", "thực hành dịch", "ngữ cảnh"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${lexend.variable} antialiased`} style={{ fontFamily: "'Lexend', sans-serif" }}>
        <div className="min-h-screen bg-background">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
