import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ibb_admin_token')
    const savedUser = localStorage.getItem('ibb_user')
    if (token && savedUser) {
      try {
        // Check JWT expiry before trusting localStorage
        const payload = JSON.parse(atob(token.split('.')[1]))
        const isExpired = payload.exp && Date.now() / 1000 > payload.exp
        if (isExpired) {
          localStorage.removeItem('ibb_admin_token')
          localStorage.removeItem('ibb_user')
        } else {
          setUser(JSON.parse(savedUser))
        }
      } catch {
        localStorage.removeItem('ibb_user')
        localStorage.removeItem('ibb_admin_token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password)
      const { token } = res.data

      // Decode payload (JWT is not verified client-side, just parsed)
      const payload = JSON.parse(atob(token.split('.')[1]))

      const userData = {
        id:    payload.sub,
        name:  payload.fullName,
        email: payload.email,
        role:  payload.role,
        avatar: null,
      }

      localStorage.setItem('ibb_admin_token', token)
      localStorage.setItem('ibb_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      const status = err.response?.status
      if (status === 401) {
        return { success: false, error: 'Email or password incorrect, please try again' }
      }
      return { success: false, error: 'Cannot connect to server, please try again' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ibb_user')
    localStorage.removeItem('ibb_admin_token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
