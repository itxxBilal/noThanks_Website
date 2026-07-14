import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { toast } from 'react-toastify';

interface Props {
  value: string;
  onChange: (url: string) => void;
  accept?: 'image' | 'video' | 'both';
  label?: string;
}

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export default function MediaUpload({ value, onChange, accept = 'image', label = 'Upload' }: Props) {
  const { user } = useAuth();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const acceptAttr =
    accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*';

  async function handleFile(file: File) {
    if (!user) return toast.error('Sign in to upload');
    if (file.size > 50 * 1024 * 1024) return toast.error('File must be under 50 MB');
    setBusy(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('images').upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data, error: sErr } = await supabase.storage
        .from('images')
        .createSignedUrl(path, TEN_YEARS);
      if (sErr || !data) throw sErr ?? new Error('Could not sign URL');
      onChange(data.signedUrl);
      toast.success('Uploaded');
    } catch (e: any) {
      toast.error(e.message ?? 'Upload failed');
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  }

  const isVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(value);

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          {isVideo ? (
            <video src={value} controls className="max-h-48 rounded-lg border border-border" />
          ) : (
            <img src={value} alt="preview" className="max-h-48 rounded-lg border border-border object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 shadow"
            aria-label="Remove"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground">
          {accept === 'video' ? <Video size={18} /> : <ImageIcon size={18} />}
          <span>No file selected</span>
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => ref.current?.click()}
          className="btn-outline !py-1.5 text-sm"
        >
          <Upload size={14} /> {busy ? 'Uploading…' : label}
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste a URL"
          className="flex-1 border border-input rounded-lg px-3 py-1.5 text-sm bg-background"
        />
      </div>
      <input
        ref={ref}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
