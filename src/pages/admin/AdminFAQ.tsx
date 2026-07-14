import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

export default function AdminFAQ() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ question: '', answer: '', category: '' });
  useEffect(() => { load(); }, []);
  const load = () => supabase.from('faqs').select('*').order('display_order').then(({ data }) => setItems(data ?? []));
  async function add() {
    if (!form.question.trim()) return;
    const { error } = await supabase.from('faqs').insert({ ...form, category: form.category || null });
    if (error) toast.error(error.message); else { setForm({ question: '', answer: '', category: '' }); load(); }
  }
  async function remove(id: string) {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) toast.error(error.message); else load();
  }
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl mb-6">FAQs</h1>
      <div className="card-surface p-5 mb-6 space-y-2">
        <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" className="w-full border border-input rounded-lg px-3 py-2" />
        <textarea rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer" className="w-full border border-input rounded-lg px-3 py-2" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (optional)" className="w-full border border-input rounded-lg px-3 py-2" />
        <button onClick={add} className="btn-primary">Add FAQ</button>
      </div>
      <div className="space-y-2">
        {items.map((f) => (
          <div key={f.id} className="card-surface p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1"><p className="font-medium">{f.question}</p><p className="text-sm text-muted-foreground mt-1">{f.answer}</p></div>
              <button onClick={() => remove(f.id)} className="text-destructive p-2 hover:bg-muted rounded"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
