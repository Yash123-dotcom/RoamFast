'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Star, Briefcase, Heart, Home, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StructuredReviewFormProps {
    hotelId: string;
    onSubmitted?: () => void;
}

const TRAVELER_TYPES = [
    { value: 'Business', label: 'Business', icon: Briefcase },
    { value: 'Couples', label: 'Couples', icon: Heart },
    { value: 'LongStay', label: 'Long Stay', icon: Home },
    { value: 'Solo', label: 'Solo', icon: User },
    { value: 'Family', label: 'Family', icon: Users },
];

export default function StructuredReviewForm({ hotelId, onSubmitted }: StructuredReviewFormProps) {
    const [overallRating, setOverallRating] = useState(5);
    const [cleanliness, setCleanliness] = useState(5);
    const [sleepQuality, setSleepQuality] = useState(5);
    const [staffExperience, setStaffExperience] = useState(5);
    const [luxuryValue, setLuxuryValue] = useState(5);
    const [travelerType, setTravelerType] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!travelerType) {
            alert('Please select your traveler type');
            return;
        }

        setSubmitting(true);

        try {
            // In production, make API call to submit review
            console.log('Submitting review:', {
                hotelId,
                overallRating,
                cleanliness,
                sleepQuality,
                staffExperience,
                luxuryValue,
                travelerType,
                comment,
            });

            // Mock success
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (onSubmitted) onSubmitted();
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const RatingSlider = ({
        label,
        value,
        onChange
    }: {
        label: string;
        value: number;
        onChange: (val: number[]) => void;
    }) => (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-slate-300">{label}</Label>
                <div className="flex items-center gap-1">
                    {[...Array(value)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-2 text-sm font-bold text-white">{value}/5</span>
                </div>
            </div>
            <Slider
                value={[value]}
                onValueChange={onChange}
                min={1}
                max={5}
                step={1}
                className="cursor-pointer"
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2 font-heading">Share Your Experience</h3>
                <p className="text-slate-400">Help future travelers by rating specific aspects of your stay</p>
            </div>

            {/* Overall Rating */}
            <RatingSlider
                label="Overall Experience"
                value={overallRating}
                onChange={(val) => setOverallRating(val[0])}
            />

            {/* Category Ratings */}
            <div className="grid md:grid-cols-2 gap-6">
                <RatingSlider
                    label="Cleanliness"
                    value={cleanliness}
                    onChange={(val) => setCleanliness(val[0])}
                />
                <RatingSlider
                    label="Sleep Quality"
                    value={sleepQuality}
                    onChange={(val) => setSleepQuality(val[0])}
                />
                <RatingSlider
                    label="Staff Experience"
                    value={staffExperience}
                    onChange={(val) => setStaffExperience(val[0])}
                />
                <RatingSlider
                    label="Luxury Value"
                    value={luxuryValue}
                    onChange={(val) => setLuxuryValue(val[0])}
                />
            </div>

            {/* Traveler Type */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-300">I traveled as</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {TRAVELER_TYPES.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setTravelerType(type.value)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                    travelerType === type.value
                                        ? "border-amber-500 bg-amber-500/10"
                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                )}
                            >
                                <Icon className={cn(
                                    "w-6 h-6",
                                    travelerType === type.value ? "text-amber-400" : "text-slate-400"
                                )} />
                                <span className={cn(
                                    "text-xs font-medium",
                                    travelerType === type.value ? "text-amber-400" : "text-slate-400"
                                )}>
                                    {type.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Written Review */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">Written Review (Optional)</Label>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share more details about your experience..."
                    className="min-h-[120px] bg-black/20 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50"
                    maxLength={1000}
                />
                <p className="text-xs text-slate-500">{comment.length}/1000 characters</p>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={submitting || !travelerType}
                className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-full"
            >
                {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </form>
    );
}
