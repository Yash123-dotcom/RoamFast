'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
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
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password. Please try again.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Sign in failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
            {/* LEFT SIDE - Brand & Image */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/70 to-transparent z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80"
                    alt="Luxury Hotel"
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority
                />
                <div className="absolute bottom-12 left-12 z-20 max-w-md">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-2 mb-6">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                        <span className="text-indigo-300 text-xs font-bold tracking-widest uppercase">Verified Luxury</span>
                    </div>
                    <blockquote className="text-3xl font-heading font-bold text-white mb-4 leading-tight">
                        "Every stay personally curated for those who value their time."
                    </blockquote>
                    <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">— NeonStay Concierge</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8 relative z-10"
                >
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold font-heading mb-2 text-slate-900">Welcome Back</h2>
                        <p className="text-slate-600 text-sm">Sign in to access your exclusive reservations.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleEmailSignIn}>
                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                <Link href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white' }}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center mt-8 text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                            Apply for Membership
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
