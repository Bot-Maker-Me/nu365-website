import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type AuthContextType = {
  session: any | null;
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded admin credentials (in production, use proper auth system)
const ADMIN_CREDENTIALS = {
  email: 'piush80545@gmail.com',
  password: 'Piyush@112008'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const storedSession = localStorage.getItem('admin_session');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const sessionData = {
        email: email,
        timestamp: new Date().toISOString()
      };
      setSession(sessionData);
      localStorage.setItem('admin_session', JSON.stringify(sessionData));
      setLoading(false);
      return { error: null };
    } else {
      setLoading(false);
      return { error: 'Invalid email or password' };
    }
  };

  const signOut = async () => {
    setSession(null);
    localStorage.removeItem('admin_session');
  };

  return (
    <AuthContext.Provider value={{ session, user: session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
