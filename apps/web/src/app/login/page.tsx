'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
    const { signInWithGoogle } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            router.push('/');
        } catch (err) {
            console.error(err);
            setError('Google sign in failed');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 flex relative">
                {/* Left Side: Visuals (Hidden on mobile) */}
                <div className="hidden lg:block w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80"
                        alt="Luxury Interior"
                        fill
                        className="object-cover"
                        sizes="50vw"
                        priority
                    />
                    <div className="absolute bottom-12 left-12 z-20 max-w-md">
                        <blockquote className="text-3xl font-heading font-bold text-white mb-4">
                            "The journey of a thousand miles begins with a single step. Or a single click."
                        </blockquote>
                        <p className="text-accent-gold font-bold uppercase tracking-widest text-sm">— RoamFast Concierge</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-md space-y-8 relative z-10"
                    >
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2">Welcome Back</h1>
                            <p className="text-slate-400">Enter your details to access your account.</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleEmailSignIn}>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-slate-600 focus:border-accent-gold/50 transition-all font-medium text-lg px-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-bold text-slate-300">Password</label>
                                    <Link href="/forgot-password" className="text-xs text-accent-gold hover:text-white transition-colors">Forgot?</Link>
                                </div>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-slate-600 focus:border-accent-gold/50 transition-all font-medium text-lg px-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-white text-black hover:bg-accent-gold hover:text-black font-bold text-lg rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                Sign In
                            </Button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-4 text-slate-500 font-bold tracking-widest">Or continue with</span></div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"
                                onClick={handleGoogleSignIn}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </Button>
                        </form>

                        <p className="text-center text-slate-500 text-sm mt-8">
                            Don't have an account? <Link href="/signup" className="text-white hover:text-accent-gold font-bold transition-colors">Create Account</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
