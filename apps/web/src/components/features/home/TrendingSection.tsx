'use client';

import Link from 'next/link';
import HotelCard, { HotelProps } from '@/components/features/hotels/HotelCard';
import { motion, Variants } from 'framer-motion';

const featuredHotels: HotelProps[] = [
  {
    id: "1",
    name: "Grand Hyatt",
    location: "Mumbai",
    price: 12500,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3540",
    rating: 4.9
  },
  {
    id: "2",
    name: "Oberoi Udaivilas",
    location: "Udaipur",
    price: 32000,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1974",
    rating: 5.0
  },
  {
    id: "3",
    name: "Taj MG Road",
    location: "Bangalore",
    price: 10100,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070",
    rating: 4.8
  }
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function TrendingSection() {
  return (
    <section className="container-custom py-24 bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 font-heading text-[var(--text-primary)]">
              Trending Destinations
            </h2>
            <p className="text-gray-500 text-lg max-w-lg">
              Most booked properties by our exclusive members this week.
            </p>
          </div>
          <Link href="/search" className="hidden md:flex items-center gap-2 font-bold hover:text-blue-600 transition-colors text-sm text-[var(--accent)]">
            View All Stays
            <span>→</span>
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredHotels.map((hotel) => (
            <motion.div variants={item} key={hotel.id}>
              <HotelCard {...hotel} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center md:hidden">
          <Link href="/search" className="btn-secondary inline-block">
            View All Stays
          </Link>
        </div>
      </div>
    </section>
  );
}
