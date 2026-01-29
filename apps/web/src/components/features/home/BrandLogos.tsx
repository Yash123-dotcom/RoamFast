const brands = [
  "Airbnb", "Booking.com", "Expedia", "TripAdvisor", "Agoda",
  "Vrbo", "Kayak", "Skyscanner", "Hotels.com", "Trivago"
];

export default function BrandLogos() {
  return (
    <div className="w-full bg-white py-16 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
          Comparing prices from 100+ trusted sites
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex space-x-16 items-center">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <span key={i} className="text-2xl md:text-3xl font-heading font-serif text-slate-300 hover:text-slate-600 transition-colors uppercase tracking-widest cursor-pointer select-none">
              {brand}
            </span>
          ))}
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex space-x-16 items-center ml-16">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <span key={`dup-${i}`} className="text-2xl md:text-3xl font-heading font-serif text-slate-300 hover:text-slate-600 transition-colors uppercase tracking-widest cursor-pointer select-none">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Light Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10" />
    </div>
  );
}