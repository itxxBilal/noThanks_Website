import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ShieldCheck, Smartphone, Sparkles, Search, Tag } from 'lucide-react';
import SEO from '@/components/SEO';
import Newsletter from '@/components/Newsletter';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';

interface Post { id: string; slug: string; title: string; excerpt: string | null; featured_image: string | null; published_at: string | null; reading_time: number; }
interface Category { id: string; slug: string; name: string; description: string | null; }

export default function Home() {
  const [featured, setFeatured] = useState<Post[]>([]);
  const [latest, setLatest] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const [feat, lat, cats] = await Promise.all([
        supabase.from('posts').select('id,slug,title,excerpt,featured_image,published_at,reading_time')
          .eq('status', 'published').eq('featured', true).order('published_at', { ascending: false }).limit(3),
        supabase.from('posts').select('id,slug,title,excerpt,featured_image,published_at,reading_time')
          .eq('status', 'published').order('published_at', { ascending: false }).limit(6),
        supabase.from('categories').select('id,slug,name,description').order('display_order').limit(6),
      ]);
      setFeatured(feat.data ?? []);
      setLatest(lat.data ?? []);
      setCategories(cats.data ?? []);
    })();
  }, []);

  return (
    <>
      <SEO
        title="Consumer Guides, Shopping Tips & Product Information | NoThanks"
        description="Discover trusted buying guides, consumer awareness articles, product insights, shopping tips, and helpful resources to make informed purchasing decisions."
        canonical="/"
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-wide pt-20 pb-16 lg:pt-28 lg:pb-24 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="chip mb-5"><Sparkles size={14} className="mr-1.5" /> Trusted consumer knowledge</span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6">
              Make better purchasing decisions <em className="text-primary not-italic">with confidence.</em>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              Discover products, learn about brands, explore buying guides, and make informed consumer choices through trusted information and educational resources.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/guides" className="btn-primary">Explore Guides <ArrowRight size={16} /></Link>
              <Link to="/download" className="btn-outline">Download Mobile App</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat kpi="500+" label="Guides" />
              <Stat kpi="1M+" label="Readers" />
              <Stat kpi="98%" label="Satisfaction" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="relative">
            <div className="card-surface p-8 aspect-[4/5] flex flex-col justify-between overflow-hidden">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Search size={14} /> Search products, brands, or guides…</div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Popular this week</p>
                <ul className="space-y-3">
                  {['How to read a nutrition label', 'Understanding barcode formats', 'Buying guide: everyday essentials'].map((t) => (
                    <li key={t} className="p-3 rounded-xl bg-muted/60 text-sm">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 card-surface p-4 hidden sm:flex items-center gap-3">
              <ShieldCheck className="text-primary" /> <span className="text-sm">Independent · Neutral · Educational</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <Section title="Explore Popular Categories" subtitle="Browse curated topics covering everything from shopping tips to product technology.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(categories.length ? categories : DEFAULT_CATEGORIES).map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="card-surface p-6 hover:shadow-soft transition-shadow group">
              <Tag size={18} className="text-primary mb-4" />
              <h3 className="text-xl mb-1 group-hover:text-primary transition-colors">{c.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{c.description ?? 'Curated articles and guides.'}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <Section title="Featured Guides" subtitle="Editorial picks worth your time.">
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </Section>
      )}

      {/* LATEST */}
      <Section title="Latest Articles" subtitle="Fresh from the editorial team." action={<Link to="/blog" className="text-sm link-underline">View all →</Link>}>
        {latest.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </Section>

      {/* FEATURES */}
      <Section title="What NoThanks offers" subtitle="A trusted knowledge hub built for readers who care about the details.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-surface p-6">
              <f.icon className="text-primary mb-4" size={22} />
              <h3 className="text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* NEWSLETTER + DOWNLOAD */}
      <section className="container-wide py-20 grid lg:grid-cols-2 gap-8">
        <Newsletter />
        <div className="card-surface p-8 sm:p-10 bg-primary text-primary-foreground">
          <Smartphone className="mb-4" />
          <h3 className="text-2xl sm:text-3xl mb-2">Take NoThanks with you</h3>
          <p className="opacity-90 mb-6">Scan products, save guides, and access articles on the go with our mobile app.</p>
          <Link to="/download" className="btn bg-white text-primary hover:bg-white/90">Download the App <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}

const DEFAULT_CATEGORIES = [
  { id: '1', slug: 'shopping-guides', name: 'Shopping Guides', description: 'Practical buying advice for everyday products.' },
  { id: '2', slug: 'consumer-awareness', name: 'Consumer Awareness', description: 'Know your rights, labels, and choices.' },
  { id: '3', slug: 'brands', name: 'Brands', description: 'Deep-dives into brands, ownership, and product lines.' },
  { id: '4', slug: 'mobile-app', name: 'Mobile App', description: 'Tutorials and updates for the NoThanks app.' },
  { id: '5', slug: 'technology', name: 'Barcode Technology', description: 'How scanning works — the tech behind the app.' },
  { id: '6', slug: 'tips', name: 'Shopping Tips', description: 'Small habits that lead to smarter purchases.' },
];

const FEATURES = [
  { icon: BookOpen, title: 'In-depth guides', body: 'Long-form articles researched and edited to help you decide with confidence.' },
  { icon: ShieldCheck, title: 'Neutral & transparent', body: 'We disclose our sources and editorial standards on every page.' },
  { icon: Smartphone, title: 'Mobile companion', body: 'Scan barcodes and look up product information right from your phone.' },
];

function Stat({ kpi, label }: { kpi: string; label: string }) {
  return <div><div className="font-serif text-2xl">{kpi}</div><div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div></div>;
}

function Section({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="container-wide py-16">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl sm:text-4xl mb-1">{title}</h2>
          {subtitle && <p className="text-muted-foreground max-w-2xl">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="card-surface overflow-hidden group flex flex-col hover:shadow-soft transition-shadow">
      <div className="aspect-[16/10] bg-muted overflow-hidden relative">
        {post.featured_image ? (
          <img src={post.featured_image} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-accent">
            <BookOpen className="text-primary/60" size={48} />
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{formatDate(post.published_at)}</span>
          <span>{post.reading_time} min read</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="card-surface p-10 text-center">
      <p className="text-muted-foreground">No articles yet. Sign in as an editor to publish the first one.</p>
      <Link to="/login" className="btn-outline mt-4">Editor sign in</Link>
    </div>
  );
}
