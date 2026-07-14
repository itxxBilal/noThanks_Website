import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';

const schema = z.object({ email: z.string().trim().email().max(254) });

export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) { toast.error('Please enter a valid email.'); return; }
    setLoading(true);
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: parsed.data.email, source: window.location.pathname,
    });
    setLoading(false);
    if (error && !error.message.includes('duplicate')) toast.error('Something went wrong.');
    else { toast.success('Subscribed. Welcome aboard!'); setEmail(''); }
  }

  return (
    <div className={compact ? '' : 'card-surface p-8 sm:p-10'}>
      {!compact && (
        <>
          <h3 className="text-2xl sm:text-3xl mb-2">Stay in the know</h3>
          <p className="text-muted-foreground mb-6">Get new guides and product insights in your inbox. No spam, unsubscribe anytime.</p>
        </>
      )}
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
