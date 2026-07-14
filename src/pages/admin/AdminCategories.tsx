import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { toSlug } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export default function AdminCategories() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { load(); }, []);
  const load = () => supabase.from('categories').select('*').order('name').then(({ data }) => setItems(data ?? []));

  async function add() {
    if (!name.trim()) return;
    const { error } = await supabase.from('categories').insert({ name: name.trim(), slug: toSlug(name), description: description || null });
    if (error) toast.error(error.message); else { setName(''); setDescription(''); load(); }
  }
  async function remove(id: string) {
    if (!confirm('Delete this category?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast.error(error.message); else load();
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl mb-6">Categories</h1>
      <div className="card-surface p-5 mb-6 space-y-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="w-full border border-input rounded-lg px-3 py-2" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (optional)" className="w-full border border-input rounded-lg px-3 py-2" />
        <button onClick={add} className="btn-primary">Add category</button>
      </div>
      <div className="card-surface divide-y divide-border">
        {items.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between">
            <div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">/{c.slug}</p></div>
            <button onClick={() => remove(c.id)} className="text-destructive p-2 hover:bg-muted rounded"><Trash2 size={16} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No categories yet.</p>}
      </div>
    </div>
  );
}
