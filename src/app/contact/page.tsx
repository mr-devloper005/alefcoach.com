import Link from "next/link";
import { Clock, Mail, MessageSquare, Sparkles } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from "@/overrides/contact-page";

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
    <PageShell
      title={`Contact ${SITE_CONFIG.name}`}
      description={`Questions about stories, submissions, or working with ${SITE_CONFIG.name}? Send a note and we will point you to the right person.`}
      actions={
        <>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-[var(--kp-forest)]/25 bg-white text-[var(--kp-forest-deep)] hover:bg-[var(--kp-mint)]"
          >
            <Link href="/about">About</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-[var(--kp-forest)]/25 bg-white text-[var(--kp-forest-deep)] hover:bg-[var(--kp-mint)]"
          >
            <a href={mailtoHref}>Email us</a>
          </Button>
          <Button asChild className="rounded-full bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)]">
            <Link href="/articles">Read articles</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-[var(--kp-forest)]/12 bg-white shadow-[0_20px_50px_rgba(15,61,44,0.06)]">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <Badge className="border-[var(--kp-forest)]/15 bg-[var(--kp-mint)] text-[var(--kp-forest-deep)] hover:bg-[var(--kp-mint)]">
              Get in touch
            </Badge>
            <h2 className="text-2xl font-semibold text-[var(--kp-forest-deep)]">Send a message</h2>
            <p className="text-sm leading-relaxed text-[var(--kp-forest)]/75">
              Share enough context for us to help on the first reply, whether it is a pitch, a correction, or a collaboration idea.
            </p>
            <div className="rounded-2xl border border-[var(--kp-forest)]/12 bg-[var(--kp-mint)]/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--kp-forest)]/60">Primary inbox</p>
              <p className="mt-2 break-all text-base font-semibold text-[var(--kp-forest-deep)]">{contactEmail}</p>
              <Button asChild className="mt-4 rounded-full bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)]">
                <a href={mailtoHref}>Email this address</a>
              </Button>
            </div>
            <form className="grid gap-4" action="#" method="post">
              <input
                name="name"
                className="h-12 rounded-xl border border-[var(--kp-forest)]/18 bg-white px-4 text-sm text-[var(--kp-forest-deep)] outline-none placeholder:text-[var(--kp-forest)]/45 focus-visible:ring-2 focus-visible:ring-[var(--kp-forest)]/25"
                placeholder="Your name"
                autoComplete="name"
              />
              <input
                name="email"
                type="email"
                className="h-12 rounded-xl border border-[var(--kp-forest)]/18 bg-white px-4 text-sm text-[var(--kp-forest-deep)] outline-none placeholder:text-[var(--kp-forest)]/45 focus-visible:ring-2 focus-visible:ring-[var(--kp-forest)]/25"
                placeholder="Email address"
                autoComplete="email"
              />
              <input
                name="subject"
                className="h-12 rounded-xl border border-[var(--kp-forest)]/18 bg-white px-4 text-sm text-[var(--kp-forest-deep)] outline-none placeholder:text-[var(--kp-forest)]/45 focus-visible:ring-2 focus-visible:ring-[var(--kp-forest)]/25"
                placeholder="Topic (e.g. submission, partnership)"
              />
              <textarea
                name="message"
                className="min-h-[168px] rounded-2xl border border-[var(--kp-forest)]/18 bg-white px-4 py-3 text-sm text-[var(--kp-forest-deep)] outline-none placeholder:text-[var(--kp-forest)]/45 focus-visible:ring-2 focus-visible:ring-[var(--kp-forest)]/25"
                placeholder="How can we help?"
              />
              <Button
                type="submit"
                className="h-12 rounded-full bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)]"
              >
                Send message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {channels.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="border-[var(--kp-forest)]/12 bg-white shadow-[0_12px_40px_rgba(15,61,44,0.05)] transition-transform hover:-translate-y-0.5"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--kp-mint)] text-[var(--kp-forest)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--kp-forest-deep)]">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--kp-forest)]/75">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-[var(--kp-forest)]/12 bg-gradient-to-br from-[var(--kp-mint)] to-white">
            <CardContent className="flex items-start gap-3 p-6">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[var(--kp-forest)]" />
              <p className="text-sm leading-relaxed text-[var(--kp-forest)]/80">
                Prefer the full site story? Visit{" "}
                <Link href="/about" className="font-semibold text-[var(--kp-forest)] underline-offset-4 hover:underline">
                  About
                </Link>{" "}
                or meet the team on the{" "}
                <Link href="/team" className="font-semibold text-[var(--kp-forest)] underline-offset-4 hover:underline">
                  Team
                </Link>{" "}
                page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--kp-forest)]/12 bg-white shadow-[0_16px_48px_rgba(15,61,44,0.06)]">
          <CardContent className="p-6 sm:p-8">
            <Badge className="border-[var(--kp-forest)]/15 bg-[var(--kp-mint)] text-[var(--kp-forest-deep)] hover:bg-[var(--kp-mint)]">
              Editorial desk
            </Badge>
            <h2 className="mt-4 text-xl font-semibold text-[var(--kp-forest-deep)]">What we can help with</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--kp-forest)]/78">
              <li>Story pitches, corrections, and republication requests</li>
              <li>Newsletter sponsorships and branded content guidelines</li>
              <li>Speaking, workshops, and partnership inquiries</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-[var(--kp-forest)]/12 bg-gradient-to-br from-white to-[var(--kp-mint)]/60 shadow-[0_16px_48px_rgba(15,61,44,0.05)]">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[var(--kp-forest-deep)]">Elsewhere on the site</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--kp-forest)]/75">
              Prefer browsing before you write? Explore recent work and company background. We answer faster when you have seen how we publish.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="outline"
                asChild
                className="rounded-full border-[var(--kp-forest)]/25 bg-white hover:bg-[var(--kp-mint)]"
              >
                <Link href="/articles">Latest articles</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="rounded-full border-[var(--kp-forest)]/25 bg-white hover:bg-[var(--kp-mint)]"
              >
                <Link href="/careers">Careers</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="rounded-full border-[var(--kp-forest)]/25 bg-white hover:bg-[var(--kp-mint)]"
              >
                <Link href="/press">Press</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
