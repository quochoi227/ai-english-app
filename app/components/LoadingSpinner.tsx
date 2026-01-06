'use client';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
                {/* Outer ring */}
                <div
                    className={`${sizeClasses[size]} rounded-full border-4 border-border animate-pulse`}
                />
                {/* Inner spinning ring */}
                <div
                    className={`${sizeClasses[size]} absolute top-0 left-0 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin`}
                />
            </div>
            {text && (
                <p className="text-foreground-muted text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}
