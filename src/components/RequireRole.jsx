import { useAuth } from '@/contexts/AuthContext'
import { ShieldAlert } from 'lucide-react'

// Role hierarchy — higher index = higher privilege
const ROLE_LEVELS = { manager: 1, admin: 2, superadmin: 3 }

/**
 * RequireRole — blocks rendering if user's role is below required level.
 *
 * Usage:
 *   <RequireRole role="superadmin">
 *     <SensitivePage />
 *   </RequireRole>
 */
export function RequireRole({ role, children }) {
  const { user } = useAuth()

  const userLevel     = ROLE_LEVELS[user?.role] ?? 0
  const requiredLevel = ROLE_LEVELS[role] ?? 99

  if (userLevel < requiredLevel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="p-4 rounded-full bg-red-50">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          This tool requires <span className="font-semibold capitalize">{role}</span> role.
          Your current role is <span className="font-semibold capitalize">{user?.role ?? 'unknown'}</span>.
        </p>
      </div>
    )
  }

  return children
}
