
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

const AuthContext = createContext(null)

function getStoredUser() {
  try {
    const storedUser = sessionStorage.getItem('loopDemoUser')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const value = useMemo(
    () => ({
      user,

      setAuthenticatedUser: (newUser) => {
        setUser(newUser)
      },

      clearAuthenticatedUser: () => {
        sessionStorage.removeItem('loopDemoUser')
        localStorage.removeItem('loopAccessToken')
        localStorage.removeItem('loopRefreshToken')
        setUser(null)
      },
    }),
    [user]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
