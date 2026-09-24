import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Allowed countries (ISO country codes)
const ALLOWED_COUNTRIES = ['EG', 'US', 'GB', 'CA', 'AU', 'DE', 'FR']; // Egypt, US, UK, Canada, Australia, Germany, France

export function GeoRestriction() {
  const [showModal, setShowModal] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || isAllowed) return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '20px'
      }}
    >
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '448px',
              margin: 'auto'
            }}
          >
            <div style={{
              backgroundColor: 'rgba(30, 30, 46, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <AlertTriangle style={{ width: '32px', height: '32px', color: '#f87171' }} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#f87171' }}>Location Restricted</h2>
                <p style={{ color: '#a1a1aa' }}>
                  This service is not available in your region ({countryCode}).
                </p>
              </div>

              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <p style={{ fontSize: '14px', color: '#fca5a5' }}>
                  Due to regulatory restrictions, we can only provide services to certain countries. 
                  If you believe this is an error, please contact our support team.
                </p>
              </div>

              <Button
                onClick={handleContinue}
                variant="outline"
                style={{ width: '100%', height: '48px', borderColor: '#1F1F2E' }}
              >
                I understand, continue anyway
              </Button>

              <p style={{ fontSize: '12px', color: '#a1a1aa', textAlign: 'center', marginTop: '16px' }}>
                By continuing, you acknowledge that you understand the regional restrictions.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
