'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Languages, PenLine, Home } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/translate', label: 'Dịch nghĩa', icon: Languages },
    { href: '/practice', label: 'Thực hành', icon: PenLine },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="glass fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold gradient-text hidden sm:block">
                            AI English
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${isActive
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-foreground-muted hover:text-primary hover:bg-primary/5'
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:block">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
}
