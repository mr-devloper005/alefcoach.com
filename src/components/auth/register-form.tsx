'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

export function RegisterForm({
  actionClassName,
  inputClassName,
}: {
  actionClassName: string
  inputClassName: string
}) {
  const { signup, isLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim() || !password) {
      setError('Fill in name, email, and password.')
      return
    }
    try {
      await signup(name.trim(), email.trim(), password)
      router.push('/articles')
      router.refresh()
    } catch {
      setError('Could not create account. Try again.')
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <input
        name="name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={cn('h-12 rounded-xl border px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-forest)]/25', inputClassName)}
        placeholder="Full name"
      />
      <input
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn('h-12 rounded-xl border px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-forest)]/25', inputClassName)}
        placeholder="Email address"
      />
      <input
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={cn('h-12 rounded-xl border px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-forest)]/25', inputClassName)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading} className={cn('inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold disabled:opacity-60', actionClassName)}>
        {isLoading ? 'Creating…' : 'Create account'}
      </button>
    </form>
  )
}
