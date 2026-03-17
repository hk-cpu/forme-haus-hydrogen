import {motion} from 'framer-motion';
import {Link} from '@remix-run/react';

import {useTranslation} from '~/hooks/useTranslation';

const Icons = {
  Email: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="22,6 12,13 2,6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Phone: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Instagram: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="17.5"
        y1="6.5"
        x2="17.51"
        y2="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Twitter: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  TikTok: ({className = ''}: {className?: string}) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
};

export function TopBar() {
  const {isRTL, t} = useTranslation();

  const socialLinks = [
    {
      icon: Icons.Instagram,
      href: 'https://instagram.com/formehaus',
      label: 'Instagram',
    },
    {
      icon: Icons.Twitter,
      href: 'https://twitter.com/formehaus',
      label: 'Twitter',
    },
    {
      icon: Icons.TikTok,
      href: 'https://tiktok.com/@formehaus',
      label: 'TikTok',
    },
  ];

  return (
    <motion.div
      initial={{y: -40, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.5, ease: [0.25, 0.1, 0.25, 1]}}
      className="bg-[#0d0d0d] border-b border-[#a87441]/10 hidden md:block"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-10">
          {/* Left: Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{opacity: 0, y: -5}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1 * index + 0.2}}
                whileHover={{scale: 1.1}}
                className="text-[#8B8076] hover:text-[#a87441] transition-colors duration-300"
                aria-label={social.label}
              >
                <social.icon />
              </motion.a>
            ))}
          </div>

          {/* Center spacer */}
          <div className="flex-1 hidden lg:block" />

          {/* Right: Our Story */}
          <div className="flex items-center gap-6">
            <Link
              to="/pages/about"
              className="text-[10px] uppercase tracking-widest text-[#8B8076] hover:text-[#a87441] transition-colors duration-300 font-medium"
            >
              {t('topBar.about', 'Our Story')}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TopBar;
