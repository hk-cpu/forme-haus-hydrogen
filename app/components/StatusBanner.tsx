import { motion } from 'framer-motion';
import { ShinyText } from "./ShinyText";
import { useEffect, useState } from "react";
import { useTranslation } from '~/hooks/useTranslation';

export function StatusBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        // Simple mount animation
        setIsVisible(true);
    }, []);

    // If we want strict "Coming Soon" check in a client component, we should pass it as a prop from Layout.
    // But sticking to the requested "Dynamic Effects" on the banner itself:

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
            className="w-full bg-[#121212] text-[#E0D8D0] text-[10px] uppercase tracking-[0.25em] py-3 text-center border-b border-[#a87441]/20 relative z-[60]"
        >
            <ShinyText
                text={t('banner.shipping')}
                speed={4}
                shineColor="#a87441"
                color="#AD9686"
                className="font-light"
            />
        </motion.div>
    );
}
