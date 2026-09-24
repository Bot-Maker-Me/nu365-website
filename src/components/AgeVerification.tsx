import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AgeVerification() {
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if user has already verified age
    const verified = localStorage.getItem('ageVerified');
    if (!verified) {
      setShowModal(true);
    } else {
      setIsVerified(true);
    }
  }, []);

  const handleVerify = (isOver18: boolean) => {
    if (isOver18) {
      localStorage.setItem('ageVerified', 'true');
      setIsVerified(true);
      setShowModal(false);
    } else {
      // Redirect to a different page or show access denied
      window.location.href = 'https://www.google.com';
    }
  };

  if (!mounted || isVerified) return null;

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
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Shield style={{ width: '32px', height: '32px', color: 'white' }} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Age Verification Required</h2>
                <p style={{ color: '#a1a1aa' }}>
                  You must be 18 years or older to access this website.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Button
                  onClick={() => handleVerify(true)}
                  style={{ 
                    width: '100%', 
                    height: '48px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  I am 18 or older
                </Button>
                <Button
                  onClick={() => handleVerify(false)}
                  variant="outline"
                  style={{ width: '100%', height: '48px', borderColor: '#1F1F2E' }}
                >
                  I am under 18
                </Button>
              </div>

              <p style={{ fontSize: '12px', color: '#a1a1aa', textAlign: 'center', marginTop: '24px' }}>
                By entering, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
