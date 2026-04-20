'use client'

import Link from 'next/link'
import { ChevronDown, LayoutGrid, LogOut, Plus, User, FileText, Building2, Tag, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'
import type { TaskKey } from '@/lib/site-config'
import { getEmphasizedSiteTasks } from '@/lib/ui-site-tasks'

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

export function NavbarAuthControls() {
  const { user, logout } = useAuth()
  const createTasks = getEmphasizedSiteTasks()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="hidden h-10 gap-1 rounded-full bg-[var(--kp-forest)] px-4 text-white shadow-[0_14px_32px_rgba(15,61,44,0.28)] hover:bg-[var(--kp-forest-deep)] sm:flex">
            <Plus className="h-4 w-4" />
            Create
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-[var(--kp-forest)]/12 bg-white/95 backdrop-blur-sm">
          {createTasks.map((task) => {
            const Icon = taskIcons[task.key] || LayoutGrid
            return (
              <DropdownMenuItem key={task.key} asChild>
                <Link href={`/create/${task.key}`}>
                  <Icon className="mr-2 h-4 w-4" />
                  Create {task.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full text-[var(--kp-forest)]/75 hover:bg-[var(--kp-mint)] hover:text-[var(--kp-forest-deep)]">
            <Avatar className="h-9 w-9 border border-[var(--kp-forest)]/15">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Account menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 border-[var(--kp-forest)]/12 bg-white/95 p-0 backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-[var(--kp-forest)]/10 p-3">
            <Avatar className="h-10 w-10 border border-[var(--kp-forest)]/15">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user?.name}</span>
              <span className="block truncate text-xs text-[var(--kp-forest)]/60">{user?.email}</span>
            </div>
          </div>
          <div className="p-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center gap-2 rounded-full border-[var(--kp-forest)]/25 bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)] hover:text-white"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
