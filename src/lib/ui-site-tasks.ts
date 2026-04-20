import { SITE_CONFIG } from '@/lib/site-config'
import type { TaskKey } from '@/lib/site-config'
import { getFactoryState } from '@/design/factory/get-factory-state'

/** Tasks shown in primary nav, homepage emphasis, and Create menu — driven by site recipe, not route availability. */
export function getEmphasizedSiteTasks() {
  const { recipe } = getFactoryState()
  const allowed = new Set<TaskKey>(recipe.enabledTasks)
  return SITE_CONFIG.tasks.filter((t) => t.enabled && allowed.has(t.key))
}

/** Enabled tasks that are intentionally de-emphasized but still reachable by URL (footer tools, etc.). */
export function getSuppressedSiteTasks() {
  const { recipe } = getFactoryState()
  const allowed = new Set<TaskKey>(recipe.enabledTasks)
  return SITE_CONFIG.tasks.filter((t) => t.enabled && !allowed.has(t.key))
}
