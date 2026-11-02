
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { mockLogin } from '../services/mockAuth'
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

    if (loading) return

    setLoading(true)

    try {
      const result = await mockLogin({
        email,
        password,
      })

      const authenticatedUser = result.user
      const role = String(authenticatedUser.role || '')
        .trim()
        .toLowerCase()
        .replaceAll('-', '_')
        .replaceAll(' ', '_')

      const destination = ROLE_REDIRECTS[role]

      if (!destination) {
        notify('Account role is not recognized.', 'error')
        return
      }

      setAuthenticatedUser({
        ...authenticatedUser,
        role,
      })

      // Demo authentication only
      sessionStorage.setItem(
        'loopDemoUser',
        JSON.stringify({
          ...authenticatedUser,
          role,
        })
      )

      navigate(destination, { replace: true })
    } catch (error) {
      notify(error.message || 'Unable to sign in.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    notify(
      'Password reset is unavailable in demo mode.',
      'info'
    )
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    remember,
    setRemember,
    loading,
    notice,
    noticeType,
    handleSubmit,
    handleForgotPassword,
  }
}
