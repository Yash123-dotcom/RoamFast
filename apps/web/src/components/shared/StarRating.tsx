'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    readonly = false,
    size = 'md'
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index: number) => {
        if (!readonly) setHoverRating(index);
    };

    const handleMouseLeave = () => {
        if (!readonly) setHoverRating(0);
    };

    const handleClick = (index: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(index);
        }
    };

    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-5 h-5',
        lg: 'w-8 h-8'
    };

    return (
        <div className="flex gap-1" onMouseLeave={handleMouseLeave}>
            {Array.from({ length: maxRating }).map((_, i) => {
                const starIndex = i + 1;
                const isFilled = (hoverRating || rating) >= starIndex;

                return (
                    <Star
                        key={i}
                        className={cn(
                            sizeClasses[size],
                            "transition-all",
                            isFilled ? "fill-amber-400 text-amber-400" : "text-slate-600",
                            !readonly && "cursor-pointer hover:scale-110"
                        )}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onClick={() => handleClick(starIndex)}
                    />
                );
            })}
        </div>
    );
}
