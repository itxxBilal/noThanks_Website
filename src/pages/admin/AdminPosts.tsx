import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { Plus, Trash2, Edit } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');

  useEffect(() => { load(); }, [filter]);
  async function load() {
    let q = supabase.from('posts').select('id,title,slug,status,published_at,updated_at,featured').order('updated_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    setPosts(data ?? []);
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Deleted'); load(); }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Posts</h1>
        <Link to="/admin/posts/new" className="btn-primary"><Plus size={16} /> New post</Link>
      </div>
      <div className="flex gap-2 mb-4">
        {(['all', 'published', 'draft', 'scheduled'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`chip capitalize ${filter === f ? 'bg-primary text-primary-foreground' : ''}`}>{f}</button>
        ))}
      </div>
      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr><th className="p-3">Title</th><th className="p-3">Status</th><th className="p-3">Updated</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <Link to={`/admin/posts/${p.id}`} className="hover:text-primary">{p.title || '(untitled)'}</Link>
                  {p.featured && <span className="ml-2 chip">Featured</span>}
                </td>
                <td className="p-3 capitalize">{p.status}</td>
                <td className="p-3 text-muted-foreground">{formatDate(p.updated_at)}</td>
                <td className="p-3 flex gap-1">
                  <Link to={`/admin/posts/${p.id}`} className="p-2 hover:bg-muted rounded"><Edit size={14} /></Link>
                  <button onClick={() => remove(p.id)} className="p-2 hover:bg-muted rounded text-destructive"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No posts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
