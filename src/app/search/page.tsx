import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { fetchSiteFeed } from "@/lib/site-connector";
import { buildPostUrl, getPostTaskKey } from "@/lib/task-data";
import { getMockPostsForTask } from "@/lib/mock-posts";
import { SITE_CONFIG } from "@/lib/site-config";
import { TaskPostCard } from "@/components/shared/task-post-card";

export const revalidate = 3;

const matchText = (value: string, query: string) =>
  value.toLowerCase().includes(query);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const compactText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return stripHtml(value).replace(/\s+/g, " ").trim().toLowerCase();
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const query = (resolved.q || "").trim();
  const normalized = query.toLowerCase();
  const category = (resolved.category || "").trim().toLowerCase();
  const task = (resolved.task || "").trim().toLowerCase();
  const useMaster = resolved.master !== "0";
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster
      ? { fresh: true, category: category || undefined, task: task || undefined }
      : undefined
  );
  const posts =
    feed?.posts?.length
      ? feed.posts
      : useMaster
        ? []
        : SITE_CONFIG.tasks.flatMap((task) => getMockPostsForTask(task.key));

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === "object" ? post.content : {};
    const typeText = compactText((content as any).type);
    if (typeText === "comment") return false;
    const description = compactText((content as any).description);
    const body = compactText((content as any).body);
    const excerpt = compactText((content as any).excerpt);
    const categoryText = compactText((content as any).category);
    const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
    const tagsText = compactText(tags);
    const derivedCategory = categoryText || tagsText;
    if (category && !derivedCategory.includes(category)) return false;
    if (task && typeText && typeText !== task) return false;
    if (!normalized.length) return true;
    return (
      matchText(compactText(post.title || ""), normalized) ||
      matchText(compactText(post.summary || ""), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    );
  });

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24);

  return (
    <PageShell
      title="Search"
      description={
        query
          ? `Showing matches for “${query}” across every published surface we index.`
          : "Search headlines, summaries, and tags—or browse a fresh slice of recent posts below."
      }
      actions={
        <form action="/search" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <input type="hidden" name="master" value="1" />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {task ? <input type="hidden" name="task" value={task} /> : null}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kp-forest)]/45" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Try a topic, author, or phrase…"
              className="h-12 rounded-full border-[var(--kp-forest)]/18 bg-white pl-10 text-[var(--kp-forest-deep)] shadow-sm placeholder:text-[var(--kp-forest)]/45"
            />
          </div>
          <Button
            type="submit"
            className="h-12 rounded-full bg-[var(--kp-forest)] px-8 text-white hover:bg-[var(--kp-forest-deep)]"
          >
            Search
          </Button>
        </form>
      }
    >
      {!query ? (
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-[var(--kp-forest)]/72">
          Tip: use quotes for exact phrases. Results respect the same filters as the rest of the site—nothing changes under the
          hood, only what you see here.
        </p>
      ) : null}

      {results.length ? (
        <div className="rounded-[2rem] border border-[var(--kp-forest)]/10 bg-white/80 p-4 shadow-[0_24px_70px_rgba(15,61,44,0.06)] sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--kp-forest)]/10 pb-4">
            <span className="text-sm font-semibold text-[var(--kp-forest-deep)]">
              {results.length} result{results.length === 1 ? "" : "s"}
            </span>
            <Link
              href="/articles"
              className="text-sm font-medium text-[var(--kp-forest)] underline-offset-4 hover:underline"
            >
              Browse articles
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => {
              const task = getPostTaskKey(post);
              const href = task ? buildPostUrl(task, post.slug) : `/posts/${post.slug}`;
              return <TaskPostCard key={post.id} post={post} href={href} />;
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-[var(--kp-forest)]/25 bg-white/70 px-6 py-16 text-center">
          <Search className="mx-auto h-10 w-10 text-[var(--kp-forest)]/35" />
          <p className="mt-4 text-lg font-semibold text-[var(--kp-forest-deep)]">No matching posts yet</p>
          <p className="mt-2 text-sm text-[var(--kp-forest)]/70">
            Try a shorter keyword, check spelling, or explore the latest stories on the homepage.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)]">
              <Link href="/articles">Go to articles</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full border-[var(--kp-forest)]/25">
              <Link href="/contact">Ask editorial</Link>
            </Button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
