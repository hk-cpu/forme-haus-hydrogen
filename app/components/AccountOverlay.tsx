import {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link, useFetcher, useNavigation} from '@remix-run/react';

import {useUI} from '~/context/UIContext';
import {useTranslation} from '~/hooks/useTranslation';
import {usePrefixPathWithLocale} from '~/lib/utils';

// Icons
const Icons = {
  Close: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  ),
  Eye: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <ellipse cx="12" cy="12" rx="9" ry="6" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 3l18 18" />
      <path d="M10.5 10.5a3 3 0 0 0 4 4" />
      <path d="M7.5 7.5C5 9 3 12 3 12s3 6 9 6c1.5 0 2.8-.3 4-.9" />
      <path d="M21 12s-3-6-9-6c-.5 0-1 0-1.5.1" />
    </svg>
  ),
  Truck: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M16 16V6H2v10h14z" />
      <path d="M16 8h4l2 4v4h-6" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  ),
  Globe: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  ),
  Mail: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 6l10 7 10-7" />
    </svg>
  ),
  Heart: ({filled = false}: {filled?: boolean}) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Check: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
};

/**
 * AccountOverlay - Full-screen login/account overlay
 *
 * Features:
 * - Two sections: "Sign In" and "Create Account"
 * - Password visibility toggle
 * - One-time login link option
 * - Benefits list with icons
 * - Connects to Shopify Customer Account API
 * - Dark luxury theme
 */
