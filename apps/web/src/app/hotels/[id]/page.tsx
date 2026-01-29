'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, Phone, BedDouble, CheckCircle } from 'lucide-react';

import ReviewList from '@/components/features/reviews/ReviewList';
import ReviewForm from '@/components/features/reviews/ReviewForm';

export default function HotelDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHotelData = () => {
    fetch(`http://localhost:3001/api/hotels/${id}`)
      .then(res => res.json())
      .then(data => {
        setHotel(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHotelData();
  }, [id]);

  // Safe Image Logic
  const heroImage = (hotel?.images && hotel.images.length > 0)
    ? hotel.images[0]
    : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1974";

  if (loading || !hotel) return <DetailsSkeleton />;

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20 font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full mt-20 group overflow-hidden">
        <div className="absolute inset-0 animate-kenburns">
          <img
            src={heroImage}
            alt={hotel.name}
            className="w-full h-full object-cover brightness-75"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-black/30"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto animate-enter">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-heading tracking-tight drop-shadow-lg leading-none">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                <MapPin className="w-4 h-4 text-accent-gold" />
                <span className="font-medium text-sm text-slate-200">{hotel.city || "Unknown Location"}</span>
              </div>
              {/* Rating */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                <span className="text-accent-gold">★</span>
                <span className="font-medium text-sm text-slate-200">
                  {hotel.rating && hotel.rating > 0 ? hotel.rating : 'New'}
                  <span className="text-slate-400 ml-1">({hotel.reviews?.length || 0} reviews)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-12 animate-enter" style={{ animationDelay: '0.2s' }}>
          {/* About Section */}
          <div className="bg-[#0f172a]/50 p-8 rounded-[24px] border border-white/5 shadow-sm backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4 font-heading">About this Sanctuary</h3>
            <p className="text-slate-400 leading-relaxed text-lg font-light">
              {hotel.description || "Experience the pinnacle of luxury and comfort. This property offers world-class amenities and breathtaking views, curated for the discerning traveler seeking an escape from the ordinary."}
            </p>

            <div className="mt-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(hotel.amenities?.length > 0 ? hotel.amenities : ['Free Wi-Fi', '24/7 Support', 'Luxury Bedding', 'Gym Access', 'Valet Parking', 'Spa']).map((am: string) => (
                  <div key={am} className="flex items-center gap-3 text-slate-300 font-medium p-3 rounded-xl bg-slate-900 border border-white/5">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    {am}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Room Types */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white font-heading">Select Accommodation</h3>
            {hotel.rooms?.length > 0 ? (
              hotel.rooms.map((room: any) => (
                <div key={room.id} className="p-6 rounded-[24px] bg-[#0f172a]/50 border border-white/5 hover:border-blue-500/30 hover:bg-[#0f172a] transition-all flex flex-col md:flex-row justify-between items-center group cursor-pointer gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{room.type}</h4>
                      <Badge variant="outline" className="border-blue-500/20 text-blue-400 bg-blue-500/5">Best Seller</Badge>
                    </div>
                    <p className="text-sm text-slate-400 flex items-center gap-2 mb-4">
                      <BedDouble className="w-4 h-4" /> Capacity: {room.capacity} Guests
                    </p>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      Enjoy panoramic views and exclusive lounge access with this premium suite.
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="text-2xl font-bold text-white">₹{room.price.toLocaleString()}</div>
                    <Button
                      onClick={() => router.push(`/checkout?hotel=${encodeURIComponent(hotel.name)}&price=${room.price}&room=${encodeURIComponent(room.type)}&hotelId=${hotel.id}`)}
                      className="w-full font-bold bg-white text-black hover:bg-slate-200">
                      Select Room
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-900/50 rounded-[24px] border border-white/5 text-slate-500">
                No specific rooms listed. Please use the main booking widget.
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="space-y-8 pt-8 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white font-heading">Guest Reviews</h3>
            <div className="grid grid-cols-1 gap-8">
              <ReviewForm hotelId={hotel.id} onReviewSubmitted={fetchHotelData} />
              <ReviewList reviews={hotel.reviews} />
            </div>
          </div>
        </div>

        {/* Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-[#0f172a] p-8 rounded-[24px] border border-white/10 shadow-xl shadow-black/20 animate-enter" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-end mb-8">
              <span className="text-slate-400 font-medium text-sm uppercase tracking-wider">Starting from</span>
              <div className="text-3xl font-bold text-white">
                ₹{hotel.price?.toLocaleString() || "5,000"}
                <span className="text-sm text-slate-400 font-normal ml-1">/night</span>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/checkout?hotel=${encodeURIComponent(hotel.name)}&price=${hotel.price || 5000}&hotelId=${hotel.id}`)}
              size="lg"
              className="w-full text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] h-14 bg-white text-black hover:bg-slate-200 border-none"
            >
              Reserve Now
            </Button>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium text-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Free cancellation until 24h before check-in.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Skeleton className="h-[60vh] w-full mt-20 rounded-none bg-muted" />
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-[300px] w-full rounded-[24px]" />
          <Skeleton className="h-[150px] w-full rounded-[24px]" />
          <Skeleton className="h-[150px] w-full rounded-[24px]" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[400px] w-full rounded-[24px]" />
        </div>
      </div>
    </div>
  )
}