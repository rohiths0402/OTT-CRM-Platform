import React from "react";
import { Bell, Menu } from "lucide-react";
import "./Header.css";

function Header({ onMenuClick }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="mobile-menu"
          onClick={onMenuClick}
          type="button"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-title">
          <h2>Production Workspace</h2>
          <p>Manage your production operations</p>
        </div>
      </div>

      <div className="header-right">
      </div>
    </header>
  );
}

export default Header;