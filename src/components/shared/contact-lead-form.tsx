'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to send your message.');
      }

      setStatus('success');
      setMessage(data?.message || 'Thanks. Your message has been received.');
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[var(--kp-forest)]/14 bg-white/95 p-6 shadow-[0_28px_90px_rgba(15,61,44,0.12)] backdrop-blur md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[var(--kp-forest)]/82">
          Full name
          <input name="name" required placeholder="Your name" className="h-12 rounded-2xl border border-[var(--kp-forest)]/14 bg-[var(--kp-mint)]/28 px-4 text-base font-medium text-[var(--kp-forest-deep)] outline-none transition focus:border-[var(--kp-forest)] focus:bg-white" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[var(--kp-forest)]/82">
          Email address
          <input name="email" type="email" required placeholder="you@example.com" className="h-12 rounded-2xl border border-[var(--kp-forest)]/14 bg-[var(--kp-mint)]/28 px-4 text-base font-medium text-[var(--kp-forest-deep)] outline-none transition focus:border-[var(--kp-forest)] focus:bg-white" />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[var(--kp-forest)]/82">
          Phone number
          <input name="phone" placeholder="Optional" className="h-12 rounded-2xl border border-[var(--kp-forest)]/14 bg-[var(--kp-mint)]/28 px-4 text-base font-medium text-[var(--kp-forest-deep)] outline-none transition focus:border-[var(--kp-forest)] focus:bg-white" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[var(--kp-forest)]/82">
          Subject
          <input name="subject" placeholder="How can we help?" className="h-12 rounded-2xl border border-[var(--kp-forest)]/14 bg-[var(--kp-mint)]/28 px-4 text-base font-medium text-[var(--kp-forest-deep)] outline-none transition focus:border-[var(--kp-forest)] focus:bg-white" />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-semibold text-[var(--kp-forest)]/82">
        Message
        <textarea name="message" required rows={6} placeholder="Tell us what you need help with..." className="rounded-2xl border border-[var(--kp-forest)]/14 bg-[var(--kp-mint)]/28 px-4 py-3 text-base font-medium text-[var(--kp-forest-deep)] outline-none transition focus:border-[var(--kp-forest)] focus:bg-white" />
      </label>

      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {message ? (
        <div className={`mt-5 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}

      <button type="submit" disabled={status === 'submitting'} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--kp-forest-deep)] px-6 text-sm font-black uppercase tracking-[0.24em] text-white shadow-lg shadow-[rgba(15,61,44,0.26)] transition hover:-translate-y-0.5 hover:bg-[var(--kp-forest)] disabled:cursor-not-allowed disabled:opacity-70">
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send message
      </button>
    </form>
  );
}
