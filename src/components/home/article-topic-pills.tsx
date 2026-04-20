'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const TOPICS = [
  { label: 'All', slug: 'all' },
  { label: 'Marketing', slug: 'blog' },
  { label: 'Technology', slug: 'technology' },
  { label: 'SEO', slug: 'digital' },
] as const

export function ArticleTopicPills({ className }: { className?: string }) {
  const searchParams = useSearchParams()
  const active = searchParams.get('category') || 'all'

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {TOPICS.map(({ label, slug }) => {
        const isActive = slug === 'all' ? active === 'all' || !searchParams.get('category') : active === slug
        const href = slug === 'all' ? '/articles' : `/articles?category=${slug}`
        return (
          <Link
            key={slug}
            href={href}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
              isActive
                ? 'bg-[var(--kp-forest)] text-white shadow-[0_8px_24px_rgba(15,77,58,0.25)]'
                : 'bg-white/90 text-[var(--kp-forest)] shadow-sm ring-1 ring-[var(--kp-forest)]/15 hover:bg-[var(--kp-mint)]'
            )}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
