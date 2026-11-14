import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'cookieConsent';

/** Bottom banner asking for cookie consent. The answer is remembered in localStorage. */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  // First-time visitors see the banner after a short delay.
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const answer = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(STORAGE_KEY, choice);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed inset-x-0 bottom-0 z-50 p-4"
        >
          <div className="glass-card relative mx-auto flex max-w-4xl flex-col items-start gap-4 rounded-2xl border border-[#1F1F2E] p-6 md:flex-row md:items-center">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Cookie className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="mb-1 font-semibold">Cookie Consent</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to improve your experience and analyze site traffic. By clicking "Accept", you agree to
                our use of cookies as described in our
                <Link to="/privacy-policy" className="ml-1 text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <Button onClick={() => answer('declined')} variant="outline" size="sm" className="border-[#1F1F2E] hover:bg-[#1F1F2E]">
                Decline
              </Button>
              <Button onClick={() => answer('accepted')} size="sm" className="gradient-bg border-transparent text-white">
                Accept
              </Button>
            </div>

            <button
              onClick={() => setShow(false)}
              aria-label="Dismiss"
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
