import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type Role = 'admin' | 'editor' | 'user';

interface AuthCtx {
  session: Session | null;
  user: User | null;
  roles: Role[];
  isAdmin: boolean;
  isEditor: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  session: null, user: null, roles: [], isAdmin: false, isEditor: false, loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function applySession(nextSession: Session | null) {
      if (!mounted) return;

      setLoading(true);
      setSession(nextSession);

      if (nextSession?.user) {
        const nextRoles = await loadRoles(nextSession.user.id);
        if (mounted) setRoles(nextRoles);
      } else if (mounted) {
        setRoles([]);
      }

      if (mounted) setLoading(false);
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_e, nextSession) => {
      void applySession(nextSession);
    });

    supabase.auth.getSession().then(({ data }) => {
      void applySession(data.session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function loadRoles(userId: string) {
    const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId);
    if (error) {
      console.error('Failed to load user roles', error);
      return [];
    }
    return (data ?? []).map((r) => r.role as Role);
  }

  const value: AuthCtx = {
    session,
    user: session?.user ?? null,
    roles,
    isAdmin: roles.includes('admin'),
    isEditor: roles.includes('admin') || roles.includes('editor'),
    loading,
    signOut: async () => { await supabase.auth.signOut(); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
