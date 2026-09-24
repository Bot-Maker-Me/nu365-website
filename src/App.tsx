import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/context/CartContext';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CookieConsent } from '@/components/CookieConsent';
import { LandingPage } from '@/pages/LandingPage';
import { ErrorBoundary } from 'react-error-boundary';

const ShopPage = lazy(() => import('@/pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const AdminLogin = lazy(() => import('@/pages/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const Cart = lazy(() => import('@/pages/Cart').then((m) => ({ default: m.Cart })));
const Checkout = lazy(() => import('@/pages/Checkout').then((m) => ({ default: m.Checkout })));
const EnquiryForm = lazy(() => import('@/pages/EnquiryForm').then((m) => ({ default: m.EnquiryForm })));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('@/pages/TermsOfService').then((m) => ({ default: m.TermsOfService })));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorFallback({ error }: { error: unknown }) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary text-white"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Suspense fallback={<PageLoader />}>
                <LandingPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/shop"
          element={
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Suspense fallback={<PageLoader />}>
                <ShopPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Suspense fallback={<PageLoader />}>
                <ProductDetailPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<PageLoader />}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<PageLoader />}>
              <Checkout />
            </Suspense>
          }
        />
        <Route
          path="/enquiry"
          element={
            <Suspense fallback={<PageLoader />}>
              <EnquiryForm />
            </Suspense>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <Suspense fallback={<PageLoader />}>
              <TermsOfService />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/admin-login"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isAgeVerified, setIsAgeVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem('ageVerified');
    setIsAgeVerified(!!verified);
  }, []);

  const handleAgeVerification = (isOver18: boolean) => {
    if (isOver18) {
      localStorage.setItem('ageVerified', 'true');
      setIsAgeVerified(true);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  // Show age verification modal if not verified
  if (isAgeVerified === false) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999999,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '448px',
            padding: '16px'
          }}
        >
          <div style={{
            backgroundColor: 'rgba(18, 18, 26, 0.4)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(31, 31, 46, 0.6)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', fontFamily: 'Space Grotesk, Inter, sans-serif' }}>Age Verification Required</h2>
              <p style={{ color: '#a1a1aa' }}>
                You must be 18 years or older to access this website.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={() => handleAgeVerification(true)}
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                I am 18 or older
              </button>
              <button
                onClick={() => handleAgeVerification(false)}
                style={{
                  width: '100%',
                  height: '48px',
                  border: '1px solid #1F1F2E',
                  backgroundColor: 'transparent',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1F1F2E'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                I am under 18
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#a1a1aa', textAlign: 'center', marginTop: '24px' }}>
              By entering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // If not checked yet, show loading
  if (isAgeVerified === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If verified, render the full app
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <AnimatedRoutes />
            <CookieConsent />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
