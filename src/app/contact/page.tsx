import Link from "next/link";
import { Clock, Mail, MessageSquare, Sparkles } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from "@/overrides/contact-page";
import { ContactLeadForm } from "@/components/shared/contact-lead-form";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || `hello@${SITE_CONFIG.domain}`;
const mailtoHref = `mailto:${contactEmail}`;

const channels = [
  {
    title: "Email us",
    description: "Editorial, partnerships, and reader support all route through one inbox for a cleaner response flow.",
    icon: Mail,
  },
  {
    title: "Response time",
    description: "Most notes receive a first reply within two business days.",
    icon: Clock,
  },
  {
    title: "What to include",
    description: "Topic, deadline, and links help us route your request faster.",
    icon: MessageSquare,
  },
];

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--kp-mint)_0%,#f7fdf9_30%,#ffffff_100%)] text-[var(--kp-ink)]">
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden px-6 py-20 md:px-10 lg:px-16">
          <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-[var(--kp-forest)]/20 blur-3xl" />
          <div className="absolute bottom-0 right-[-8%] h-80 w-80 rounded-full bg-[var(--kp-forest-deep)]/16 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--kp-forest)]/75">Contact</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-[var(--kp-forest-deep)] md:text-7xl">
                Let&apos;s talk about your next move.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--kp-forest)]/82">
                Use this form to reach {siteName}. Your request will be recorded and shared with the support team for follow-up.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

              <div className="mt-8 grid gap-4">
                {contactHighlights.map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-3xl border border-[var(--kp-forest)]/12 bg-white/90 p-5 shadow-[0_16px_45px_rgba(15,61,44,0.07)]">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--kp-forest-deep)] text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-[var(--kp-forest-deep)]">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[var(--kp-forest)]/75">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
