'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--kp-mint)] text-[var(--kp-ink)]">
      <NavbarShell />
      <main>
        <section className="relative overflow-hidden border-b border-[var(--kp-forest)]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(232,245,239,0.5)_100%)] backdrop-blur-[2px]">
          <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-[var(--kp-lemon)]/25 blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-40 rounded-full bg-[var(--kp-forest)]/8" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-[var(--kp-forest-deep)] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                  {title}
                </h1>
                {description && (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--kp-forest)]/78">{description}</p>
                )}
              </div>
              {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-3">{actions}</div>}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">{children}</section>
      </main>
      <Footer />
    </div>
  )
}