export function AccountOverlay() {
  const {state, dispatch} = useUI();
  const {isRTL, t} = useTranslation();
  const prefixPath = usePrefixPathWithLocale;
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Fetchers for auth actions
  const loginFetcher = useFetcher();
  const registerFetcher = useFetcher();
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    dispatch({type: 'CLOSE_LOGIN'});
    setEmail('');
    setLoginPassword('');
    setRegisterPassword('');
  };

  // Focus trap implementation
  useEffect(() => {
    if (!state.isLoginOpen) return;

    // Focus first input when overlay opens
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const overlay = overlayRef.current;
      if (!overlay) return;

      const focusableElements = overlay.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isLoginOpen]);

  // Close overlay when a successful login navigates to /account
  useEffect(() => {
    if (navigation.location?.pathname?.includes('/account')) {
      dispatch({type: 'CLOSE_LOGIN'});
    }
  }, [navigation.location, dispatch]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginFetcher.submit(
      {email, password: loginPassword, formId: 'login'},
      {method: 'post', action: prefixPath('/account/login')},
    );
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    registerFetcher.submit(
      {email, password: registerPassword, formId: 'register'},
      {method: 'post', action: prefixPath('/account/login')},
    );
  };

  const benefits = [
    {
      icon: <Icons.Truck />,
      text: t(
        'account.benefit.orders',
        'Track your orders and view purchase history',
      ),
    },
    {
      icon: <Icons.Globe />,
      text: t('account.benefit.profile', 'Manage your personal information'),
    },
    {
      icon: <Icons.Mail />,
      text: t('account.benefit.news', 'Receive exclusive news and updates'),
    },
    {
      icon: <Icons.Heart />,
      text: t(
        'account.benefit.wishlist',
        'Save your favorite items to wishlist',
      ),
    },
  ];

  return (
    <AnimatePresence>
      {state.isLoginOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 bg-background z-[300] flex flex-col"
          style={{direction: isRTL ? 'rtl' : 'ltr'}}
          role="dialog"
          aria-modal="true"
          aria-label="Account"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.3}}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-bronze/20">
            <h2 className="font-serif text-2xl text-warm">
              {t('account.title', 'My Account')}
            </h2>
            <button
              ref={closeButtonRef}
              className="p-2 text-warm hover:text-bronze transition-colors"
              onClick={handleClose}
              aria-label={t('common.close', 'Close')}
            >
              <Icons.Close />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-8">
              {/* Tab Navigation */}
              <div className="flex gap-8 mb-8 border-b border-bronze/20">
                <button
                  className={`pb-4 text-sm uppercase tracking-[0.15em] transition-colors relative ${
                    activeTab === 'signin'
                      ? 'text-bronze'
                      : 'text-taupe hover:text-warm'
                  }`}
                  onClick={() => setActiveTab('signin')}
                >
                  {t('account.signIn', 'Sign In')}
                  {activeTab === 'signin' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze"
                      layoutId="accountTab"
                    />
                  )}
                </button>
                <button
                  className={`pb-4 text-sm uppercase tracking-[0.15em] transition-colors relative ${
                    activeTab === 'create'
              ? 'text-bronze'
                      : 'text-taupe hover:text-warm'
                  }`}
                  onClick={() => setActiveTab('create')}
                >
                  {t('account.create', 'Create Account')}
                  {activeTab === 'create' && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze"
                      layoutId="accountTab"
                    />
                  )}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Sign In Section */}
                <motion.div
                  initial={{opacity: 0, x: -20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: 0.1}}
                  className={
                    activeTab === 'signin' ? 'block' : 'hidden md:block'
                  }
                >
                  <h3 className="font-serif text-xl text-warm mb-6">
                    {t('account.signIn', 'Sign In')}
                  </h3>

                  {/* Google SSO — fast path */}
                  <a
                    href={prefixPath('/account/google')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-bronze/20 rounded-lg text-warm text-sm hover:border-bronze/40 hover:bg-bronze/5 transition-all duration-200 mb-5"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {t('account.googleSignIn', 'Continue with Google')}
                  </a>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-bronze/15" />
                    <span className="text-[11px] uppercase tracking-[0.15em] text-taupe/50">
                      {t('account.orEmail', 'or')}
                    </span>
                    <div className="flex-1 h-px bg-bronze/15" />
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-5">
                    {(loginFetcher.data as any)?.error && (
                      <div role="alert" className="p-3 text-[12px] text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
                        {(loginFetcher.data as any).error}
                      </div>
                    )}
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="signin-email"
                        className="block text-[12px] uppercase tracking-[0.1em] text-taupe mb-2"
                      >
                        {t('account.email', 'Email')} *
                      </label>
                      <input
                        ref={firstInputRef}
                        type="email"
                        id="signin-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t(
                          'account.emailPlaceholder',
                          'your@email.com',
                        )}
                        required
                        className="w-full bg-surface border border-bronze/20 rounded-lg px-4 py-3.5 text-warm placeholder-taupe/50 focus:border-bronze focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="signin-password"
                        className="block text-[12px] uppercase tracking-[0.1em] text-taupe mb-2"
                      >
                        {t('account.password', 'Password')} *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="signin-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder={t(
                            'account.passwordPlaceholder',
                            '••••••••',
                          )}
                          required
                          className="w-full bg-surface border border-bronze/20 rounded-lg px-4 py-3.5 pr-12 text-warm placeholder-taupe/50 focus:border-bronze focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-warm transition-colors"
                          aria-label={
                            showPassword
                              ? t('account.hidePassword')
                              : t('account.showPassword')
                          }
                        >
                          {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                    <Link
                      to="/account/recover"
                      className="text-sm text-taupe hover:text-bronze transition-colors underline underline-offset-4"
                        onClick={handleClose}
                      >
                        {t('account.forgotPassword', 'Forgot your password?')}
                      </Link>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loginFetcher.state === 'submitting'}
                      className="w-full bg-bronze hover:bg-bronze-dark text-white font-medium py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loginFetcher.state === 'submitting' ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {t('account.signInButton', 'Sign In')}
                          <Icons.ArrowRight />
                        </>
                      )}
                    </button>
                  </form>

                </motion.div>

                {/* Create Account Section */}
                <motion.div
                  initial={{opacity: 0, x: 20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: 0.2}}
                  className={
                    activeTab === 'create' ? 'block' : 'hidden md:block'
                  }
                >
                  <h3 className="font-serif text-xl text-warm mb-6">
                    {t('account.create', 'Create Account')}
                  </h3>

                  <p className="text-taupe text-sm mb-6 leading-relaxed">
                    {t(
                      'account.createDescription',
                      'Create an account to enjoy exclusive benefits and a personalized shopping experience.',
                    )}
                  </p>

                  {/* Google SSO — fast path */}
                  <a
                    href={prefixPath('/account/google')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-bronze/20 rounded-lg text-warm text-sm hover:border-bronze/40 hover:bg-bronze/5 transition-all duration-200 mb-5"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {t('account.googleSignUp', 'Sign up with Google')}
                  </a>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-bronze/15" />
                    <span className="text-[11px] uppercase tracking-[0.15em] text-taupe/50">
                      {t('account.orEmail', 'or')}
                    </span>
                    <div className="flex-1 h-px bg-bronze/15" />
                  </div>

                  <form onSubmit={handleCreateAccount} className="space-y-5">
                    {(registerFetcher.data as any)?.error && (
                      <div role="alert" className="p-3 text-[12px] text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg text-center">
                        {(registerFetcher.data as any).error}
                      </div>
                    )}
                    {(registerFetcher.data as any)?.success && (
                      <div className="p-3 text-[12px] text-[#a87441] bg-[#a87441]/10 border border-[#a87441]/20 rounded-lg text-center">
                        {(registerFetcher.data as any).success}
                      </div>
                    )}
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="create-email"
                        className="block text-[12px] uppercase tracking-[0.1em] text-taupe mb-2"
                      >
                        {t('account.email', 'Email')} *
                      </label>
                      <input
                        type="email"
                        id="create-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t(
                          'account.emailPlaceholder',
                          'your@email.com',
                        )}
                        required
                        className="w-full bg-surface border border-bronze/20 rounded-lg px-4 py-3.5 text-warm placeholder-taupe/50 focus:border-bronze focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        htmlFor="create-password"
                        className="block text-[12px] uppercase tracking-[0.1em] text-taupe mb-2"
                      >
                        {t('account.password', 'Password')} *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="create-password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder={t(
                            'account.passwordPlaceholder',
                            '••••••••',
                          )}
                          required
                          minLength={8}
                          className="w-full bg-surface border border-bronze/20 rounded-lg px-4 py-3.5 pr-12 text-warm placeholder-taupe/50 focus:border-bronze focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-warm transition-colors"
                          aria-label={
                            showPassword
                              ? t('account.hidePassword')
                              : t('account.showPassword')
                          }
                        >
                          {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                        </button>
                      </div>
                      <p className="text-taupe/60 text-xs mt-2">
                        {t(
                          'account.passwordHint',
                          'Must be at least 8 characters',
                        )}
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={registerFetcher.state === 'submitting'}
                        className="w-full bg-transparent border border-bronze text-bronze hover:bg-bronze hover:text-white font-medium py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {registerFetcher.state === 'submitting' ? (
                      <div className="w-5 h-5 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {t('account.createButton', 'Create Account')}
                          <Icons.ArrowRight />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Benefits */}
                  <div className="mt-8 pt-8 border-t border-bronze/20">
                    <h4 className="text-[11px] uppercase tracking-[0.2em] text-taupe mb-4">
                      {t('account.benefits', 'Member Benefits')}
                    </h4>
                    <ul className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <motion.li
                          key={index}
                          initial={{opacity: 0, x: -10}}
                          animate={{opacity: 1, x: 0}}
                          transition={{delay: 0.3 + index * 0.1}}
                          className="flex items-center gap-3 text-warm text-sm"
                        >
                  <span className="text-bronze">{benefit.icon}</span>
                          <span>{benefit.text}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AccountOverlay;
