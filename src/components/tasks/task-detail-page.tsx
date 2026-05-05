import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowRight, Globe, Mail, MapPin, Phone, Tag } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { TaskImageCarousel } from "@/components/tasks/task-image-carousel";
import { ArticleComments } from "@/components/tasks/article-comments";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { TASK_DETAIL_PAGE_OVERRIDE_ENABLED, TaskDetailPageOverride } from "@/overrides/task-detail-page";
import { LightboxImage } from "@/components/shared/lightbox-image";

type PostContent = {
  category?: string;
  location?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  body?: string;
  excerpt?: string;
  author?: string;
  highlights?: string[];
  logo?: string;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

const absoluteUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${value}`;
};

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as PostContent;
};

const formatArticleHtml = (content: PostContent, post: SitePost) => {
  const raw =
    (typeof content.body === "string" && content.body.trim()) ||
    (typeof content.description === "string" && content.description.trim()) ||
    (typeof post.summary === "string" && post.summary.trim()) ||
    "";

  return formatRichHtml(raw, "Details coming soon.");
};

const getImageUrls = (post: SitePost, content: PostContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaImages = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url));
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const merged = [...mediaImages, ...contentImages];
  if (merged.length) return merged;
  if (isValidImageUrl(content.logo)) return [content.logo as string];
  return ["/placeholder.svg?height=900&width=1400"];
};

const toNumber = (value?: number | string) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildMapEmbedUrl = (
  latitude?: number | string,
  longitude?: number | string,
  address?: string
) => {
  const lat = toNumber(latitude);
  const lon = toNumber(longitude);
  const normalizedAddress = typeof address === "string" ? address.trim() : "";
  const googleMapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();

  if (googleMapsEmbedApiKey) {
    const query = lat !== null && lon !== null ? `${lat},${lon}` : normalizedAddress;
    if (!query) return null;
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      googleMapsEmbedApiKey
    )}&q=${encodeURIComponent(query)}`;
  }

  if (lat !== null && lon !== null) {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const bbox = `${left},${bottom},${right},${top}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  }

  if (normalizedAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`;
  }

  return null;
};

