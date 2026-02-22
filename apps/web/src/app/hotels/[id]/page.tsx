'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, BedDouble } from 'lucide-react';
import ReviewList from '@/components/features/reviews/ReviewList';
import ReviewForm from '@/components/features/reviews/ReviewForm';
import BookingPanel from '@/components/features/booking/BookingPanel';

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHotelData = () => {
    fetch(`http://localhost:3001/api/hotels/${id}`)
      .then(res => res.json())
      .then(data => { setHotel(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchHotelData(); }, [id]);

  const heroImage = (hotel?.images?.length > 0)
    ? hotel.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1974';

  if (loading || !hotel) return <DetailsSkeleton />;

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20 font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[65vh] w-full mt-20 overflow-hidden">
        <Image
          src={heroImage}
          alt={hotel.name}
          fill
          sizes="100vw"
          priority
          className="object-cover brightness-60 transition-transform duration-[8s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-black/20" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            {/* Gallery thumbnails */}
            {hotel.images?.length > 1 && (
              <div className="flex gap-2 mb-4">
                {hotel.images.slice(1, 4).map((img: string, i: number) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 hover:border-accent-gold transition-colors cursor-pointer">
                    <Image src={img} alt={`${hotel.name} ${i + 2}`} fill className="object-cover" sizes="64px" />
                  </div>
                ))}
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-heading tracking-tight drop-shadow-lg leading-none">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-white/80">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <MapPin className="w-4 h-4 text-accent-gold" />
                <span className="font-medium text-sm">{hotel.city || 'Unknown Location'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <span className="text-accent-gold">★</span>
                <span className="font-medium text-sm">
                  {hotel.rating > 0 ? hotel.rating : 'New'}
                  <span className="text-slate-400 ml-1">({hotel.reviews?.length || 0} reviews)</span>
                </span>
              </div>
              {hotel.verified && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <CheckCircle className="w-3 h-3 mr-1 inline" /> Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10 animate-enter [animation-delay:200ms]">

          {/* About */}
          <div className="bg-[#0f172a]/60 p-8 rounded-[24px] border border-white/5 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4 font-heading">About this Sanctuary</h3>
            <p className="text-slate-400 leading-relaxed text-lg font-light">
              {hotel.description || 'Experience the pinnacle of luxury and comfort. This property offers world-class amenities and breathtaking views, curated for the discerning traveler.'}
            </p>

            <div className="mt-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(hotel.amenities?.length > 0
                  ? hotel.amenities
                  : ['Free Wi-Fi', '24/7 Support', 'Luxury Bedding', 'Gym Access', 'Valet Parking', 'Spa']
                ).map((am: string) => (
                  <div key={am} className="flex items-center gap-3 text-slate-300 font-medium p-3 rounded-xl bg-slate-900/80 border border-white/5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {am}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Room Types */}
          {hotel.rooms?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white font-heading">Select Accommodation</h3>
              {hotel.rooms.map((room: any) => (
                <div
                  key={room.id}
                  className="p-6 rounded-[24px] bg-[#0f172a]/60 border border-white/5 hover:border-accent-gold/30 hover:bg-[#0f172a] transition-all flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{room.type}</h4>
                      <Badge variant="outline" className="border-amber-500/20 text-amber-400 bg-amber-500/5 text-xs">Best Seller</Badge>
                    </div>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <BedDouble className="w-4 h-4" /> Capacity: {room.capacity} guests
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-2xl font-bold text-white">₹{room.price?.toLocaleString()}</div>
                    <span className="text-xs text-slate-500">per night</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-8 pt-8 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white font-heading">Guest Reviews</h3>
            <div className="grid grid-cols-1 gap-8">
              <ReviewForm hotelId={hotel.id} onReviewSubmitted={fetchHotelData} />
              <ReviewList reviews={hotel.reviews} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Booking Panel */}
        <div className="lg:col-span-1">
          <BookingPanel hotel={{ id: hotel.id, name: hotel.name, price: hotel.price }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <Navbar />
      <Skeleton className="h-[65vh] w-full mt-20 rounded-none bg-slate-900" />
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-[300px] w-full rounded-[24px] bg-slate-900" />
          <Skeleton className="h-[150px] w-full rounded-[24px] bg-slate-900" />
          <Skeleton className="h-[150px] w-full rounded-[24px] bg-slate-900" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[500px] w-full rounded-[28px] bg-slate-900" />
        </div>
      </div>
    </div>
  );
}