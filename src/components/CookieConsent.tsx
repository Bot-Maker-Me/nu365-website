import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-6 border border-[#1F1F2E]">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Cookie Consent</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to improve your experience and analyze site traffic. 
                  By clicking "Accept", you agree to our use of cookies as described in our 
                  <a href="/privacy-policy" className="text-primary hover:underline ml-1">Privacy Policy</a>.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  size="sm"
                  className="border-[#1F1F2E] hover:bg-[#1F1F2E]"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAccept}
                  size="sm"
                  className="gradient-bg text-white border-transparent"
                >
                  Accept
                </Button>
              </div>

              <button
                onClick={() => setShowBanner(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
