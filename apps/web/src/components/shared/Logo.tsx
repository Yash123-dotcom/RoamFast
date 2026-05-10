import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
}

export default function Logo({ className }: LogoProps) {
    return (
        <div className={cn("flex items-center", className)}>
            <div className="relative w-40 h-12 shrink-0">
                <Image 
                    src="/logo.png" 
                    alt="NeonStay Logo" 
                    fill 
                    className="object-contain mix-blend-multiply"
                    priority
                />
            </div>
        </div>
    );
}
