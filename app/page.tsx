'use client';

import Header from './components/Header';
import Link from 'next/link';
import { Languages, PenLine, Sparkles, ArrowRight, BookOpen, Target, Zap } from 'lucide-react';

const features = [
  {
    icon: Languages,
    title: 'Dịch Nghĩa Theo Ngữ Cảnh',
    description: 'Dịch từ, cụm từ hoặc câu tiếng Việt sang tiếng Anh với ngữ cảnh cụ thể. AI sẽ cho bạn bản dịch phù hợp nhất.',
    href: '/translate',
    color: 'from-primary to-primary-light',
    bgColor: 'bg-primary/5',
  },
  {
    icon: PenLine,
    title: 'Thực Hành Dịch',
    description: 'Luyện tập dịch từ tiếng Việt sang tiếng Anh với đoạn văn được AI tạo ra. Nhận phản hồi và sửa lỗi ngay lập tức.',
    href: '/practice',
    color: 'from-secondary to-secondary-light',
    bgColor: 'bg-secondary/5',
  },
];

const benefits = [
  {
    icon: Target,
    title: 'Học Theo Ngữ Cảnh',
    description: 'Hiểu cách sử dụng từ vựng và cấu trúc câu trong các tình huống thực tế.',
  },
  {
    icon: Zap,
    title: 'Phản Hồi Tức Thì',
    description: 'Nhận nhận xét và sửa lỗi ngay từ AI để cải thiện nhanh chóng.',
  },
  {
    icon: Sparkles,
    title: 'AI Thông Minh',
    description: 'Powered by Google Gemini - hiểu tiếng Việt tự nhiên và chính xác.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Học Tiếng Anh{' '}
              <span className="gradient-text">Thông Minh</span>{' '}
              với AI
            </h1>

            <p className="text-lg sm:text-xl text-foreground-muted mb-8 leading-relaxed">
              Ứng dụng học tiếng Anh cá nhân với sự hỗ trợ của trí tuệ nhân tạo.
              Dịch nghĩa theo ngữ cảnh, thực hành dịch và nhận phản hồi tức thì.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/translate" className="btn btn-primary w-full sm:w-auto">
                <Languages className="w-5 h-5" />
                Bắt Đầu Dịch
              </Link>
              <Link href="/practice" className="btn btn-outline w-full sm:w-auto">
                <PenLine className="w-5 h-5" />
                Thực Hành Ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Công Cụ Học Tập
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Các công cụ hữu ích giúp bạn cải thiện khả năng tiếng Anh mỗi ngày
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="card p-8 group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 bg-gradient-to-r ${feature.color} bg-clip-text`} style={{ color: 'var(--primary)' }} />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-foreground-muted mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-primary font-medium">
                    <span>Khám phá ngay</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Phương pháp học hiệu quả với công nghệ AI tiên tiến
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>

                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-foreground-muted">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">AI English Learning</span>
          </div>
          <p className="text-sm text-foreground-muted mt-2">
            Học tiếng Anh thông minh với trí tuệ nhân tạo
          </p>
        </div>
      </footer>
    </div>
  );
}
