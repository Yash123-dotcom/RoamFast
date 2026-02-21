'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function SignUpPage() {
    const { signInWithGoogle } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength indicators
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!name.trim()) {
            setError('Please enter your name.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update the user's display name
            await updateProfile(userCredential.user, {
                displayName: name.trim(),
            });
            router.push('/');
        } catch (err: any) {
            console.error(err);
            // Provide user-friendly error messages
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please sign in instead.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Please use a stronger password.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError(err.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await signInWithGoogle();
            router.push('/');
        } catch (err) {
            console.error(err);
            setError('Google sign up failed. Please try again.');
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
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80"
                        alt="Luxury Hotel Pool"
                        fill
                        className="object-cover"
                        sizes="50vw"
                        priority
                    />
                    <div className="absolute bottom-12 left-12 z-20 max-w-md">
                        <blockquote className="text-3xl font-heading font-bold text-white mb-4">
                            "Join the world's most exclusive travel community."
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
                        className="w-full max-w-md space-y-6 relative z-10"
                    >
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2">Create Account</h1>
                            <p className="text-slate-400">Start your journey with us today.</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleEmailSignUp}>
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Full Name</label>
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-slate-600 focus:border-accent-gold/50 transition-all font-medium text-lg px-6"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email Field */}
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

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-slate-600 focus:border-accent-gold/50 transition-all font-medium text-lg px-6 pr-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {/* Password Strength Indicators */}
                                {password.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                        <div className={`flex items-center gap-1 ${hasMinLength ? 'text-green-400' : 'text-slate-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" /> 8+ characters
                                        </div>
                                        <div className={`flex items-center gap-1 ${hasUppercase ? 'text-green-400' : 'text-slate-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" /> Uppercase
                                        </div>
                                        <div className={`flex items-center gap-1 ${hasLowercase ? 'text-green-400' : 'text-slate-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" /> Lowercase
                                        </div>
                                        <div className={`flex items-center gap-1 ${hasNumber ? 'text-green-400' : 'text-slate-500'}`}>
                                            <CheckCircle2 className="w-3 h-3" /> Number
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-slate-600 focus:border-accent-gold/50 transition-all font-medium text-lg px-6 pr-12 ${confirmPassword.length > 0 && !passwordsMatch ? 'border-red-500/50' : ''
                                            } ${passwordsMatch ? 'border-green-500/50' : ''}`}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {confirmPassword.length > 0 && !passwordsMatch && (
                                    <p className="text-red-400 text-xs ml-1">Passwords do not match</p>
                                )}
                            </div>

                            {error && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl">{error}</p>}

                            <Button
                                type="submit"
                                disabled={loading || !passwordsMatch || !hasMinLength}
                                className="w-full h-14 bg-white text-black hover:bg-accent-gold hover:text-black font-bold text-lg rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                Create Account
                            </Button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-4 text-slate-500 font-bold tracking-widest">Or continue with</span></div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"
                                onClick={handleGoogleSignUp}
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

                        <p className="text-center text-slate-500 text-sm mt-6">
                            Already have an account? <Link href="/login" className="text-white hover:text-accent-gold font-bold transition-colors">Sign In</Link>
                        </p>

                        <p className="text-center text-slate-600 text-xs">
                            By creating an account, you agree to our <Link href="/terms" className="text-slate-400 hover:text-white">Terms of Service</Link> and <Link href="/privacy" className="text-slate-400 hover:text-white">Privacy Policy</Link>.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
