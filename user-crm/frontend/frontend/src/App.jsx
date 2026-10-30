import AppRoutes from './app/route'
import { AuthProvider } from './features/auth/context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}