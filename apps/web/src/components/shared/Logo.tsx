import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
}

export default function Logo({ className }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="relative w-10 h-10 shrink-0">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                    <defs>
                        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" /> {/* Amber 400 */}
                            <stop offset="50%" stopColor="#D97706" /> {/* Amber 600 */}
                            <stop offset="100%" stopColor="#FFFBEB" /> {/* Amber 50 */}
                        </linearGradient>
                        <linearGradient id="gold-shiny" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFBEB" />
                            <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                    </defs>

                    {/* Globe Grid */}
                    <circle cx="50" cy="50" r="45" stroke="url(#gold-gradient)" strokeWidth="3" fill="none" opacity="0.5" />
                    <ellipse cx="50" cy="50" rx="45" ry="15" stroke="url(#gold-gradient)" strokeWidth="2" fill="none" opacity="0.3" transform="rotate(-45 50 50)" />
                    <ellipse cx="50" cy="50" rx="45" ry="15" stroke="url(#gold-gradient)" strokeWidth="2" fill="none" opacity="0.3" transform="rotate(45 50 50)" />

                    {/* Arrow / Orbit Swish */}
                    <path
                        d="M 20 65 Q 10 50 25 35 Q 50 10 85 25"
                        stroke="url(#gold-shiny)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="none"
                        className="drop-shadow-sm"
                    />
                    <path
                        d="M 85 25 L 75 25 L 82 35 Z"
                        fill="url(#gold-shiny)"
                    />
                </svg>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-white hidden md:block">
                Roam<span className="text-gradient-neo">Fast</span>
            </span>
        </div>
    );
}
