import Link from "next/link";
import { BookOpen, Feather, Heart, Sparkles } from "lucide-react";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockTeamMembers } from "@/data/mock-data";
import { SITE_CONFIG } from "@/lib/site-config";

const stats = [
  { label: "Original essays & guides", value: "240+" },
  { label: "Newsletter readers", value: "18k" },
  { label: "Topics covered", value: "35" },
];

const pillars = [
  {
    title: "Depth over noise",
    description:
      "We commission and edit long-form work you can sit with—reporting, essays, and practical playbooks—not clickbait roundups.",
    icon: Feather,
  },
  {
    title: "Readers first",
    description:
      "Typography, spacing, and calm color are tuned for reading sessions. Every layout decision serves comprehension.",
    icon: BookOpen,
  },
  {
    title: "Open conversation",
    description:
      "We welcome thoughtful disagreement and corrections. The goal is a living archive of useful ideas, not a sealed brand monologue.",
    icon: Heart,
  },
];

const moments = [
  { year: "2024", text: "Launched the current reading-first article experience and weekly digest." },
  { year: "2025", text: "Expanded topic desks—technology, culture, and practical careers." },
  { year: "2026", text: "Doubling down on contributor tools and cleaner discovery for new readers." },
];

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is an independent editorial desk for essays, reporting, and field notes—built for people who still enjoy a quiet, focused read.`}
      actions={
        <>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-[var(--kp-forest)]/25 bg-white text-[var(--kp-forest-deep)] hover:bg-[var(--kp-mint)]"
          >
            <Link href="/articles">Browse articles</Link>
          </Button>
          <Button asChild className="rounded-full bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)]">
            <Link href="/contact">Contact editorial</Link>
          </Button>
        </>
      }
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-[var(--kp-forest)] px-6 py-10 text-white shadow-[0_28px_80px_rgba(15,61,44,0.2)] sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute right-8 top-6 h-16 w-16 rounded-full bg-[var(--kp-lemon)]/35" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/75">Why we exist</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              A slower lane for ideas that deserve more than a headline.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85">
              Algorithms reward speed; we invest in craft. Our editors work with writers to sharpen arguments, verify details,
              and present stories in a format that respects your attention.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4 text-center backdrop-blur-sm"
              >
                <div className="text-xl font-semibold sm:text-2xl">{s.value}</div>
                <div className="mt-1 text-[10px] font-medium uppercase leading-tight tracking-wide text-white/75">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {pillars.map(({ title, description, icon: Icon }) => (
          <Card
            key={title}
            className="border-[var(--kp-forest)]/12 bg-white shadow-[0_16px_48px_rgba(15,61,44,0.06)] transition-transform hover:-translate-y-1"
          >
            <CardContent className="p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--kp-mint)] text-[var(--kp-forest)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[var(--kp-forest-deep)]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--kp-forest)]/75">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-[var(--kp-forest)]/12 bg-white shadow-[0_20px_50px_rgba(15,61,44,0.06)]">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <Badge className="border-[var(--kp-forest)]/15 bg-[var(--kp-mint)] text-[var(--kp-forest-deep)] hover:bg-[var(--kp-mint)]">
              From the desk
            </Badge>
            <h2 className="text-2xl font-semibold text-[var(--kp-forest-deep)]">How a story becomes a {SITE_CONFIG.name} piece</h2>
            <p className="text-sm leading-relaxed text-[var(--kp-forest)]/75">
              Pitches land in a shared queue. Editors reply with questions, suggested structure, and timeline. Drafts move through
              review for accuracy, clarity, and voice—then art direction picks imagery that matches the tone of the piece.
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-[var(--kp-forest)]/80">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--kp-forest)]" />
                Fact-checking for names, dates, and claims that need a second source.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--kp-forest)]" />
                Headlines that describe the article, not the mood of the internet that day.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--kp-forest)]" />
                Accessible markup and readable type so posts work on phones and large screens alike.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-[var(--kp-forest)]/12 bg-gradient-to-b from-[var(--kp-mint)]/90 to-white">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 text-[var(--kp-forest)]">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Milestones</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--kp-forest-deep)]">Recent chapter</h3>
            <div className="space-y-4">
              {moments.map((m) => (
                <div key={m.year} className="flex gap-4 border-b border-[var(--kp-forest)]/10 pb-4 last:border-0 last:pb-0">
                  <span className="w-12 shrink-0 text-sm font-semibold text-[var(--kp-forest)]">{m.year}</span>
                  <p className="text-sm leading-relaxed text-[var(--kp-forest)]/78">{m.text}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" asChild className="w-full rounded-full border-[var(--kp-forest)]/25 bg-white">
              <Link href="/press">Read press notes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-14">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--kp-forest-deep)]">
              People behind the bylines
            </h2>
            <p className="mt-1 max-w-xl text-sm text-[var(--kp-forest)]/72">
              A small core team and a growing network of contributors—editors, researchers, and producers.
            </p>
          </div>
          <Link href="/team" className="text-sm font-semibold text-[var(--kp-forest)] underline-offset-4 hover:underline">
            Full team directory
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {mockTeamMembers.map((member) => (
            <Card
              key={member.id}
              className="border-[var(--kp-forest)]/12 bg-white shadow-[0_12px_40px_rgba(15,61,44,0.05)] transition-transform hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-[var(--kp-forest)]/10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-[var(--kp-forest-deep)]">{member.name}</p>
                    <p className="text-xs text-[var(--kp-forest)]/65">{member.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--kp-forest)]/75">{member.bio}</p>
                <p className="mt-3 text-xs text-[var(--kp-forest)]/55">{member.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
