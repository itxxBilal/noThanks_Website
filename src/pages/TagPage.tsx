import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { supabase } from '@/integrations/supabase/client';
import { PostCard } from '@/pages/Home';

export default function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const [tag, setTag] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: t } = await supabase.from('tags').select('*').eq('slug', slug).maybeSingle();
      setTag(t);
      if (t) {
        const { data: pt } = await supabase.from('post_tags').select('post_id').eq('tag_id', t.id);
        const ids = (pt ?? []).map((r) => r.post_id);
        if (ids.length) {
          const { data: p } = await supabase.from('posts')
            .select('id,slug,title,excerpt,featured_image,published_at,reading_time')
            .in('id', ids).eq('status', 'published').order('published_at', { ascending: false });
          setPosts(p ?? []);
        }
      }
    })();
  }, [slug]);

  if (!tag) return <div className="container-narrow py-20 text-muted-foreground">Loading…</div>;
  return (
    <>
      <SEO title={`#${tag.name} — Articles | NoThanks`} canonical={`/tag/${tag.slug}`} />
      <div className="container-wide py-14">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: `#${tag.name}` }]} />
        <h1 className="text-5xl mt-4 mb-8">#{tag.name}</h1>
        {posts.length === 0
          ? <div className="card-surface p-10 text-center text-muted-foreground">No articles tagged yet.</div>
          : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>}
      </div>
    </>
  );
}
