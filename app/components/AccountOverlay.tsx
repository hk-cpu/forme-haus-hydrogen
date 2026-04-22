import {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link, useFetcher, useNavigate} from '@remix-run/react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Fetchers for auth actions
  const loginFetcher = useFetcher<{error?: string}>();
  const registerFetcher = useFetcher<{error?: string; success?: boolean}>();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const loginError = loginFetcher.data?.error;
  const registerError = registerFetcher.data?.error;
  const registerSuccess = registerFetcher.data?.success;

  const handleClose = () => {
    dispatch({type: 'CLOSE_LOGIN'});
    setEmail('');
    setLoginPassword('');
    setRegisterPassword('');
  };

  // Close overlay + navigate to /account on successful login.
  // A successful login action returns a redirect, which the fetcher
  // follows — data ends up as the /account loader data (no `error`).
  useEffect(() => {
    if (loginFetcher.state !== 'idle' || !loginFetcher.data) return;
    if (loginFetcher.data.error) return;
    handleClose();
    navigate(prefixPath('/account'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginFetcher.state, loginFetcher.data]);

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

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginFetcher.submit(
      {email, password: loginPassword},
      {method: 'post', action: prefixPath('/account/login')},
    );
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    registerFetcher.submit(
      {email, password: registerPassword},
      {method: 'post', action: prefixPath('/account/register')},
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

                  <form onSubmit={handleSignIn} className="space-y-5">
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

                    {/* Error */}
                    {loginError && (
                      <p
                        role="alert"
                        className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                      >
                        {loginError}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loginFetcher.state !== 'idle'}
                      className="w-full bg-bronze hover:bg-bronze-dark text-white font-medium py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loginFetcher.state !== 'idle' ? (
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

                  {registerSuccess ? (
                    <div
                      role="status"
                      className="space-y-3 rounded-lg border border-bronze/30 bg-bronze/10 p-5"
                    >
                      <p className="text-warm text-sm font-medium">
                        {t(
                          'account.registerSuccess',
                          'Account created. Check your email to verify and sign in.',
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('signin')}
                        className="text-bronze text-sm underline underline-offset-4 hover:text-bronze-dark transition-colors"
                      >
                        {t('account.goToSignIn', 'Go to sign in')}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateAccount} className="space-y-5">
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
                            onChange={(e) =>
                              setRegisterPassword(e.target.value)
                            }
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

                      {/* Error */}
                      {registerError && (
                        <p
                          role="alert"
                          className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                        >
                          {registerError}
                        </p>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={registerFetcher.state !== 'idle'}
                        className="w-full bg-transparent border border-bronze text-bronze hover:bg-bronze hover:text-white font-medium py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {registerFetcher.state !== 'idle' ? (
                          <div className="w-5 h-5 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            {t('account.createButton', 'Create Account')}
                            <Icons.ArrowRight />
                          </>
                        )}
                      </button>
                    </form>
                  )}

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
