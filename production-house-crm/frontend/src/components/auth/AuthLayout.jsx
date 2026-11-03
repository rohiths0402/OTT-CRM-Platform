import React from "react";
import { Clapperboard, CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";
import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-overlay" />

        <Link to="/login" className="auth-brand">
          <span className="auth-brand-icon">
            <Clapperboard size={21} />
          </span>
          <span>PRODUCTION HOUSE CRM</span>
        </Link>

        <div className="auth-visual-content">
          <span className="auth-eyebrow">YOUR PRODUCTION WORKSPACE</span>

          <h1>Where Stories Become Cinema.</h1>

          <p>
            One powerful platform to manage productions, OTT projects,
            creative teams and cinematic experiences.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <Clapperboard size={18} />
              <span>OTT Project Management</span>
            </div>

            <div className="auth-feature">
              <CalendarDays size={18} />
              <span>Production Planning</span>
            </div>

            <div className="auth-feature">
              <Users size={18} />
              <span>Creative Team Coordination</span>
            </div>
          </div>
        </div>

        <div className="auth-visual-footer">
          POWERING THE FUTURE OF FILM PRODUCTION
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-container">{children}</div>
      </section>
    </div>
  );
}