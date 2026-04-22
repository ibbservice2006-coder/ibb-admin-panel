import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Bus, Eye, EyeOff, Copy } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { user, login } = useAuth()

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = login(email, password)

    if (!result.success) {
      setError(result.error)
    }

    setLoading(false)
  }

  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail('admin@ibbshuttle.com')
      setPassword('admin1234')
    } else {
      setEmail('manager@ibbshuttle.com')
      setPassword('manager1234')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20">
              <Bus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">IBB Shuttle</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Panel</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center">Log in</CardTitle>
            <CardDescription className="text-center">
              Enter Email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ibbshuttle.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </Button>
            </form>

            {/* Demo Credentials Box */}
            <div className="mt-6 p-4 bg-muted/60 rounded-lg border border-dashed">
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                Demo Credentials — Click to auto-fill
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin')}
                  className="w-full text-left p-2 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">👑 Admin</p>
                      <p className="text-xs text-muted-foreground font-mono">admin@ibbshuttle.com</p>
                      <p className="text-xs text-muted-foreground font-mono">admin1234</p>
                    </div>
                    <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('manager')}
                  className="w-full text-left p-2 rounded-md hover:bg-background transition-colors border border-transparent hover:border-border group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">🏢 Manager</p>
                      <p className="text-xs text-muted-foreground font-mono">manager@ibbshuttle.com</p>
                      <p className="text-xs text-muted-foreground font-mono">manager1234</p>
                    </div>
                    <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
