import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import Newsletter from '@/components/Newsletter';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';
import { Facebook, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';

interface Post {
  id: string; slug: string; title: string; seo_title: string | null; meta_description: string | null;
  canonical_url: string | null; featured_image: string | null; image_alt: string | null;
  excerpt: string | null; content: string; reading_time: number;
  toc: any; faq: any; og_image: string | null; robots_index: boolean;
  published_at: string | null; updated_at: string;
  author: { name: string; slug: string; avatar_url: string | null; bio: string | null } | null;
  category: { name: string; slug: string } | null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from('posts')
        .select('*, author:authors(name,slug,avatar_url,bio), category:categories(name,slug)')
        .eq('slug', slug).eq('status', 'published').maybeSingle();
      if (!data) { setNotFound(true); return; }
      setPost(data as any);
      if (data.category_id) {
        const { data: r } = await supabase.from('posts')
          .select('id,slug,title,excerpt,featured_image')
          .eq('status', 'published').eq('category_id', data.category_id).neq('id', data.id).limit(3);
        setRelated(r ?? []);
      }
    })();
  }, [slug]);

  if (notFound) return <div className="container-narrow py-20 text-center"><h1 className="text-4xl mb-2">Article not found</h1><Link to="/blog" className="link-underline">Back to blog</Link></div>;
  if (!post) return <div className="container-narrow py-20 text-muted-foreground">Loading…</div>;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `/blog/${post.slug}`;
  const absUrl = `${origin}${url}`;
  const shareImage = post.og_image ?? post.featured_image ?? undefined;
  const absImage = shareImage
    ? shareImage.startsWith('http')
      ? shareImage
      : `${origin}${shareImage}`
    : undefined;

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: post.title, description: post.meta_description ?? post.excerpt,
      image: absImage, datePublished: post.published_at, dateModified: post.updated_at,
      author: post.author ? { '@type': 'Person', name: post.author.name } : undefined,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];
  const faqItems = Array.isArray(post.faq) ? post.faq : [];
  if (faqItems.length) {
    jsonLd.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqItems.map((f: any) => ({
        '@type': 'Question', name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  function copyLink() { navigator.clipboard.writeText(window.location.href); toast.success('Link copied'); }

  return (
    <>
      <SEO title={post.seo_title ?? `${post.title} | NoThanks`} description={post.meta_description ?? post.excerpt ?? undefined}
        canonical={post.canonical_url ?? absUrl} noindex={!post.robots_index}
        ogImage={absImage} ogType="article" jsonLd={jsonLd} />

      <article className="container-wide py-12">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' },
          ...(post.category ? [{ label: post.category.name, href: `/category/${post.category.slug}` }] : []),
          { label: post.title },
        ]} />

        <header className="max-w-3xl mx-auto text-center mt-8 mb-10">
          {post.category && <Link to={`/category/${post.category.slug}`} className="chip mb-4">{post.category.name}</Link>}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-5">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-muted-foreground">{post.excerpt}</p>}
          <div className="mt-6 flex justify-center items-center gap-4 text-sm text-muted-foreground">
            {post.author && <span>By {post.author.name}</span>}
            <span>·</span>
            <span>{formatDate(post.published_at)}</span>
            <span>·</span>
            <span>{post.reading_time} min read</span>
          </div>
        </header>

        {post.featured_image && (
          <img src={post.featured_image} alt={post.image_alt ?? post.title}
            className="w-full max-h-[520px] object-cover rounded-2xl mb-12" />
        )}

        <div className="grid lg:grid-cols-[1fr_260px] gap-12 max-w-5xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>{post.content}</ReactMarkdown>

            {faqItems.length > 0 && (
              <>
                <h2>Frequently Asked Questions</h2>
                {faqItems.map((f: any, i: number) => (
                  <details key={i} className="not-prose mb-3 card-surface p-5">
                    <summary className="cursor-pointer font-medium">{f.question}</summary>
                    <p className="mt-2 text-muted-foreground">{f.answer}</p>
                  </details>
                ))}
              </>
            )}

            <hr />
            <div className="not-prose flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Share:</span>
              <a target="_blank" rel="noopener" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} className="btn-outline !py-1.5"><Twitter size={14} /> Twitter</a>
              <a target="_blank" rel="noopener" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} className="btn-outline !py-1.5"><Facebook size={14} /> Facebook</a>
              <a target="_blank" rel="noopener" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} className="btn-outline !py-1.5"><Linkedin size={14} /> LinkedIn</a>
              <button onClick={copyLink} className="btn-outline !py-1.5"><LinkIcon size={14} /> Copy</button>
            </div>

            {post.author && (
              <div className="not-prose mt-10 card-surface p-6 flex gap-4">
                {post.author.avatar_url ? (
                  <img src={post.author.avatar_url} alt={post.author.name} className="w-14 h-14 rounded-full object-cover" />
                ) : <div className="w-14 h-14 rounded-full bg-muted" />}
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents content={post.content} />
              <Newsletter compact />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="max-w-5xl mx-auto mt-20">
            <h2 className="text-3xl mb-6">Related articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="card-surface p-5 hover:shadow-soft transition-shadow">
                  <h3 className="text-lg mb-2 line-clamp-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

function TableOfContents({ content }: { content: string }) {
  const headings = Array.from(content.matchAll(/^##\s+(.+)$/gm)).map((m) => m[1]);
  if (headings.length < 2) return null;
  return (
    <div className="card-surface p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">On this page</p>
      <ul className="space-y-2 text-sm">
        {headings.map((h) => {
          const id = h.toLowerCase().replace(/[^\w]+/g, '-');
          return <li key={id}><a href={`#${id}`} className="text-muted-foreground hover:text-foreground">{h}</a></li>;
        })}
      </ul>
    </div>
  );
}
