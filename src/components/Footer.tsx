import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpeg';


export default function Footer() {
  const y = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-muted/40 mt-24">
      <div className="container-wide py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="NoThanks logo" className="h-9 w-9 rounded-lg" />
            <span className="font-sans text-xl font-bold tracking-tight">NoThanks<span className="text-primary">.</span></span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A trusted knowledge hub for consumer guides, product information, and informed shopping.
          </p>
        </div>

        <FooterCol title="Explore" links={[
          ['Blog', '/blog'], ['Guides', '/guides'], ['FAQ', '/faq'], ['Download App', '/download'],
        ]} />
        <FooterCol title="Company" links={[
          ['About', '/about'], ['Contact', '/contact'],
        ]} />
        <FooterCol title="Legal" links={[
          ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Disclaimer', '/disclaimer'],
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="container-wide py-5 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>© {y} NoThanks. All rights reserved.</span>
          <span>
            Website designed and developed by{' '}
            <a
              href="https://zarrarinnovations.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Zarrar Innovations
            </a>
          </span>
        </div>

      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-sans text-sm font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={href}><Link to={href} className="text-muted-foreground hover:text-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
