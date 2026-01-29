'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Filter, Star, Wifi, Car, Utensils, Waves } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('city') || '');
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price_asc');

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('city', query);
      params.append('minPrice', priceRange[0].toString());
      if (priceRange[1] < 50000) params.append('maxPrice', priceRange[1].toString());
      selectedAmenities.forEach(a => params.append('amenities', a));
      params.append('sortBy', sortBy);

      const res = await fetch(`http://127.0.0.1:3001/api/v1/hotels?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setHotels(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce or trigger fetch
    const timeout = setTimeout(fetchHotels, 500);
    return () => clearTimeout(timeout);
  }, [query, priceRange, selectedAmenities, sortBy]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations (e.g. Dubai, Mumbai)"
              className="w-full bg-[#0f172a] border border-white/10 rounded-full h-12 pl-12 pr-6 text-white focus:border-accent-gold/50 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-[#0f172a] border-white/10 rounded-full h-12">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f172a] border-white/10 text-white">
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 space-y-8 h-fit lg:sticky lg:top-32">
            <div>
              <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-accent-gold" /> Filters
              </h3>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-400 mb-4 block">Price Range</label>
                <Slider
                  defaultValue={[0, 50000]}
                  max={50000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
                <div className="flex justify-between text-sm">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}+</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium text-slate-400 mb-4 block">Amenities</label>
                <div className="space-y-3">
                  {[
                    { id: 'Wifi', icon: Wifi, label: 'Free Wifi' },
                    { id: 'Pool', icon: Waves, label: 'Swimming Pool' },
                    { id: 'Parking', icon: Car, label: 'Parking' },
                    { id: 'Restaurant', icon: Utensils, label: 'Restaurant' },
                  ].map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={() => toggleAmenity(amenity.id)}
                        className="border-white/20 data-[state=checked]:bg-accent-gold data-[state=checked]:text-black"
                      />
                      <label htmlFor={amenity.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                        <amenity.icon className="w-3 h-3 text-slate-500" />
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20 text-slate-500">Searching luxury stays...</div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-20 bg-[#0f172a] rounded-3xl border border-white/5 border-dashed">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="text-slate-400">Try adjusting your filters or search for another city.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {hotels.map((hotel, i) => (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group glass-neo rounded-[24px] overflow-hidden hover:border-accent-gold/50 transition-all hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)]"
                    >
                      <div className="h-64 relative overflow-hidden">
                        <img
                          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049'}
                          alt={hotel.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                          <Star className="w-3 h-3 text-accent-gold fill-accent-gold" />
                          {hotel.rating || 'New'}
                        </div>
                      </div>
                      <div className="p-6 relative">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold font-heading text-white group-hover:text-accent-gold transition-colors">{hotel.name}</h3>
                            <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {hotel.city}
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-light">{hotel.description}</p>

                        <div className="flex items-center gap-2 mb-6 flex-wrap">
                          {hotel.amenities?.slice(0, 3).map((amenity: string) => (
                            <span key={amenity} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-slate-300">
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities?.length > 3 && (
                            <span className="text-[10px] text-slate-500">+{hotel.amenities.length - 3} more</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Starting at</span>
                            <div className="items-baseline flex gap-1">
                              <span className="text-xl font-bold text-white">₹{hotel.price.toLocaleString()}</span>
                              <span className="text-xs text-slate-500">/night</span>
                            </div>
                          </div>
                          <Link href={`/hotels/${hotel.id}`}>
                            <Button className="bg-white text-black hover:bg-accent-gold hover:text-black rounded-full transition-all font-bold px-6">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}