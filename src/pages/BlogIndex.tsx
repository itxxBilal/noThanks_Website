import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { supabase } from '@/integrations/supabase/client';
import { PostCard } from '@/pages/Home';
import { Search } from 'lucide-react';

interface Post { id: string; slug: string; title: string; excerpt: string | null; featured_image: string | null; published_at: string | null; reading_time: number; category_id: string | null; }
interface Category { id: string; slug: string; name: string; }

export default function BlogIndex() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = params.get('category') ?? '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(q);

  useEffect(() => { supabase.from('categories').select('id,slug,name').order('name').then(({ data }) => setCats(data ?? [])); }, []);

  useEffect(() => {
    setLoading(true);
    let req = supabase.from('posts')
      .select('id,slug,title,excerpt,featured_image,published_at,reading_time,category_id')
      .eq('status', 'published').order('published_at', { ascending: false });
    if (q) req = req.ilike('title', `%${q}%`);
    if (cat) {
      const c = cats.find((x) => x.slug === cat);
      if (c) req = req.eq('category_id', c.id);
    }
    req.then(({ data }) => { setPosts(data ?? []); setLoading(false); });
  }, [q, cat, cats]);

  const featured = useMemo(() => posts[0], [posts]);
  const rest = useMemo(() => posts.slice(1), [posts]);

  return (
    <>
      <SEO title="Blog — Consumer Guides & Product Insights | NoThanks" canonical="/blog"
        description="Read the latest guides, product breakdowns, and consumer education articles from the NoThanks editorial team." />
      <div className="container-wide py-14">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
        <div className="mt-4 mb-10 max-w-3xl">
          <h1 className="text-5xl mb-3">The NoThanks Blog</h1>
          <p className="text-muted-foreground text-lg">Guides, product insights, and consumer education — updated regularly.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); const p = new URLSearchParams(params); if (query) p.set('q', query); else p.delete('q'); setParams(p); }}
          className="flex gap-3 mb-6 max-w-xl">
          <div className="flex-1 flex items-center gap-2 rounded-full border border-input bg-background px-4">
            <Search size={16} className="text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles…"
              className="flex-1 py-2.5 bg-transparent focus:outline-none text-sm" />
          </div>
          <button className="btn-primary">Search</button>
        </form>

        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => { const p = new URLSearchParams(params); p.delete('category'); setParams(p); }}
            className={`chip ${!cat ? 'bg-primary text-primary-foreground' : ''}`}>All</button>
          {cats.map((c) => (
            <button key={c.id} onClick={() => { const p = new URLSearchParams(params); p.set('category', c.slug); setParams(p); }}
              className={`chip ${cat === c.slug ? 'bg-primary text-primary-foreground' : ''}`}>{c.name}</button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <div className="card-surface p-12 text-center text-muted-foreground">No articles found.</div>
        ) : (
          <>
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="card-surface overflow-hidden grid md:grid-cols-2 mb-10 group">
                <div className="aspect-[16/10] md:aspect-auto bg-muted">
                  {featured.featured_image && <img src={featured.featured_image} alt={featured.title} className="w-full h-full object-cover" />}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="chip mb-3 w-fit">Featured</span>
                  <h2 className="text-3xl mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                  <p className="text-muted-foreground line-clamp-3">{featured.excerpt}</p>
                </div>
              </Link>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
