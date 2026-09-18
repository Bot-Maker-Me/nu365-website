import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const { signIn, session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md px-6"
      >
        <div className="glass rounded-2xl p-8 border border-[#1F1F2E]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-4">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading tracking-tight">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Sign in to manage your product catalog
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nu365.com"
                  required
                  className="pl-10 h-11 bg-secondary/20 border-[#1F1F2E]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 h-11 bg-secondary/20 border-[#1F1F2E]"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-11 gradient-bg text-white rounded-xl font-medium relative overflow-hidden disabled:opacity-50"
            >
              <span className="absolute inset-0 shimmer" />
              <span className="relative z-10">
                {submitting ? 'Signing in...' : 'Sign In'}
              </span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
