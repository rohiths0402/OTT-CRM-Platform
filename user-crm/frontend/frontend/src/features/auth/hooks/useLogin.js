import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, requestPasswordReset } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const ROLE_REDIRECTS = {
  super_admin: '/super-admin',
  admin: '/admin',
  employee: '/employee',
}

export function useLogin() {
  const navigate = useNavigate()
  const { setAuthenticatedUser } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('info')

  const notify = (message, type = 'info') => {
    setNotice(message)
    setNoticeType(type)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setNotice('')
    setLoading(true)

    try {
      const result = await login({ email: email.trim(), password, remember })
      const authenticatedUser = result.user || {
        id: result.id,
        email: result.email || email.trim(),
        role: result.role,
      }
      const role = String(authenticatedUser.role || '').toLowerCase()
      const destination = ROLE_REDIRECTS[role]

      if (!destination) {
        notify('Your account role is not recognized. Please contact your administrator.', 'error')
        return
      }

      setAuthenticatedUser({ ...authenticatedUser, role })
      navigate(destination, { replace: true })
    } catch (error) {
      notify(error.message || 'Unable to sign in. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      notify('Enter your work email first to request a password reset.', 'error')
      return
    }

    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      notify('If an account exists for this email, password reset instructions will be sent.')
    } catch (error) {
      notify(error.message || 'Unable to process the password reset request.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    remember, setRemember,
    loading, notice, noticeType,
    handleSubmit, handleForgotPassword,
  }
}