import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ShoppingBag, Tags, Package, Lightbulb, ShieldAlert, ScanLine, Smartphone } from 'lucide-react';

const GUIDES = [
  { slug: 'shopping-guides', icon: ShoppingBag, title: 'Buying Guides', desc: 'What to look for before you buy — across common product categories.' },
  { slug: 'brands', icon: Tags, title: 'Brand Guides', desc: 'Understand brands, ownership structures, and where products come from.' },
  { slug: 'shopping-guides', icon: Package, title: 'Product Guides', desc: 'Break down specs, labels, and differences between similar products.' },
  { slug: 'tips', icon: Lightbulb, title: 'Shopping Tips', desc: 'Small habits and mental shortcuts that lead to better decisions.' },
  { slug: 'consumer-awareness', icon: ShieldAlert, title: 'Consumer Awareness', desc: 'Know your rights, spot marketing tricks, and read labels confidently.' },
  { slug: 'technology', icon: ScanLine, title: 'Barcode Technology', desc: 'How the tech behind barcode scanning actually works.' },
  { slug: 'mobile-app', icon: Smartphone, title: 'Mobile App Tutorials', desc: 'Get more out of the NoThanks app with step-by-step guides.' },
];

export default function Guides() {
  return (
    <>
      <SEO title="Guides Hub — Buying Guides, Brand & Product Insights | NoThanks"
        description="Explore our curated hub of buying guides, brand deep-dives, product breakdowns, shopping tips, and mobile app tutorials." canonical="/guides" />
      <div className="container-wide py-14">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Guides' }]} />
        <div className="mt-4 mb-10 max-w-2xl">
          <h1 className="text-5xl mb-3">Guides Hub</h1>
          <p className="text-lg text-muted-foreground">Curated guides across the topics we cover — pick your starting point.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GUIDES.map((g) => (
            <Link key={g.title} to={`/category/${g.slug}`} className="card-surface p-6 hover:shadow-soft transition-shadow group">
              <g.icon className="text-primary mb-4" size={22} />
              <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">{g.title}</h3>
              <p className="text-sm text-muted-foreground">{g.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
