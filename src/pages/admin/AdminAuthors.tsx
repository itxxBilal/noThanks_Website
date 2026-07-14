import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { toSlug } from '@/lib/utils';

export default function AdminAuthors() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', bio: '', avatar_url: '' });
  useEffect(() => { load(); }, []);
  const load = () => supabase.from('authors').select('*').order('name').then(({ data }) => setItems(data ?? []));
  async function add() {
    if (!form.name.trim()) return;
    const { error } = await supabase.from('authors').insert({ ...form, slug: toSlug(form.name) });
    if (error) toast.error(error.message); else { setForm({ name: '', bio: '', avatar_url: '' }); load(); }
  }
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl mb-6">Authors</h1>
      <div className="card-surface p-5 mb-6 space-y-2">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full border border-input rounded-lg px-3 py-2" />
        <input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="Avatar URL" className="w-full border border-input rounded-lg px-3 py-2" />
        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" rows={3} className="w-full border border-input rounded-lg px-3 py-2" />
        <button onClick={add} className="btn-primary">Add author</button>
      </div>
      <div className="card-surface divide-y divide-border">
        {items.map((a) => (
          <div key={a.id} className="p-4 flex items-center gap-3">
            {a.avatar_url && <img src={a.avatar_url} className="w-10 h-10 rounded-full object-cover" alt="" />}
            <div><p className="font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{a.bio}</p></div>
          </div>
        ))}
        {items.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No authors yet.</p>}
      </div>
    </div>
  );
}
