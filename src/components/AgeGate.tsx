import { useState, type ReactNode } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'ageVerified';

function isVerified() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/** Blocks the whole site until the visitor confirms they are 18+. */
export function AgeGate({ children }: { children: ReactNode }) {
  const [verified, setVerified] = useState(isVerified);

  if (verified) return <>{children}</>;

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* private mode — the gate will simply show again next visit */
    }
    setVerified(true);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/95 p-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-2xl border border-primary/20 p-8">
        <div className="mb-6 text-center">
          <div className="gradient-bg mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mb-2 font-heading text-2xl font-bold">Age Verification Required</h2>
          <p className="text-muted-foreground">You must be 18 years or older to access this website.</p>
        </div>

        <div className="space-y-4">
          <Button onClick={confirm} className="gradient-bg h-12 w-full border-transparent text-white">
            I am 18 or older
          </Button>
          <Button
            onClick={() => window.location.assign('https://www.google.com')}
            variant="outline"
            className="h-12 w-full border-[#1F1F2E] hover:bg-[#1F1F2E]"
          >
            I am under 18
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By entering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