const InfoRow = ({
  icon: Icon,
  children,
}: {
  icon: typeof Globe;
  children: ReactNode;
}) => (
  <div className="flex items-start gap-3 rounded-2xl border border-[var(--kp-forest)]/12 bg-[var(--kp-mint)]/40 p-3 text-sm text-[var(--kp-forest)]/75">
    <Icon className="mt-0.5 h-4 w-4 text-[var(--kp-forest)]" />
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

export async function TaskDetailPage({ task, slug }: { task: TaskKey; slug: string }) {
  if (TASK_DETAIL_PAGE_OVERRIDE_ENABLED) {
    return await TaskDetailPageOverride({ task, slug });
  }

  const taskConfig = getTaskConfig(task);
  let post: SitePost | null = null;
  try {
    post = await fetchTaskPostBySlug(task, slug);
  } catch (error) {
    console.warn("Failed to load post detail", error);
  }

  if (!post) {
    notFound();
  }

  const content = getContent(post);
  const isArticle = task === "article";
  const category = content.category || post.tags?.[0] || taskConfig?.label || task;
  const description = content.description || post.summary || "Details coming soon.";
  const descriptionHtml = !isArticle ? formatRichHtml(description, "Details coming soon.") : "";
  const articleHtml = isArticle ? formatArticleHtml(content, post) : "";
  const articleSummary = post.summary || (typeof content.excerpt === "string" ? content.excerpt : "") || "";
  const articleAuthor =
    (typeof content.author === "string" && content.author.trim()) || post.authorName || "Editorial Team";
  const articleDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === "string") : [];
  const location = content.address || content.location;
  const images = getImageUrls(post, content);
  const mapEmbedUrl = buildMapEmbedUrl(content.latitude, content.longitude, location);
  const related = (await fetchTaskPosts(task, 6))
    .filter((item) => item.slug !== post.slug)
    .filter((item) => {
      if (!content.category) return true;
      const itemContent = getContent(item);
      return itemContent.category === content.category;
    })
    .slice(0, 3);
  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/articles"}/${post.slug}`;
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage);
  const articleSchema = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: articleSummary || description,
        image: articleImage ? [articleImage] : [],
        author: {
          "@type": "Person",
          name: articleAuthor,
        },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: postTags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      }
    : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl.replace(/\/$/, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: taskConfig?.label || "Posts",
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${taskConfig?.route || "/posts"}/${post.slug}`,
      },
    ],
  };
  const schemaPayload = articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema;

  if (isArticle) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,var(--kp-mint)_0%,#f7fdf9_28%,#ffffff_100%)]">
        <NavbarShell />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <SchemaJsonLd data={schemaPayload} />
          <Link
            href={taskConfig?.route || "/"}
            className="inline-flex items-center text-sm font-medium text-[var(--kp-forest)] hover:text-[var(--kp-forest-deep)]"
          >
            Back to {taskConfig?.label || "posts"}
          </Link>

          <section className="mt-6 overflow-hidden rounded-[2rem] border border-[var(--kp-forest)]/20 bg-[linear-gradient(135deg,var(--kp-forest)_0%,var(--kp-forest-deep)_56%,var(--kp-forest)_100%)] text-white shadow-[0_32px_90px_rgba(15,61,44,0.18)]">
            <div className="grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:px-10 lg:py-12">
              <div>
                <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
                  <Tag className="h-3.5 w-3.5" />
                  {category}
                </Badge>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  {post.title}
                </h1>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/82">
                  <span>By {articleAuthor}</span>
                </div>
                {articleSummary ? (
                  <p className="mt-6 max-w-2xl text-sm leading-7 text-white/84">{articleSummary}</p>
                ) : null}
              </div>
              <div className="rounded-[1.8rem] border border-white/14 bg-white/10 p-3 backdrop-blur-sm">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[1.4rem] bg-[#d9c7b8]">
                  <LightboxImage
                    src={images[0]}
                    alt={`${post.title} featured image`}
                    sizes="(max-width: 1024px) 100vw, 720px"
                    imageClassName="object-cover"
                    intrinsicWidth={1600}
                    intrinsicHeight={1100}
                    priority
                    hint="Open image"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-10 max-w-5xl">
            <div className="rounded-[1.85rem] border border-[var(--kp-forest)]/12 bg-white p-6 shadow-[0_18px_50px_rgba(15,61,44,0.07)] sm:p-8">
              {postTags.length ? (
                <div className="mb-6 flex flex-wrap gap-2">
                  {postTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-[var(--kp-forest)]/20 text-[var(--kp-forest)]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
              <RichContent
                html={articleHtml}
                className="article-content prose-p:my-6 prose-h2:my-8 prose-h3:my-6"
              />
              <ArticleComments slug={post.slug} />
            </div>

          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--kp-mint)_0%,#f7fdf9_28%,#ffffff_100%)]">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaPayload} />
        <Link
          href={taskConfig?.route || "/"}
          className="inline-flex items-center text-sm font-medium text-[var(--kp-forest)] hover:text-[var(--kp-forest-deep)]"
        >
          Back to {taskConfig?.label || "posts"}
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2rem] border border-[var(--kp-forest)]/20 bg-[linear-gradient(135deg,var(--kp-forest)_0%,var(--kp-forest-deep)_56%,var(--kp-forest)_100%)] p-6 text-white shadow-[0_30px_90px_rgba(15,61,44,0.18)] sm:p-8">
            <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
              <Tag className="h-3.5 w-3.5" />
              {category}
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{post.title}</h1>
            {location ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm text-white/88">
                <MapPin className="h-4 w-4" />
                {location}
              </div>
            ) : null}
            <div className="mt-6 max-w-2xl text-sm leading-7 text-white/84">
              <RichContent html={descriptionHtml} />
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {content.website ? (
                <Button asChild className="rounded-full bg-white text-[#6f4336] hover:bg-[#faeee2]">
                  <a href={content.website} target="_blank" rel="noreferrer">
                    Visit website
                  </a>
                </Button>
              ) : null}
              {content.email ? (
                <Button asChild variant="outline" className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/16">
                  <a href={`mailto:${content.email}`}>Email now</a>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--kp-forest)]/12 bg-white p-4 shadow-[0_18px_50px_rgba(15,61,44,0.07)]">
            <TaskImageCarousel images={images} />
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            {content.highlights?.length ? (
              <div className="rounded-[1.85rem] border border-[var(--kp-forest)]/12 bg-white p-6 shadow-[0_16px_45px_rgba(15,61,44,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--kp-forest)]/75">Highlights</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--kp-forest)]/78">
                  {content.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--kp-forest)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-[1.85rem] border border-[var(--kp-forest)]/12 bg-white p-6 shadow-[0_16px_45px_rgba(15,61,44,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--kp-forest)]/75">About this {taskConfig?.label?.toLowerCase() || "post"}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--kp-forest)]/78">
                The layout now gives the gallery, headline, and trust details their own rhythm, so the page feels more like a designed showcase than a stacked utility page.
              </p>
            </div>

            {related.length ? (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--kp-forest-deep)]">More in {category}</h2>
                  {taskConfig?.route ? (
                    <Link href={taskConfig.route} className="text-sm font-medium text-[var(--kp-forest)] hover:text-[var(--kp-forest-deep)]">
                      Browse all
                    </Link>
                  ) : null}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {related.map((item) => (
                    <TaskPostCard
                      key={item.id}
                      post={item}
                      href={buildPostUrl(task, item.slug)}
                      taskKey={task}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[1.85rem] border border-[var(--kp-forest)]/12 bg-white p-5 shadow-[0_16px_45px_rgba(15,61,44,0.05)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--kp-forest)]/75">Quick details</p>
              <div className="mt-4 space-y-3">
                {content.website ? (
                  <InfoRow icon={Globe}>
                    <a href={content.website} className="break-all text-[var(--kp-forest-deep)] hover:underline" target="_blank" rel="noreferrer">
                      {content.website}
                    </a>
                  </InfoRow>
                ) : null}
                {content.phone ? (
                  <InfoRow icon={Phone}>
                    <span className="text-[var(--kp-forest-deep)]">{content.phone}</span>
                  </InfoRow>
                ) : null}
                {content.email ? (
                  <InfoRow icon={Mail}>
                    <a href={`mailto:${content.email}`} className="break-all text-[var(--kp-forest-deep)] hover:underline">
                      {content.email}
                    </a>
                  </InfoRow>
                ) : null}
                {location ? (
                  <InfoRow icon={MapPin}>
                    <span className="text-[var(--kp-forest-deep)]">{location}</span>
                  </InfoRow>
                ) : null}
              </div>
            </div>

            {mapEmbedUrl ? (
              <div className="rounded-[1.85rem] border border-[var(--kp-forest)]/12 bg-white p-4 shadow-[0_16px_45px_rgba(15,61,44,0.05)]">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--kp-forest)]/75">Location map</p>
                <div className="mt-3 overflow-hidden rounded-[1.35rem] border border-[var(--kp-forest)]/12">
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-64 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

            <div className="rounded-[1.85rem] border border-[var(--kp-forest)]/12 bg-[var(--kp-mint)]/40 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--kp-forest)]/75">Related links</p>
              <ul className="mt-4 space-y-3 text-sm text-[var(--kp-forest)]/75">
                {related.map((item) => (
                  <li key={`link-${item.id}`}>
                    <Link href={buildPostUrl(task, item.slug)} className="inline-flex items-center gap-2 hover:text-[var(--kp-forest-deep)]">
                      <ArrowRight className="h-4 w-4 text-[var(--kp-forest)]" />
                      {item.title}
                    </Link>
                  </li>
                ))}
                {taskConfig?.route ? (
                  <li>
                    <Link href={taskConfig.route} className="inline-flex items-center gap-2 hover:text-[var(--kp-forest-deep)]">
                      <ArrowRight className="h-4 w-4 text-[var(--kp-forest)]" />
                      Browse all {taskConfig.label}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
