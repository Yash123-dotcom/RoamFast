'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/shared/StarRating';
import { formatDistanceToNow } from 'date-fns';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        image?: string;
    };
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-10 border border-white/5 rounded-xl bg-white/5">
                <p className="text-slate-400">No reviews yet. Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={review.user.image} />
                                <AvatarFallback className="bg-accent-gold/20 text-accent-gold">
                                    {review.user.name?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-white text-sm">{review.user.name}</h4>
                                <p className="text-xs text-slate-500">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                        <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}
