import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";
import logo from "../logo.jpeg";

const CATEGORIES = [
  "Politics",
  "Sports",
  "Technology",
  "Entertainment",
  "Business",
  "Health",
  "World",
  "Local",
];

export default function Header() {
  const { lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedDate = new Date().toLocaleDateString(
    lang === "hi" ? "hi-IN" : "en-IN",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <header className="site-header">
      <div className="top-bar">
        <div className="container top-inner">
          <Link to="/" className="brand top-brand">
            <img
              src={logo}
              alt="Ham Hai Na Logo"
              className="brand-logo"
              style={{
                width: 45,
                height: 45,
                objectFit: "contain",
                borderRadius: 4,
              }}
            />
            <div>
              <div className="brand-hi">हम है ना</div>
              <div className="brand-en">HAM HAI NA</div>
            </div>
          </Link>
          <span className="top-date">{formattedDate}</span>
          <div className="top-actions">
            <div className="lang-toggle invert">
              <button
                className={lang === "en" ? "active" : ""}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button
                className={lang === "hi" ? "active" : ""}
                onClick={() => setLang("hi")}
              >
                हिं
              </button>
            </div>
            {user ? (
              <div className="auth-links">
                <Link to="/admin">Dashboard</Link>
                <button
                  className="ghost-btn"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="admin-link">
                Admin
              </Link>
            )}
            <button
              className="hamburger"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className="nav-row">
        <div className="container nav-inner">
          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              {lang === "hi" ? "होम" : "Home"}
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                onClick={() => setMenuOpen(false)}
              >
                {lang === "hi" ? getCatHi(cat) : cat}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

const getCatHi = (c) =>
  ({
    Politics: "राजनीति",
    Sports: "खेल",
    Technology: "तकनीक",
    Entertainment: "मनोरंजन",
    Business: "व्यापार",
    Health: "स्वास्थ्य",
    World: "विश्व",
    Local: "स्थानीय",
  })[c] || c;
