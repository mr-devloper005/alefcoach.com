import Link from "next/link";
import { Briefcase, Coffee, Globe2, HeartHandshake, Laptop, Sparkles } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";

const roles = [
  {
    title: "Senior Editor, Technology & Culture",
    location: "Remote (US / EU time zones)",
    type: "Full-time",
    level: "Senior",
    blurb: "Shape coverage, coach writers, and keep our standards for accuracy and voice exceptionally high.",
  },
  {
    title: "Product Designer",
    location: "Hybrid — New York",
    type: "Full-time",
    level: "Mid",
    blurb: "Own reader-facing surfaces: article templates, search, and subscription flows in our mint-and-forest system.",
  },
  {
    title: "Audience & Newsletter Lead",
    location: "Remote",
    type: "Full-time",
    level: "Mid",
    blurb: "Grow our digest, experiment with cadence, and make analytics legible for the editorial team.",
  },
];

const benefits = [
  { text: "Remote-first with optional studio weeks", icon: Globe2 },
  { text: "Health, dental, and vision for full-time roles", icon: HeartHandshake },
  { text: "$2k annual learning & conference budget", icon: Laptop },
  { text: "Summer Fridays and flexible async hours", icon: Coffee },
];

export default function CareersPage() {
  return (
    <PageShell
      title="Careers"
      description={`Join ${SITE_CONFIG.name} and help build a calmer, more thoughtful corner of the web—where editorial quality still wins.`}
      actions={
        <Button
          asChild
          className="rounded-full bg-[var(--kp-forest)] px-6 text-white hover:bg-[var(--kp-forest-deep)]"
        >
          <Link href="/contact">Introduce yourself</Link>
        </Button>
      }
    >
      <div className="rounded-[2rem] border border-[var(--kp-forest)]/12 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,61,44,0.07)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[var(--kp-forest)]">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em]">Working here</span>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--kp-forest)]/78">
          We are a small team with high trust and clear ownership. You will collaborate closely with editors, engineers, and
          designers who care about typography, performance, and the ethics of what we publish.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--kp-forest-deep)] sm:text-2xl">
            Open roles
          </h2>
          {roles.map((role) => (
            <Card
              key={role.title}
              className="border-[var(--kp-forest)]/12 bg-white shadow-[0_14px_44px_rgba(15,61,44,0.06)] transition-transform hover:-translate-y-0.5"
            >
              <CardContent className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-[var(--kp-forest)]/15 bg-[var(--kp-mint)] text-[var(--kp-forest-deep)]">{role.level}</Badge>
                  <Badge variant="outline" className="border-[var(--kp-forest)]/20 text-[var(--kp-forest-deep)]">
                    {role.type}
                  </Badge>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-[var(--kp-forest)]/60" />
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--kp-forest-deep)]">{role.title}</h3>
                    <p className="mt-1 text-sm text-[var(--kp-forest)]/65">{role.location}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--kp-forest)]/75">{role.blurb}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="mt-5 rounded-full border-[var(--kp-forest)]/25 bg-white hover:bg-[var(--kp-mint)]"
                >
                  <Link href="/contact">Start a conversation</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="border-[var(--kp-forest)]/12 bg-gradient-to-b from-[var(--kp-mint)] to-white shadow-[0_16px_48px_rgba(15,61,44,0.06)]">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[var(--kp-forest-deep)]">Benefits & culture</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--kp-forest)]/75">
                We optimize for sustainable pace: fewer meetings, more writing and making. Benefits scale with role and region.
              </p>
              <ul className="mt-6 space-y-3">
                {benefits.map(({ text, icon: Icon }) => (
                  <li
                    key={text}
                    className="flex items-start gap-3 rounded-xl border border-[var(--kp-forest)]/10 bg-white/80 px-4 py-3 text-sm text-[var(--kp-forest)]/85"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--kp-forest)]" />
                    {text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-[var(--kp-forest)]/12 bg-white">
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed text-[var(--kp-forest)]/75">
                Don&apos;t see a perfect fit? Send a short note with what you&apos;d like to build—we often open roles for the
                right person.
              </p>
              <Button asChild className="mt-4 w-full rounded-full bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)]">
                <Link href="/contact">Write to us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
