import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { formatDate } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export default function AdminInbox() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { load(); }, []);
  const load = () => supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems(data ?? []));

  async function toggleRead(id: string, read: boolean) {
    await supabase.from('contact_messages').update({ read: !read }).eq('id', id); load();
  }
  async function remove(id: string) {
    if (!confirm('Delete message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) toast.error(error.message); else load();
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl mb-6">Inbox</h1>
      <div className="space-y-3">
        {items.map((m) => (
          <div key={m.id} className={`card-surface p-5 ${m.read ? 'opacity-70' : ''}`}>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span><strong className="text-foreground">{m.name}</strong> · {m.email}</span>
              <span>{formatDate(m.created_at)}</span>
            </div>
            {m.subject && <p className="font-medium mb-1">{m.subject}</p>}
            <p className="whitespace-pre-line text-sm">{m.message}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => toggleRead(m.id, m.read)} className="btn-outline !py-1.5">{m.read ? 'Mark unread' : 'Mark read'}</button>
              <button onClick={() => remove(m.id)} className="btn-outline !py-1.5 text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">No messages.</p>}
      </div>
    </div>
  );
}
