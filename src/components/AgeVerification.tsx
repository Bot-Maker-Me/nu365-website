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
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md"
            style={{ 
              position: 'relative', 
              margin: 'auto'
            }}
          >
            <div className="glass-card rounded-2xl p-8 border border-primary/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-heading mb-2">Age Verification Required</h2>
                <p className="text-muted-foreground">
                  You must be 18 years or older to access this website.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => handleVerify(true)}
                  className="w-full h-12 gradient-bg text-white border-transparent"
                >
                  I am 18 or older
                </Button>
                <Button
                  onClick={() => handleVerify(false)}
                  variant="outline"
                  className="w-full h-12 border-[#1F1F2E] hover:bg-[#1F1F2E]"
                >
                  I am under 18
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                By entering, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
