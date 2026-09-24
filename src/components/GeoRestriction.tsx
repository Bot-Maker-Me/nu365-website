import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Allowed countries (ISO country codes)
const ALLOWED_COUNTRIES = ['EG', 'US', 'GB', 'CA', 'AU', 'DE', 'FR']; // Egypt, US, UK, Canada, Australia, Germany, France

export function GeoRestriction() {
  const [showModal, setShowModal] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        // Check if user has already been verified
        const locationVerified = localStorage.getItem('locationVerified');
        if (locationVerified) {
          setIsAllowed(true);
          return;
        }

        // Get user's location using IP geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        setCountryCode(data.country_code);
        
        if (data.country_code && !ALLOWED_COUNTRIES.includes(data.country_code)) {
          setIsAllowed(false);
          setShowModal(true);
        } else {
          localStorage.setItem('locationVerified', 'true');
        }
      } catch (error) {
        console.error('Location check failed:', error);
        // If location check fails, allow access (fail-safe)
        setIsAllowed(true);
      }
    };

    checkLocation();
  }, []);

  const handleContinue = () => {
    localStorage.setItem('locationVerified', 'true');
    setShowModal(false);
  };

  if (isAllowed) return null;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md"
            style={{ position: 'relative', margin: 'auto' }}
          >
            <div className="glass-card rounded-2xl p-8 border border-red-500/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold font-heading mb-2 text-red-400">Location Restricted</h2>
                <p className="text-muted-foreground">
                  This service is not available in your region ({countryCode}).
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-300">
                  Due to regulatory restrictions, we can only provide services to certain countries. 
                  If you believe this is an error, please contact our support team.
                </p>
              </div>

              <Button
                onClick={handleContinue}
                variant="outline"
                className="w-full h-12 border-[#1F1F2E] hover:bg-[#1F1F2E]"
              >
                I understand, continue anyway
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By continuing, you acknowledge that you understand the regional restrictions.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
