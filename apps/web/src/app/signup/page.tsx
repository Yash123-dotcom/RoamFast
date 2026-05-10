'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, User, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const getPasswordStrength = () => {
        let score = 0;
        if (hasMinLength) score++;
        if (hasUppercase) score++;
        if (hasLowercase) score++;
        if (hasNumber) score++;
        
        if (score === 0) return { label: 'Weak', score: 0 };
        if (score <= 2) return { label: 'Fair', score: score };
        if (score === 3) return { label: 'Good', score: score };
        return { label: 'Strong', score: 4 };
    };

    const pwdStrength = getPasswordStrength();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (pwdStrength.score < 3) {
            setError('Please choose a stronger password');
            return;
        }

        try {
            setError('');
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                await updateProfile(userCredential.user, { displayName: name });
            }
            router.push('/');
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to create an account');
        } finally {
            setLoading(false);
        }
    };

    const StrengthIndicator = ({ active, label }: { active: boolean; label: string }) => (
        <div className={`flex items-center gap-1.5 text-xs ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
            <CheckCircle2 className={`w-3 h-3 ${active ? 'opacity-100' : 'opacity-40'}`} />
            {label}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
            {/* LEFT SIDE - Brand & Visuals */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80"
                    alt="Luxury Hotel Pool"
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority
                />
                <div className="absolute bottom-12 left-12 z-20 max-w-md">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 shadow-xl">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                        <span className="text-white text-xs font-bold tracking-widest uppercase">Exclusive Access</span>
                    </div>
                    <blockquote className="text-3xl font-heading font-bold text-white mb-4 leading-tight drop-shadow-md">
                        "Join the world's most discerning travel community."
                    </blockquote>
                    <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">— NeonStay Concierge</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8 relative z-10"
                >
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold font-heading mb-2 text-slate-900">Apply for Membership</h2>
                        <p className="text-slate-600 text-sm">Join an exclusive network of global travelers.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignUp}>
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="text" 
                                    placeholder="John Doe"
                                    className="pl-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                    value={name} onChange={(e) => setName(e.target.value)} required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="email" 
                                    placeholder="you@example.com"
                                    className="pl-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pl-11 pr-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <StrengthIndicator active={hasMinLength} label="8+ characters" />
                                    <StrengthIndicator active={hasUppercase} label="Uppercase" />
                                    <StrengthIndicator active={hasLowercase} label="Lowercase" />
                                    <StrengthIndicator active={hasNumber} label="Number" />
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`pl-11 pr-11 h-12 rounded-xl text-slate-900 placeholder:text-slate-400 bg-slate-50 shadow-sm transition-colors border ${
                                        confirmPassword.length > 0 
                                            ? passwordsMatch ? 'border-emerald-500 focus:ring-emerald-500 focus:border-emerald-500' : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && !passwordsMatch && (
                                <p className="text-red-500 text-xs font-medium ml-1">Passwords do not match</p>
                            )}
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || (password.length > 0 && !passwordsMatch) || pwdStrength.score < 3}
                            className="w-full h-12 font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md bg-indigo-600 text-white hover:bg-indigo-700 mt-6"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </Button>
                    </form>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <p className="text-center text-slate-600 text-sm">
                            Already a member?{' '}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                                Sign In
                            </Link>
                        </p>
                        <p className="text-center text-slate-500 text-xs">
                            By creating an account, you agree to our{' '}
                            <Link href="/legal" className="font-semibold text-slate-700 hover:text-indigo-600">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="/legal" className="font-semibold text-slate-700 hover:text-indigo-600">Privacy Policy</Link>.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
