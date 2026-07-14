import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText, MessageSquare, Mail, Inbox } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ published: 0, drafts: 0, comments: 0, subscribers: 0, inbox: 0 });

  useEffect(() => {
    (async () => {
      const [pub, drafts, comm, sub, msgs] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('approved', false),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
      ]);
      setStats({
        published: pub.count ?? 0, drafts: drafts.count ?? 0,
        comments: comm.count ?? 0, subscribers: sub.count ?? 0, inbox: msgs.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Published posts" value={stats.published} icon={FileText} href="/admin/posts" />
        <Stat label="Drafts" value={stats.drafts} icon={FileText} href="/admin/posts" />
        <Stat label="Pending comments" value={stats.comments} icon={MessageSquare} href="/admin/comments" />
        <Stat label="Subscribers" value={stats.subscribers} icon={Mail} href="/admin/newsletter" />
        <Stat label="Unread messages" value={stats.inbox} icon={Inbox} href="/admin/inbox" />
      </div>
      <div className="mt-8">
        <Link to="/admin/posts/new" className="btn-primary">Write new post</Link>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, href }: any) {
  return (
    <Link to={href} className="card-surface p-5 hover:shadow-soft transition-shadow">
      <Icon size={18} className="text-primary mb-3" />
      <p className="text-3xl font-serif">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Link>
  );
}
