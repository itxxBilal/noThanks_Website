import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { toSlug, estimateReadingTime } from '@/lib/utils';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MediaUpload from '@/components/MediaUpload';


const empty = {
  title: '', slug: '', seo_title: '', meta_description: '', focus_keyword: '',
  canonical_url: '', featured_image: '', image_alt: '', excerpt: '', content: '',
  og_image: '', twitter_image: '', robots_index: true,
  status: 'draft', featured: false, sticky: false,
  author_id: null as string | null, category_id: null as string | null,
  scheduled_at: null as string | null, published_at: null as string | null,
  faq: [] as { question: string; answer: string }[],
};

export default function AdminPostEditor() {
  const { id } = useParams();
  const isNew = !id;
  const nav = useNavigate();

  const [p, setP] = useState<any>(empty);
  const [cats, setCats] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [tab, setTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('id,name').order('name').then(({ data }) => setCats(data ?? []));
    supabase.from('authors').select('id,name').order('name').then(({ data }) => setAuthors(data ?? []));
    if (!isNew) supabase.from('posts').select('*').eq('id', id).maybeSingle().then(({ data }) => data && setP(data));
  }, [id]);

  function set<K extends keyof typeof empty>(k: K, v: any) { setP((prev: any) => ({ ...prev, [k]: v })); }

  async function save(publish?: boolean) {
    const payload = { ...p };
    if (!payload.slug && payload.title) payload.slug = toSlug(payload.title);
    payload.reading_time = estimateReadingTime(payload.content || '');
    if (publish) { payload.status = 'published'; payload.published_at = payload.published_at ?? new Date().toISOString(); }

    if (isNew) {
      const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
      if (error) return toast.error(error.message);
      toast.success('Created');
      nav(`/admin/posts/${data.id}`, { replace: true });
    } else {
      const { error } = await supabase.from('posts').update(payload).eq('id', id);
      if (error) return toast.error(error.message);
      toast.success('Saved');
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <Link to="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"><ArrowLeft size={14} /> Back</Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl">{isNew ? 'New post' : 'Edit post'}</h1>
        <div className="flex gap-2">
          <button onClick={() => setPreview((v) => !v)} className="btn-outline"><Eye size={14} /> {preview ? 'Edit' : 'Preview'}</button>
          <button onClick={() => save(false)} className="btn-secondary"><Save size={14} /> Save draft</button>
          <button onClick={() => save(true)} className="btn-primary">Publish</button>
        </div>
      </div>

      <input value={p.title} onChange={(e) => set('title', e.target.value)} placeholder="Post title"
        className="w-full text-4xl font-serif bg-transparent border-b border-border pb-3 mb-6 focus:outline-none focus:border-primary" />

      <div className="flex gap-2 border-b border-border mb-6 text-sm">
        {(['content', 'seo', 'settings'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 -mb-px border-b-2 capitalize ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>{t}</button>
        ))}
      </div>

      {tab === 'content' && (
        <div className="grid gap-4">
          <Field label="Excerpt"><textarea rows={2} value={p.excerpt ?? ''} onChange={(e) => set('excerpt', e.target.value)} className="input" /></Field>
          {preview ? (
            <div className="prose prose-lg max-w-none card-surface p-6"><ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown></div>
          ) : (
            <Field label="Content (Markdown)"><textarea rows={20} value={p.content} onChange={(e) => set('content', e.target.value)} className="input font-mono text-sm" /></Field>
          )}
          <FaqEditor value={p.faq ?? []} onChange={(v) => set('faq', v)} />
        </div>
      )}

      {tab === 'seo' && (
        <div className="grid gap-4">
          <Field label="SEO title (defaults to post title)"><input value={p.seo_title ?? ''} onChange={(e) => set('seo_title', e.target.value)} className="input" /></Field>
          <Field label="Meta description"><textarea rows={2} value={p.meta_description ?? ''} onChange={(e) => set('meta_description', e.target.value)} className="input" /></Field>
          <Field label="Focus keyword"><input value={p.focus_keyword ?? ''} onChange={(e) => set('focus_keyword', e.target.value)} className="input" /></Field>
          <Field label="Canonical URL"><input value={p.canonical_url ?? ''} onChange={(e) => set('canonical_url', e.target.value)} className="input" /></Field>
          <Field label="Slug"><input value={p.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated from title" className="input" /></Field>
          <Field label="Featured / cover image"><MediaUpload value={p.featured_image ?? ''} onChange={(v) => set('featured_image', v)} accept="image" label="Upload cover" /></Field>
          <Field label="Image alt text"><input value={p.image_alt ?? ''} onChange={(e) => set('image_alt', e.target.value)} className="input" /></Field>
          <Field label="Open Graph image (social share)"><MediaUpload value={p.og_image ?? ''} onChange={(v) => set('og_image', v)} accept="image" label="Upload OG image" /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.robots_index} onChange={(e) => set('robots_index', e.target.checked)} /> Allow search engines to index</label>
        </div>
      )}

      {tab === 'settings' && (
        <div className="grid gap-4 max-w-md">
          <Field label="Category">
            <select value={p.category_id ?? ''} onChange={(e) => set('category_id', e.target.value || null)} className="input">
              <option value="">— none —</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Author">
            <select value={p.author_id ?? ''} onChange={(e) => set('author_id', e.target.value || null)} className="input">
              <option value="">— none —</option>
              {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={p.status} onChange={(e) => set('status', e.target.value)} className="input">
              <option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option>
            </select>
          </Field>
          {p.status === 'scheduled' && (
            <Field label="Scheduled for"><input type="datetime-local" value={p.scheduled_at ? p.scheduled_at.slice(0, 16) : ''}
              onChange={(e) => set('scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : null)} className="input" /></Field>
          )}
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.sticky} onChange={(e) => set('sticky', e.target.checked)} /> Sticky</label>
        </div>
      )}

      <style>{`.input { width:100%;border:1px solid hsl(var(--input));border-radius:.75rem;padding:.55rem .8rem;background:hsl(var(--background));font-size:.9rem;} .input:focus{outline:none;box-shadow:0 0 0 2px hsl(var(--ring));}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-medium mb-1.5">{label}</span>{children}</label>;
}

function FaqEditor({ value, onChange }: { value: { question: string; answer: string }[]; onChange: (v: any) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">FAQ block</span>
        <button type="button" onClick={() => onChange([...value, { question: '', answer: '' }])} className="text-xs link-underline">+ add</button>
      </div>
      <div className="space-y-2">
        {value.map((f, i) => (
          <div key={i} className="card-surface p-4 space-y-2">
            <input value={f.question} onChange={(e) => { const c = [...value]; c[i] = { ...c[i], question: e.target.value }; onChange(c); }}
              placeholder="Question" className="input" />
            <textarea rows={2} value={f.answer} onChange={(e) => { const c = [...value]; c[i] = { ...c[i], answer: e.target.value }; onChange(c); }}
              placeholder="Answer" className="input" />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-xs text-destructive">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
