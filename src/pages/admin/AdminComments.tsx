import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { Check, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminComments() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { load(); }, []);
  const load = () => supabase.from('comments').select('*, posts(title,slug)').order('created_at', { ascending: false }).then(({ data }) => setItems(data ?? []));

  async function approve(id: string) {
    const { error } = await supabase.from('comments').update({ approved: true }).eq('id', id);
    if (error) toast.error(error.message); else load();
  }
  async function remove(id: string) {
    if (!confirm('Delete comment?')) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) toast.error(error.message); else load();
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl mb-6">Comments</h1>
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="card-surface p-5">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>{c.author_name} on <em>{c.posts?.title ?? 'unknown post'}</em></span>
              <span>{formatDate(c.created_at)}</span>
            </div>
            <p className="mb-3">{c.content}</p>
            <div className="flex gap-2">
              {!c.approved && <button onClick={() => approve(c.id)} className="btn-outline !py-1.5"><Check size={14} /> Approve</button>}
              <button onClick={() => remove(c.id)} className="btn-outline !py-1.5 text-destructive"><Trash2 size={14} /> Delete</button>
              {c.approved && <span className="chip">Approved</span>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">No comments.</p>}
      </div>
    </div>
  );
}
