import { FormEvent, useState } from "react"

export type AuthUser = {
  name: string
  firstName?: string
  lastName?: string
  email: string
  telephone?: string
  address?: string
  role: "client" | "partner"
  district?: string
  town?: string
  gender?: string
  salonName?: string
}

export default function LoginPage({
  user,
  favoritesCount,
  onLogin,
  onLogout,
}: {
  user: AuthUser | null
  favoritesCount: number
  onLogin: (user: AuthUser) => void
  onLogout: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showAdminContact, setShowAdminContact] = useState(false)

  const [resetMode, setResetMode] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(
        "Please enter a valid email address. Customers and salon owners must log in using their email.",
      )
      return
    }
    const isTestAdmin = trimmed.toLowerCase() === "admin@gmail.com"
    if (isTestAdmin) {
      if (password !== "12345") {
        setError("Invalid password for admin@gmail.com. Use 12345 for testing.")
        return
      }
      setError("")
      setSubmitting(true)
      window.setTimeout(() => {
        onLogin({
          name: "Admin",
          email: "admin@gmail.com",
          role: "partner",
          district: "Colombo",
          salonName: "Ceylon Cutz Administration",
        })
        setSubmitting(false)
      }, 280)
      return
    }
    if (password.length <= 8) {
      setError("Please enter a password longer than 8 characters (at least 9 characters).")
      return
    }
    setError("")
    setSubmitting(true)
    window.setTimeout(() => {
      const isPartnerEmail =
        trimmed.startsWith("salon") ||
        trimmed.startsWith("studio") ||
        trimmed.includes("partner")
      const rawName = trimmed
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
      onLogin({
        name: rawName,
        email: trimmed,
        role: isPartnerEmail ? "partner" : "client",
        district: "Colombo",
        salonName: isPartnerEmail ? "Bloom Hair & Beauty Studio" : undefined,
      })
      setSubmitting(false)
    }, 280)
  }

  const handleResetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!resetEmail.trim() || !resetEmail.includes("@")) {
      setError("Please enter a valid email address to receive a reset link.")
      return
    }
    setError("")
    setResetSent(true)
  }

  return (
    <main className="products-main auth-main" id="login-content" tabIndex={-1}>
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">Home</a>
        <span>/</span>
        <span aria-current="page">Log in</span>
      </nav>

      <div className="auth-stage">
        <aside className="auth-editorial" aria-label="Ceylon Cutz member benefits">
          <div>
            <h1>
              Welcome back to <span>Ceylon Cutz.</span>
            </h1>
            <p>
              Sign in to access your saved salons, book appointments, order your
              favorite salon products, and keep your hair and beauty preferences
              ready across Sri Lanka.
            </p>
          </div>

          <ul className="auth-highlights">
            <li>
              <span className="auth-highlight-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" />
                </svg>
              </span>
              <div>
                <strong>Your Personal Shortlist</strong>
                <span>
                  Keep your favorite salons close to you and receive the latest
                  promotions.
                </span>
              </div>
            </li>
            <li>
              <span className="auth-highlight-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4" />
                </svg>
              </span>
              <div>
                <strong>Book Salon Appointments</strong>
                <span>
                  Schedule your next haircut, styling, or beauty treatment with
                  ease.
                </span>
              </div>
            </li>
            <li>
              <span className="auth-highlight-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8h12l-1 12H7L6 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2M10 13h4" />
                </svg>
              </span>
              <div>
                <strong>Order Your Favorite Beauty Products</strong>
                <span>
                  Buy authentic salon products available at partner salons
                  across Sri Lanka.
                </span>
              </div>
            </li>
            <li>
              <span className="auth-highlight-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                  <path d="M2.5 10h19M6.5 15h4M14.5 15h3" />
                </svg>
              </span>
              <div>
                <strong>Don&apos;t worry about cash</strong>
                <span>
                  Registered users can conveniently pay using their credit or
                  debit cards.
                </span>
              </div>
            </li>
          </ul>

          <div
            className="auth-editorial-footer"
            style={{
              paddingTop: "1px",
              paddingRight: "0px",
              paddingBottom: "0px",
              paddingLeft: "0px",
            }}
          >
            <span className="auth-country-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Made for SRI LANKA
            </span>
            <a href="#register" className="auth-switch-inline">
              <br />
            </a>
          </div>
        </aside>

        <section className="auth-card" aria-label="Sign in form">
          {user ? (
            <div className="auth-success-view" role="status" aria-live="polite">
              <span className="auth-eyebrow">SIGNED IN</span>
              <div className="auth-avatar" aria-hidden="true">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <h2>Hello, {user.name}</h2>
              <p className="auth-user-meta">
                {user.email} ·{" "}
                <span>
                  {user.role === "partner" ? "Salon Partner" : "Client Account"}
                </span>
              </p>
              <div className="auth-stat-row">
                <div className="auth-stat-box">
                  <strong>{favoritesCount}</strong>
                  <span>Saved Salons</span>
                </div>
                <div className="auth-stat-box">
                  <strong>{user.district ?? "Colombo"}</strong>
                  <span>Home District</span>
                </div>
              </div>
              <div className="auth-quick-actions">
                <a href="#salons" className="primary-button auth-full-button">
                  Explore Salons
                </a>
                <a href="#favorites" className="auth-secondary-button">
                  View My Favorite ({favoritesCount})
                </a>
                <button
                  type="button"
                  className="auth-text-button"
                  onClick={onLogout}
                >
                  Sign out of this account
                </button>
              </div>
            </div>
          ) : resetMode ? (
            <div className="auth-form-wrap">
              <div className="auth-card-header">
                <span className="auth-eyebrow">ACCOUNT RECOVERY</span>
                <h2>Reset your password</h2>
                <p>
                  Enter the email linked to your Ceylon Cutz profile and we will
                  send a password reset link.
                </p>
              </div>

              {resetSent ? (
                <div className="auth-notice-box" role="status">
                  <strong>Reset link sent</strong>
                  <p>
                    If an account exists for <b>{resetEmail}</b>, a recovery
                    instructions link has been sent to your inbox.
                  </p>
                  <button
                    type="button"
                    className="primary-button auth-full-button"
                    onClick={() => {
                      setResetMode(false)
                      setResetSent(false)
                      setError("")
                    }}
                  >
                    Return to Log in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="auth-form" noValidate>
                  {error && (
                    <p className="auth-error" role="alert">
                      {error}
                    </p>
                  )}
                  <label className="auth-field">
                    <span>Email Address</span>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="tharindurangana@gmail.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                  <button type="submit" className="primary-button auth-full-button">
                    Send recovery link
                  </button>
                  <button
                    type="button"
                    className="auth-text-button"
                    onClick={() => {
                      setResetMode(false)
                      setError("")
                    }}
                  >
                    ← Back to Log in
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="auth-form-wrap">
              <div className="auth-card-header">
                <h2>Log in to your account</h2>
                <p>
                  Both customers and salon owners sign in here using their
                  registered email address.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                <label className="auth-field">
                  <span>Email </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tharindurangana@gmail.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="auth-field">
                  <span>Password</span>
                  <div className="auth-password-box">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <div className="auth-Utility-row">
                  <label className="auth-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => {
                      setResetMode(true)
                      setResetEmail(email.includes("@") ? email : "")
                      setError("")
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="primary-button auth-full-button"
                  disabled={submitting}
                >
                  {submitting ? "Signing in…" : "Log in to Ceylon Cutz"}
                </button>
              </form>

              <div className="auth-card-footer">
                <span>New to Ceylon Cutz?</span>
                <a href="#register">Create a new account →</a>
              </div>

              <div className="auth-admin-banner">
                <div className="auth-admin-banner-top">
                  <span className="auth-admin-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5" />
                    </svg>
                  </span>
                  <div>
                    <strong>Are you a Salon Owner?</strong>
                    <p>
                      Salon owners log in using this same page. To register a
                      new salon on Ceylon Cutz, please contact the Ceylon Cutz
                      Administrator.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="auth-admin-toggle"
                  onClick={() => setShowAdminContact((prev) => !prev)}
                  aria-expanded={showAdminContact}
                >
                  {showAdminContact
                    ? "Hide Admin Contact Details"
                    : "Contact Ceylon Cutz Admin →"}
                </button>
                {showAdminContact && (
                  <div className="auth-admin-details">
                    <span>
                      <strong>Admin Email:</strong> admin@ceyloncutz.lk
                    </span>
                    <span>
                      <strong>Partner Desk:</strong> +94 11 234 5678 (Mon–Sat,
                      9:00 AM – 6:00 PM)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
