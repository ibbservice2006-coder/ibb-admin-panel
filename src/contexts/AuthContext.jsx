import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Demo credentials
const DEMO_USERS = [
  {
    id: 1,
    email: 'admin@ibbshuttle.com',
    password: 'admin1234',
    name: 'IBB Admin',
    role: 'admin',
    avatar: null,
  },
  {
    id: 2,
    email: 'manager@ibbshuttle.com',
    password: 'manager1234',
    name: 'IBB Manager',
    role: 'manager',
    avatar: null,
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('ibb_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('ibb_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Find matching demo user
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (found) {
      const userData = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar,
      }
      setUser(userData)
      localStorage.setItem('ibb_user', JSON.stringify(userData))
      return { success: true }
    }

    return {
      success: false,
      error: 'Email or password incorrect, please try again',
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ibb_user')
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
