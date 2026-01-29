'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface FeaturedCountdownProps {
    endDate: string; // ISO date string
    className?: string;
}

export default function FeaturedCountdown({ endDate, className }: FeaturedCountdownProps) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();
            const difference = end - now;

            if (difference <= 0) {
                setTimeLeft('Expired');
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            if (days > 0) {
                setTimeLeft(`${days} day${days > 1 ? 's' : ''} remaining`);
            } else if (hours > 0) {
                setTimeLeft(`${hours} hour${hours > 1 ? 's' : ''} remaining`);
            } else {
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${minutes} minute${minutes > 1 ? 's' : ''} remaining`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [endDate]);

    if (timeLeft === 'Expired') return null;

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full ${className}`}>
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">{timeLeft}</span>
        </div>
    );
}
