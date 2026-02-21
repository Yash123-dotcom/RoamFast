'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  const navLinks = [
    { name: 'Collections', href: '/collections' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Journal', href: '/journal' },
    { name: 'Partner Access', href: '/list-property' },
  ];

  return (
    <>
      <motion.header
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
      >
        <div className={cn(
          "pointer-events-auto flex items-center justify-between gap-8 px-6 py-3 rounded-full transition-all duration-500",
          scrolled
            ? "glass-neo w-full max-w-4xl border-white/10 bg-black/60"
            : "w-full max-w-6xl border-transparent bg-transparent"
        )}>
          {/* Logo */}
          <Link href="/" className="relative z-50">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 px-8 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wide text-slate-300 transition-colors hover:text-white hover:text-glow relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-600 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full w-10 h-10 p-0 border border-white/10 bg-white/5">
                    {user.photoURL ? (
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image src={user.photoURL} alt="User" fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <User className="w-5 h-5 text-slate-300" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black border-white/10 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.displayName || 'User'}</p>
                      <p className="text-xs leading-none text-slate-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => router.push('/owner/dashboard')}>
                    Owner Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-white/10 text-red-400 cursor-pointer" onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <span className="text-sm font-bold text-slate-300 hover:text-white cursor-pointer transition-colors">
                  Sign In
                </span>
              </Link>
            )}

            <Link href="/book">
              <Button
                className="btn-magnetic bg-white text-black hover:bg-amber-400 hover:text-black rounded-full px-6 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] border-none transition-all"
              >
                Reserve Your Stay
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden pointer-events-auto p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, y: '-100%' }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? '0%' : '-100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 md:hidden flex flex-col justify-center items-center gap-8"
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="text-4xl font-heading font-light text-white hover:text-amber-400 transition-colors"
          >
            {link.name}
          </Link>
        ))}
        <div className="flex flex-col gap-6 mt-12 w-64">
          {user ? (
            <>
              <Button variant="outline" className="w-full border-white/20 h-14 text-xl rounded-full text-white" onClick={() => { router.push('/owner/dashboard'); setIsOpen(false); }}>
                My Dashboard
              </Button>
              <Button variant="ghost" className="w-full text-red-400 h-14 text-xl" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full border-white/20 h-14 text-xl rounded-full text-white" onClick={() => setIsOpen(false)}>
                Sign In
              </Button>
            </Link>
          )}

          <Link href="/book" className="w-full">
            <Button className="w-full bg-amber-500 text-black h-14 text-xl font-bold rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)]" onClick={() => setIsOpen(false)}>
              Reserve Your Stay
            </Button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
