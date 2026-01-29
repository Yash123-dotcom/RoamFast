'use client';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
    {
        id: 1,
        text: "\"RoamFast transformed my business travels. The quality of residences and the seamless booking process are unparalleled. Truly a five-star experience from start to finish.\"",
        name: "Alexandra Chen",
        role: "CEO, Tech Innovators",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
    },
    {
        id: 2,
        text: "\"The attention to detail and the level of service provided by the concierge team were exceptional. I felt completely taken care of. I can't imagine traveling any other way now.\"",
        name: "David Rodriguez",
        role: "Founder, Creative Labs",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-[#050b1d]">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-heading">What Our Clients Say</h2>
                    <p className="text-slate-400">Discover why the world's leading professionals choose RoamFast.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-[#0f172a]/50 p-10 rounded-[24px] border border-white/5 relative group hover:border-blue-500/30 transition-colors"
                        >
                            <div className="absolute top-8 right-8 text-6xl text-white/5 font-serif font-black select-none">”</div>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8 relative z-10">
                                {t.text}
                            </p>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border border-white/10">
                                    <AvatarImage src={t.image} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="text-white font-bold">{t.name}</h4>
                                    <p className="text-slate-500 text-sm">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
