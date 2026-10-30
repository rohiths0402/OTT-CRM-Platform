
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import LoginForm from '../components/LoginForm'
import './loginPage.css'

function Brand() {
  return (
    <a href="/" className="loop-brand" aria-label="Loop User CRM">
      <span className="brand-symbol">
        <span className="brand-symbol-inner">
          <span className="brand-symbol-dot" />
        </span>
      </span>

      <span className="brand-copy">
        <span className="brand-name">
          loop<span>.</span>
        </span>
        <span className="brand-caption">USER CRM</span>
      </span>
    </a>
  )
}

function LoginIntro() {
  return (
    <section className="login-intro">
      <p className="intro-eyebrow">
        A BETTER WAY TO UNDERSTAND YOUR AUDIENCE
      </p>

     <h1 className="intro-title">
        Make every user
        <span className="intro-title-highlight">
          relationship count.
        </span>
      </h1>

      <p className="intro-description">
        The people using your platform are more than numbers.
        Loop brings their activity and engagement into one clear workspace.
      </p>

      <div className="intro-detail">
        

        <div>
          <h3>One focused view of your users</h3>
          <p>
            Follow engagement, understand activity and make informed
            decisions from one place.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-shell">

        <header className="login-header">
          <Brand />

          <div className="secure-label">
            <span className="secure-indicator" />
            PRIVATE TEAM WORKSPACE
          </div>
        </header>

        <div className="login-layout">
          <LoginIntro />

          <section className="login-column">
            <div className="login-panel">
              <LoginForm />

              <div className="login-panel-footer">
                Access is provided by your organization's
                Super Admin or Admin.
              </div>
            </div>

            <p className="login-security">
              <ShieldCheck size={14} />
              PRIVATE AND SECURE WORKSPACE
            </p>
          </section>
        </div>

      </div>
    </main>
  )
}
