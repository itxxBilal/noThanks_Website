import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { supabase } from '@/integrations/supabase/client';
import { PostCard } from '@/pages/Home';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [cat, setCat] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: c } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle();
      setCat(c);
      if (c) {
        const { data: p } = await supabase.from('posts')
          .select('id,slug,title,excerpt,featured_image,published_at,reading_time')
          .eq('status', 'published').eq('category_id', c.id).order('published_at', { ascending: false });
        setPosts(p ?? []);
      }
    })();
  }, [slug]);

  if (!cat) return <div className="container-narrow py-20 text-muted-foreground">Loading…</div>;

  return (
    <>
      <SEO title={cat.seo_title ?? `${cat.name} — Guides & Articles | NoThanks`}
        description={cat.meta_description ?? cat.description ?? undefined}
        canonical={`/category/${cat.slug}`} />
      <div className="container-wide py-14">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: cat.name }]} />
        <div className="mt-4 mb-10 max-w-2xl">
          <span className="chip mb-3">Category</span>
          <h1 className="text-5xl mb-3">{cat.name}</h1>
          {cat.description && <p className="text-lg text-muted-foreground">{cat.description}</p>}
        </div>
        {posts.length === 0
          ? <div className="card-surface p-10 text-center text-muted-foreground">No articles in this category yet.</div>
          : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>}
      </div>
    </>
  );
}
