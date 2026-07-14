import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import logo from '@/assets/logo.jpeg';
import { BookOpen, Compass, ShieldCheck, Users } from 'lucide-react';


export default function About() {
  return (
    <>
      <SEO title="About NoThanks — Our Mission & Editorial Standards" canonical="/about"
        description="Learn about NoThanks: our mission to help consumers make informed decisions, our editorial standards, data sources, and commitment to transparency." />
      <div className="container-narrow py-16">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
        <img src={logo} alt="NoThanks logo" className="h-16 w-16 rounded-2xl mt-6" />
        <h1 className="text-5xl mt-4 mb-6">About NoThanks</h1>

        <p className="text-lg text-muted-foreground mb-10">
          NoThanks is an editorial platform dedicated to helping people make better everyday purchasing decisions.
          We publish guides, product breakdowns, and consumer education content — and we build tools that make information easier to access.
        </p>

        <Section icon={Compass} title="Our Mission">
          To empower consumers with clear, well-researched, and neutral information so every shopping decision can be a considered one.
        </Section>
        <Section icon={BookOpen} title="How the Platform Works">
          Our editorial team researches and publishes long-form guides, category overviews, and how-to articles. The NoThanks mobile app
          complements the site with barcode scanning and quick lookups.
        </Section>
        <Section icon={ShieldCheck} title="Editorial Standards">
          Articles are fact-checked before publication. We cite sources, distinguish opinion from information, and update older articles
          when facts change. Sponsored content — when present — is clearly labeled.
        </Section>
        <Section icon={Users} title="Transparency">
          We disclose partnerships, affiliate relationships, and data sources. If we get something wrong, we correct it publicly
          and note the update on the article.
        </Section>
      </div>
    </>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2"><Icon className="text-primary" size={20} /><h2 className="text-2xl">{title}</h2></div>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
