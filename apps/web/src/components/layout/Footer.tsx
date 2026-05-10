import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import Logo from '@/components/shared/Logo';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-900 font-sans border-t border-slate-200 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-8">
          <Link href="/" className="inline-block">
            <Logo className="w-48 text-slate-900" />
          </Link>
          <p className="text-slate-600 leading-relaxed max-w-sm text-base">
            Every stay personally vetted for quality and trust. Experience curated luxury that saves you time.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <Link key={i} href="/search" className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 group transition-all duration-300">
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="md:col-span-2 md:col-start-6">
          <h4 className="text-lg font-bold mb-8 font-heading text-slate-900 tracking-wide">Company</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium block hover:translate-x-1 duration-200">About Us</Link></li>
            <li><Link href="/trust" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium block hover:translate-x-1 duration-200">Trust & Safety</Link></li>
            <li><Link href="/concierge" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium block hover:translate-x-1 duration-200">Concierge</Link></li>
            <li><Link href="/careers" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium block hover:translate-x-1 duration-200">Careers</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="md:col-span-2">
          <h4 className="text-lg font-bold mb-8 font-heading text-slate-900 tracking-wide">Support</h4>
          <ul className="space-y-4">
            <li><Link href="/support" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium block hover:translate-x-1 duration-200">Help Center</Link></li>
            <li><Link href="/trust" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium block hover:translate-x-1 duration-200">Safety Information</Link></li>
            <li><Link href="/support" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium block hover:translate-x-1 duration-200">Cancellation Options</Link></li>
            <li><Link href="/support" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium block hover:translate-x-1 duration-200">Report Concern</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="md:col-span-3">
          <h4 className="text-lg font-bold mb-8 font-heading text-slate-900 tracking-wide">The Insider</h4>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Join our exclusive list for early access to new properties and curated travel guides.
          </p>
          <div className="relative">
            <Input
              type="email"
              placeholder="Email address"
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 rounded-full pr-12 h-14 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 transition-all shadow-sm"
            />
            <Button
              size="icon"
              className="absolute right-2 top-2 h-10 w-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs tracking-wider uppercase font-medium">
        <p>&copy; {new Date().getFullYear()} RoamFast Technologies Inc. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link href="/legal" className="hover:text-indigo-600 transition-colors">Privacy</Link>
          <Link href="/legal" className="hover:text-indigo-600 transition-colors">Terms</Link>
          <Link href="/legal" className="hover:text-indigo-600 transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}