import { useEffect, useMemo, useState } from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';

interface Faq { id: string; question: string; answer: string; category: string | null; }

export default function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    supabase.from('faqs').select('id,question,answer,category').eq('published', true)
      .order('display_order').then(({ data }) => setFaqs(data ?? []));
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return faqs.filter((f) => !s || f.question.toLowerCase().includes(s) || f.answer.toLowerCase().includes(s));
  }, [faqs, q]);

  const jsonLd = filtered.length ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: filtered.map((f) => ({
      '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : undefined;

  return (
    <>
      <SEO title="Frequently Asked Questions | NoThanks" canonical="/faq"
        description="Answers to common questions about NoThanks, our app, guides, and editorial approach." jsonLd={jsonLd} />
      <div className="container-narrow py-14">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
        <h1 className="text-5xl mt-4 mb-6">Questions & Answers</h1>
        <div className="flex items-center gap-2 rounded-full border border-input px-4 mb-8">
          <Search size={16} className="text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search FAQs…"
            className="flex-1 py-2.5 bg-transparent focus:outline-none text-sm" />
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">No questions match your search.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((f) => (
              <details key={f.id} className="card-surface p-5">
                <summary className="cursor-pointer font-medium">{f.question}</summary>
                <p className="mt-3 text-muted-foreground whitespace-pre-line">{f.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
