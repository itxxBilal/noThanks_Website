import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';
import { Download } from 'lucide-react';

export default function AdminNewsletter() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems(data ?? [])); }, []);

  function exportCsv() {
    const rows = [['email', 'source', 'created_at'], ...items.map((i) => [i.email, i.source ?? '', i.created_at])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Newsletter</h1>
        <button onClick={exportCsv} className="btn-outline"><Download size={14} /> Export CSV</button>
      </div>
      <div className="card-surface divide-y divide-border">
        {items.map((s) => (
          <div key={s.id} className="p-4 flex justify-between text-sm">
            <span>{s.email}</span>
            <span className="text-muted-foreground">{formatDate(s.created_at)}</span>
          </div>
        ))}
        {items.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No subscribers yet.</p>}
      </div>
    </div>
  );
}
