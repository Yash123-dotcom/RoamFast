'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/shared/StarRating';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ReviewForm({ hotelId, onReviewSubmitted }: { hotelId: string, onReviewSubmitted: () => void }) {
    const { user, getIdToken } = useAuth();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (!user) {
            setError('You must be logged in');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const token = await getIdToken();
            const res = await fetch('http://localhost:3001/api/v1/reviews', { // updated to /v1/reviews
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ hotelId, rating, comment })
            });

            if (res.ok) {
                setRating(0);
                setComment('');
                onReviewSubmitted();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to submit review');
            }
        } catch (err) {
            setError('Something went wrong');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 text-center">
                <p className="text-slate-400 mb-4">Please sign in to leave a review.</p>
                <Button onClick={() => router.push('/login')} variant="outline">Sign In</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white">Write a Review</h3>

            <div className="space-y-2">
                <label className="text-sm text-slate-400">Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            </div>

            <div className="space-y-2">
                <label className="text-sm text-slate-400">Review</label>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="bg-black/20 border-white/10 text-white min-h-[100px]"
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full bg-accent-gold text-black hover:bg-amber-400 font-bold">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Review
            </Button>
        </form>
    );
}
