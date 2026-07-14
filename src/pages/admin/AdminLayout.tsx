import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderTree, Tags, Users, MessageSquare, HelpCircle, Mail, Inbox, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const items = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/posts', icon: FileText, label: 'Posts' },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { to: '/admin/tags', icon: Tags, label: 'Tags' },
  { to: '/admin/authors', icon: Users, label: 'Authors' },
  { to: '/admin/comments', icon: MessageSquare, label: 'Comments' },
  { to: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
  { to: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { to: '/admin/inbox', icon: Inbox, label: 'Inbox' },
];

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-60 border-r border-border bg-background flex flex-col">
        <Link to="/admin" className="font-serif text-2xl px-6 py-5">NoThanks<span className="text-primary">.</span></Link>
        <nav className="flex-1 px-3 space-y-0.5">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              <i.icon size={16} /> {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border text-xs text-muted-foreground">
          <p className="px-2 mb-2 truncate">{user?.email}</p>
          <Link to="/" className="flex items-center gap-2 px-2 py-1.5 hover:text-foreground"><ExternalLink size={14} /> View site</Link>
          <button onClick={signOut} className="flex items-center gap-2 px-2 py-1.5 hover:text-foreground w-full text-left"><LogOut size={14} /> Sign out</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
