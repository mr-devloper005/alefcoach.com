import Link from "next/link";
import { ArrowRight, Building2, FileText, Image as ImageIcon, LayoutGrid, MapPin, Tag, User } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskListClient } from "@/components/tasks/task-list-client";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import { CATEGORY_OPTIONS, normalizeCategory } from "@/lib/categories";
import { taskIntroCopy } from "@/config/site.content";
import { TASK_LIST_PAGE_OVERRIDE_ENABLED, TaskListPageOverride } from "@/overrides/task-list-page";

const taskIcons: Record<TaskKey, any> = {
  listing: Building2,
  article: FileText,
  image: ImageIcon,
  profile: User,
  classified: Tag,
  sbm: LayoutGrid,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
};

const extractText = (value?: string | null) =>
  (value || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getContent = (post: any) => (post?.content && typeof post.content === "object" ? post.content : {}) as Record<string, unknown>;

export async function TaskListPage({ task, category }: { task: TaskKey; category?: string }) {
  if (TASK_LIST_PAGE_OVERRIDE_ENABLED) {
    return await TaskListPageOverride({ task, category });
  }

  const taskConfig = getTaskConfig(task);
  const posts = await fetchTaskPosts(task, 30);
  const normalizedCategory = category ? normalizeCategory(category) : "all";
  const intro = taskIntroCopy[task];
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || "/posts"}/${post.slug}`,
    name: post.title,
  }));
  const Icon = taskIcons[task] || LayoutGrid;

  const categories = new Set<string>();
  const locations = new Set<string>();

  posts.forEach((post) => {
    const content = getContent(post);
    const rawCategory =
      typeof content.category === "string" ? content.category : typeof post.tags?.[0] === "string" ? post.tags[0] : "";
    const rawLocation =
      typeof content.location === "string"
        ? content.location
        : typeof content.address === "string"
          ? content.address
          : "";

    if (rawCategory.trim()) categories.add(rawCategory.trim());
    if (rawLocation.trim()) locations.add(rawLocation.trim());
  });

  const leadPost = posts[0];
  const leadContent = getContent(leadPost);
  const leadSummary = extractText(
    typeof leadContent.description === "string" ? leadContent.description : leadPost?.summary || ""
  );
  const accentText =
    task === "listing" || task === "classified" || task === "profile"
      ? "A warmer, slower scan rhythm for finding the right fit."
      : "An editorial surface with room to breathe and clearer hierarchy.";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--kp-mint)_0%,#f7fdf9_30%,#ffffff_100%)] text-[var(--kp-ink)]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {task === "listing" ? (
          <SchemaJsonLd
            data={[
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "Business Directory Listings",
                itemListElement: schemaItems,
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: SITE_CONFIG.name,
                url: `${baseUrl}/listings`,
                areaServed: "Worldwide",
              },
            ]}
          />
        ) : null}

        {task === "article" || task === "classified" ? (
          <SchemaJsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ""}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--kp-forest)]/20 bg-[linear-gradient(135deg,var(--kp-forest)_0%,var(--kp-forest-deep)_48%,var(--kp-forest)_100%)] text-white shadow-[0_28px_90px_rgba(15,61,44,0.18)]">
          <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_48%)] lg:block" aria-hidden />
          <div className="relative grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-10 lg:py-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]">
                <Icon className="h-4 w-4" />
                {taskConfig?.label || task}
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {taskConfig?.description || "Discover curated posts"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">
                {accentText}
              </p>
              {leadSummary ? (
                <p className="mt-6 max-w-2xl border-l border-white/30 pl-4 text-sm leading-7 text-white/78">
                  {leadSummary}
                </p>
              ) : null}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={taskConfig?.route || "#"}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--kp-forest-deep)] transition hover:bg-[var(--kp-mint)]"
                >
                  Browse collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  Search site
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <form
                className="rounded-[1.75rem] border border-white/16 bg-white/12 p-5 backdrop-blur-sm"
                action={taskConfig?.route || "#"}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">Refine this page</p>
                <div className="mt-4 grid gap-3">
                  <div>
                    <label className="text-xs text-white/80">Category</label>
                    <select
                      name="category"
                      defaultValue={normalizedCategory}
                      className="mt-2 h-12 w-full rounded-2xl border border-white/15 bg-white/92 px-4 text-sm text-slate-900 outline-none"
                    >
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="h-12 rounded-2xl bg-[var(--kp-forest-deep)] text-sm font-semibold text-white transition hover:bg-[var(--kp-forest)]"
                  >
                    Apply filter
                  </button>
                </div>
              </form>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/16 bg-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Posts</p>
                  <p className="mt-2 text-2xl font-semibold">{posts.length}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/16 bg-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Topics</p>
                  <p className="mt-2 text-2xl font-semibold">{categories.size || 1}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/16 bg-white/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Places</p>
                  <p className="mt-2 text-2xl font-semibold">{locations.size || 1}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {leadPost ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.75rem] border border-[var(--kp-forest)]/12 bg-white p-6 shadow-[0_18px_50px_rgba(15,61,44,0.07)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--kp-forest)]/75">Featured next read</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--kp-forest-deep)]">{leadPost.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--kp-forest)]/78">
                {leadSummary || "Freshly surfaced from the current collection."}
              </p>
              <Link
                href={`${taskConfig?.route || "/posts"}/${leadPost.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--kp-forest)] hover:text-[var(--kp-forest-deep)]"
              >
                Open featured post
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-[var(--kp-forest)]/12 bg-[var(--kp-mint)]/40 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--kp-forest)]/75">Collection note</p>
                <p className="mt-3 text-sm leading-7 text-[var(--kp-forest)]/78">
                  This layout keeps visual weight low around filters and higher around the cards, so browsing feels closer to a magazine spread than a utility grid.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-[var(--kp-forest)]/12 bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--kp-forest)]/75">Signals</p>
                <div className="mt-4 space-y-3 text-sm text-[var(--kp-forest)]/75">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[var(--kp-forest)]" />
                    Clearer topic grouping
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--kp-forest)]" />
                    Better location scanning
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[var(--kp-forest)]" />
                    Faster path into each card
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {intro ? (
          <section className="mt-8 rounded-[1.75rem] border border-[var(--kp-forest)]/12 bg-white px-6 py-7 shadow-[0_16px_45px_rgba(15,61,44,0.05)] sm:px-8">
            <h2 className="text-2xl font-semibold text-[var(--kp-forest-deep)]">{intro.title}</h2>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 text-sm leading-7 text-[var(--kp-forest)]/78">
                {paragraph}
              </p>
            ))}
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              {intro.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-semibold text-[var(--kp-forest)] underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-8">
          <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
