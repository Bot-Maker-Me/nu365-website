import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthContextType = {
  session: any | null;
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Placeholder implementation
    return { error: 'Authentication not configured' };
  };

  const signOut = async () => {
    // Placeholder implementation
  };

  return (
    <AuthContext.Provider value={{ session, user: null, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
