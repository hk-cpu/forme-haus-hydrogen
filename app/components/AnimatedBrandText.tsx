'use client';

import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedBrandTextProps {
    className?: string;
    showTagline?: boolean;
}

export function AnimatedBrandText({ className = '', showTagline = false }: AnimatedBrandTextProps) {
    const [isVisible, setIsVisible] = useState(true);
    const silkControls = useAnimationControls();
    const textControls = useAnimationControls();

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible((prev) => !prev);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isVisible) {
            silkControls.start({
                opacity: [0, 0.3, 0.5, 0.3, 0],
                scale: [0.8, 1.2, 1, 1.2, 0.8],
                transition: {
                    duration: 5,
                    ease: 'easeInOut',
                },
            });
        }
    }, [isVisible, silkControls]);

    return (
        <div className={`relative overflow-visible ${className}`}>
            {/* Animated Silk Flow Element */}
            <motion.div
                animate={silkControls}
                className="absolute inset-0 pointer-events-none"
                style={{
                    transformOrigin: 'center',
                }}
            >
                <svg
                    className="w-full h-full"
                    viewBox="0 0 400 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.path
                        d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50"
                        stroke="url(#silkGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={isVisible ? {
                            pathLength: [0, 1, 1, 0],
                            opacity: [0, 1, 1, 0],
                        } : {
                            pathLength: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 5,
                            ease: 'easeInOut',
                            times: [0, 0.3, 0.7, 1],
                        }}
                    />
                    <motion.path
                        d="M0,45 Q60,30 120,45 T240,45 T360,45 T400,45"
                        stroke="url(#silkGradient2)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={isVisible ? {
                            pathLength: [0, 1, 1, 0],
                            opacity: [0, 0.7, 0.7, 0],
                        } : {
                            pathLength: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 5,
                            ease: 'easeInOut',
                            times: [0, 0.3, 0.7, 1],
                            delay: 0.3,
                        }}
                    />
                    <defs>
                        <linearGradient id="silkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a87441" stopOpacity="0" />
                            <stop offset="50%" stopColor="#a87441" stopOpacity="1" />
                            <stop offset="100%" stopColor="#a87441" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="silkGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D4AF87" stopOpacity="0" />
                            <stop offset="50%" stopColor="#D4AF87" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#D4AF87" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            {/* Brand Text with Silk Blend Effect */}
            <motion.div
                className="relative z-10"
                animate={{
                    opacity: isVisible ? [1, 0.8, 1] : 1,
                }}
                transition={{
                    duration: 5,
                    ease: 'easeInOut',
                }}
            >
                <h1 className="text-[#F0EAE6] font-serif text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] uppercase relative">
                    <span className="relative inline-block">
                        FORMÉ
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a87441]/30 to-transparent"
                            animate={isVisible ? {
                                x: ['-100%', '200%'],
                                opacity: [0, 1, 0],
                            } : {
                                x: '-100%',
                                opacity: 0,
                            }}
                            transition={{
                                duration: 4,
                                ease: 'easeInOut',
                            }}
                        />
                    </span>
                    {' '}
                    <span className="relative inline-block">
                        HAUS
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a87441]/30 to-transparent"
                            animate={isVisible ? {
                                x: ['-100%', '200%'],
                                opacity: [0, 1, 0],
                            } : {
                                x: '-100%',
                                opacity: 0,
                            }}
                            transition={{
                                duration: 4,
                                ease: 'easeInOut',
                                delay: 0.2,
                            }}
                        />
                    </span>
                </h1>
                {showTagline && (
                    <motion.p
                        className="text-[#a87441] text-sm md:text-base tracking-[0.25em] mt-2 font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                    >
                        Where Essence Meets Elegance
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}
