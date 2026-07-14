import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { session, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (session) return <Navigate to="/admin" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav('/admin');
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + '/admin' },
        });
        if (error) throw error;
        toast.success('Account created. Check your email if confirmation is required.');
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Authentication failed');
    } finally { setLoading(false); }
  }

  return (
    <>
      <SEO title="Sign in — Admin | NoThanks" noindex canonical="/login" />
      <div className="container-narrow py-20 max-w-md">
        <h1 className="text-4xl mb-2">{mode === 'signin' ? 'Editor sign in' : 'Create account'}</h1>
        <p className="text-muted-foreground mb-8">Access the NoThanks admin dashboard.</p>
        <form onSubmit={submit} className="card-surface p-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-input rounded-lg px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-input rounded-lg px-3 py-2" />
          </label>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-sm text-muted-foreground hover:text-foreground mt-4">
          {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </>
  );
}
