import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { supabase } from '@/integrations/supabase/client';
import { Mail } from 'lucide-react';

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(5000),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: FormData) {
    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert(values);
    setLoading(false);
    if (error) toast.error('Could not send message. Try again.');
    else { toast.success('Message sent — we’ll get back to you.'); reset(); }
  }

  return (
    <>
      <SEO title="Contact NoThanks" canonical="/contact"
        description="Get in touch with the NoThanks team. Editorial questions, feedback, corrections, and partnership inquiries welcome." />
      <div className="container-narrow py-14">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
        <h1 className="text-5xl mt-4 mb-3">Contact us</h1>
        <p className="text-muted-foreground mb-10">Feedback, corrections, or partnership inquiries — we read every message.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="card-surface p-8 space-y-5">
          <Field label="Name" error={errors.name?.message}>
            <input {...register('name')} className="input" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" {...register('email')} className="input" />
          </Field>
          <Field label="Subject" error={errors.subject?.message}>
            <input {...register('subject')} className="input" />
          </Field>
          <Field label="Message" error={errors.message?.message}>
            <textarea rows={6} {...register('message')} className="input resize-y" />
          </Field>
          <button disabled={loading} className="btn-primary disabled:opacity-60"><Mail size={16} /> {loading ? 'Sending…' : 'Send message'}</button>
        </form>
      </div>
      <style>{`.input { width: 100%; border: 1px solid hsl(var(--input)); border-radius: 0.75rem; padding: 0.6rem 0.9rem; background: hsl(var(--background)); font-size: 0.9rem; }
      .input:focus { outline: none; box-shadow: 0 0 0 2px hsl(var(--ring)); }`}</style>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}
