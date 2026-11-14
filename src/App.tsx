import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';
import { AgeGate } from '@/components/AgeGate';
import { CookieConsent } from '@/components/CookieConsent';
import { Layout } from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';

// Every page except the landing page is loaded on demand to keep the first load small.
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const EnquiryForm = lazy(() => import('@/pages/EnquiryForm'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));

function ErrorFallback({ error }: { error: unknown }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] text-center">
      <div>
        <h1 className="mb-4 text-2xl font-bold text-red-400">Something went wrong</h1>
        <p className="mb-4 text-muted-foreground">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AgeGate>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:slug" element={<ProductDetailPage />} />
              <Route path="enquiry" element={<EnquiryForm />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-service" element={<TermsOfService />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <CookieConsent />
        </BrowserRouter>
        <Toaster theme="dark" />
      </AgeGate>
    </ErrorBoundary>
  );
}
