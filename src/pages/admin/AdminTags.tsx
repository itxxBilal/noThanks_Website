import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { toSlug } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export default function AdminTags() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  useEffect(() => { load(); }, []);
  const load = () => supabase.from('tags').select('*').order('name').then(({ data }) => setItems(data ?? []));
  async function add() {
    if (!name.trim()) return;
    const { error } = await supabase.from('tags').insert({ name: name.trim(), slug: toSlug(name) });
    if (error) toast.error(error.message); else { setName(''); load(); }
  }
  async function remove(id: string) {
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) toast.error(error.message); else load();
  }
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl mb-6">Tags</h1>
      <div className="flex gap-2 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name"
          className="flex-1 border border-input rounded-lg px-3 py-2" />
        <button onClick={add} className="btn-primary">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((t) => (
          <span key={t.id} className="chip">
            {t.name}
            <button onClick={() => remove(t.id)} className="ml-2 text-destructive"><Trash2 size={12} /></button>
          </span>
        ))}
      </div>
    </div>
  );
}
