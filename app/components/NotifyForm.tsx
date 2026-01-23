import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Inline motion variants
const fadeUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
};

export default function NotifyForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        // Stubbed action
        setTimeout(() => {
            setStatus('success');
            setMessage('Thank you for subscribing.');
            setEmail('');
        }, 1000);
    };

    if (status === 'success') {
        return (
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUp}
                className="flex items-center space-x-2 text-[#F5F2F0] py-2 justify-center"
            >
                <Check strokeWidth={1} className="h-4 w-4 text-green-400" />
                <span className="text-sm font-light tracking-wide">{message}</span>
            </motion.div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            <form onSubmit={handleSubmit} className="input__container">
                <div className="shadow__input"></div>
                <button
                    type="submit"
                    className="input__button__shadow"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? (
                        <Loader2 strokeWidth={1} className="h-5 w-5 animate-spin text-neutral-800" />
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:scale-110 transition-transform duration-300">
                            <circle cx="12" cy="12" r="6" fill="url(#sphere-gradient)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                            <defs>
                                <radialGradient id="sphere-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9 9) rotate(50) scale(12)">
                                    <stop stopColor="#F0EAE6" />
                                    <stop offset="1" stopColor="#8B5E3C" />
                                </radialGradient>
                            </defs>
                        </svg>
                    )}
                </button>
                <input
                    type="email"
                    name="email"
                    className="input__search bg-transparent text-[#5C5046] placeholder:text-[#8B8076]/60 font-light"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </form>

            {status === 'error' && (
                <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: [0, -5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 text-xs text-red-400 font-light"
                >
                    {message}
                </motion.p>
            )}
        </div>
    );
}
