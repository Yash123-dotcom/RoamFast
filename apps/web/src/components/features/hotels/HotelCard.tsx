'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from '@/lib/utils';
import { Star, MapPin, Heart } from 'lucide-react';

export interface HotelProps {
  id: string;
  name: string;
  location: string;
  price: number;
  image?: string | null;
  rating?: number;
}

export default function HotelCard({ id, name, location, price, image, rating = 4.5 }: HotelProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(false);

  const safeImage = (image && image.length > 5)
    ? image
    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1974";

  return (
    <Card
      className="group cursor-pointer border-white/5 bg-[#0f172a]/40 overflow-hidden hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-1 relative ring-1 ring-white/5 hover:ring-accent-gold/30"
      onClick={() => router.push(`/hotels/${id}`)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <Image
          src={safeImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="font-bold backdrop-blur-md bg-black/60 text-white border border-white/10 shadow-sm">
            <Star className="w-3 h-3 mr-1 fill-accent-gold text-accent-gold" />
            {rating}
          </Badge>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/70 border border-white/10 transition-all duration-300 group/heart"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors duration-300",
              isLiked ? "fill-red-500 text-red-500" : "text-white group-hover/heart:text-red-500"
            )}
          />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold font-heading leading-tight text-white group-hover:text-accent-gold transition-colors line-clamp-1">{name}</h3>
          <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {location}
          </p>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-white/5 mt-4">
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-white">₹{price?.toLocaleString()}</span>
            <span className="text-sm text-slate-500 mb-1 font-medium">/ night</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-xs font-bold text-accent-gold uppercase tracking-wider flex items-center gap-1">
            View Details
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HotelCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <Skeleton className="h-[240px] w-full" />
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="pt-4 border-t border-border/50 flex justify-between items-end">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  )
}