
import { useLogin } from '../hooks/useLogin'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'

import './login.css'

export default function LoginForm() {
  const {
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
  } = useLogin()

  return (
    <>
      <div className="login-heading">
        <p className="login-eyebrow">WELCOME BACK</p>

        <h2>Sign in to Loop</h2>

        <p className="login-subtitle">
          Enter your work credentials to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">

        {/* Email field */}
        <div className="form-field">
          <label htmlFor="email">Work email</label>

          <div className="login-input-wrap">
            <Mail size={17} className="input-icon" />

            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div className="form-field">

          <div className="password-label-row">
            <label htmlFor="password">Password</label>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="forgot-button"
            >
              Forgot password?
            </button>
          </div>

          <div className="login-input-wrap">
            <LockKeyhole size={17} className="input-icon" />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              aria-label={
                showPassword ? 'Hide password' : 'Show password'
              }
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label className="remember-row">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <span>Remember me</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="login-submit"
        >
          <span>
            {loading ? 'Signing in...' : 'Sign in'}
          </span>

          {!loading && <ArrowRight size={17} />}
        </button>

        {/* API feedback */}
        {notice && (
          <p
            role="status"
            aria-live="polite"
            className={`login-notice ${noticeType}`}
          >
            {notice}
          </p>
        )}

      </form>
    </>
  )
}
