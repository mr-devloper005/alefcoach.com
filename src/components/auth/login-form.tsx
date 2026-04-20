'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

export function LoginForm({
  actionClassName,
  inputClassName,
}: {
  actionClassName: string
  inputClassName: string
}) {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('Enter email and password.')
      return
    }
    try {
      await login(email.trim(), password)
      router.push('/articles')
      router.refresh()
    } catch {
      setError('Sign-in failed. Try again.')
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
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
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={cn('h-12 rounded-xl border px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--kp-forest)]/25', inputClassName)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading} className={cn('inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold disabled:opacity-60', actionClassName)}>
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
