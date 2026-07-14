import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} />}
            {it.href ? <Link to={it.href} className="hover:text-foreground">{it.label}</Link> : <span className="text-foreground">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
