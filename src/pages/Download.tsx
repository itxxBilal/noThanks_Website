import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Apple, Play, Star } from 'lucide-react';

export default function Download() {
  return (
    <>
      <SEO title="Download the NoThanks Mobile App" canonical="/download"
        description="Download the NoThanks app for iOS and Android. Scan barcodes, search products, and access guides on the go." />
      <div className="container-wide py-14">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Download' }]} />
        <div className="mt-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl mb-4">Get the NoThanks app</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Scan barcodes, look up product information, and read guides — anywhere.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="btn-primary"><Apple size={16} /> App Store</a>
              <a href="#" className="btn-outline"><Play size={16} /> Google Play</a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Star size={14} className="text-primary" fill="currentColor" /> 4.8 · Free to download
            </div>
          </div>
          <div className="card-surface aspect-[4/5] p-10 flex items-center justify-center text-muted-foreground">
            App screenshot
          </div>
        </div>

        <section className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            ['Fast scanning', 'Instant product lookups with an optimized scanner.'],
            ['Save & share', 'Bookmark products and guides across devices.'],
            ['Offline access', 'Read cached guides even without a connection.'],
          ].map(([t, d]) => (
            <div key={t} className="card-surface p-6">
              <h3 className="text-xl mb-2">{t}</h3><p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
