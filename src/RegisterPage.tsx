import { FormEvent, useMemo, useState } from "react"
import type { AuthUser } from "./LoginPage"

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Ratnapura",
  "Kegalle",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
]

export default function RegisterPage({
  user,
  onRegister,
  onLogout,
}: {
  user: AuthUser | null
  onRegister: (user: AuthUser) => void
  onLogout: () => void
}) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [telephone, setTelephone] = useState("")
  const [address, setAddress] = useState("")
  const [district, setDistrict] = useState("Colombo")
  const [town, setTown] = useState("")
  const [gender, setGender] = useState("Female")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showAdminContact, setShowAdminContact] = useState(false)

  const passwordChecks = useMemo(() => {
    const lengthOk = password.length > 8
    const caseOk = /[a-z]/.test(password) && /[A-Z]/.test(password)
    const numberOk = /\d/.test(password)
    const symbolOk = /[^A-Za-z0-9]/.test(password)
    const score = [lengthOk, caseOk, numberOk, symbolOk].filter(Boolean).length
    const label =
      password.length === 0
        ? "Enter a password"
        : !lengthOk
          ? "Too short (needs 9+ chars)"
        : score <= 1
          ? "Weak"
          : score === 2
            ? "Fair"
            : score === 3
              ? "Good"
              : "Strong"
    return { lengthOk, caseOk, numberOk, symbolOk, score, label }
  }, [password])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!firstName.trim()) {
      setError("Please enter your first name.")
      return
    }
    if (!lastName.trim()) {
      setError("Please enter your last name.")
      return
    }
    if (!telephone.trim()) {
      setError("Please enter your telephone number.")
      return
    }
    if (!address.trim()) {
      setError("Please enter your residential address.")
      return
    }
    if (!district.trim()) {
      setError("Please select your district.")
      return
    }
    if (!town.trim()) {
      setError("Please enter your town.")
      return
    }
    if (!gender.trim()) {
      setError("Please select your gender.")
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.")
      return
    }
    if (password.length <= 8) {
      setError("Password must be longer than 8 characters (at least 9 characters).")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.")
      return
    }
    if (!acceptTerms) {
      setError("Please agree to the Ceylon Cutz Terms & Privacy Notice.")
      return
    }
    setError("")
    setSubmitting(true)
    window.setTimeout(() => {
      const fullName = `${firstName.trim()} ${lastName.trim()}`
      onRegister({
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        address: address.trim(),
        district,
        town: town.trim(),
        gender,
        role: "client",
      })
      setSubmitting(false)
    }, 280)
  }

  return (
    <main
      className="products-main auth-main"
      id="register-content"
      tabIndex={-1}
    >
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">Home</a>
        <span>/</span>
        <span aria-current="page">Register</span>
      </nav>

      <div className="auth-stage">
        <aside
          className="auth-editorial"
          aria-label="Why join Ceylon Cutz"
        >
          <div>
            <h1>
              Your style. <span>Your way.</span>
            </h1>
            <p>
              Create your personal Ceylon Cutz profile to discover top-rated Sri
              Lankan salons, book appointments, order authentic beauty products,
              and enjoy cashless payments.
            </p>
          </div>

          <div className="auth-step-cards">
            <div className="auth-step-card">
              <span className="auth-step-number">01</span>
              <div>
                <strong>Complete your personal details</strong>
                <span>
                  Add your name, contact number, gender, and email so salons can
                  reach you effortlessly.
                </span>
              </div>
            </div>
            <div className="auth-step-card">
              <span className="auth-step-number">02</span>
              <div>
                <strong>Set your address, district &amp; town</strong>
                <span>
                  Discover nearby salons and arrange product deliveries across
                  Sri Lanka.
                </span>
              </div>
            </div>
            <div className="auth-step-card">
              <span className="auth-step-number">03</span>
              <div>
                <strong>Log in with your email anytime</strong>
                <span>
                  Use your registered email and secure password to access Ceylon
                  Cutz on any device.
                </span>
              </div>
            </div>
          </div>

          <div className="auth-admin-banner">
            <div className="auth-admin-banner-top">
              <span className="auth-admin-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5" />
                </svg>
              </span>
              <div>
                <strong>Salon Owner Registration</strong>
                <p>
                  Want to register your salon on Ceylon Cutz? Salon accounts are
                  verified and created by the Ceylon Cutz Administrator. Once
                  approved, salon owners sign in through the standard Log in
                  page.
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
                : "How to contact Ceylon Cutz Admin →"}
            </button>
            {showAdminContact && (
              <div className="auth-admin-details">
                <span>
                  <strong>Admin Email:</strong> admin@ceyloncutz.lk
                </span>
                <span>
                  <strong>Partner Hotline:</strong> +94 11 234 5678
                </span>
              </div>
            )}
          </div>

          <div className="auth-editorial-footer">
            <span className="auth-country-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Made for SRI LANKA
            </span>
          </div>
        </aside>

        <section className="auth-card" aria-label="Registration form">
          {user ? (
            <div className="auth-success-view" role="status" aria-live="polite">
              <span className="auth-eyebrow">WELCOME TO CEYLON CUTZ</span>
              <div className="auth-avatar" aria-hidden="true">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <h2>Account ready, {user.name}</h2>
              <p className="auth-user-meta">
                {user.email} ·{" "}
                <span>
                  {user.role === "partner" ? "Salon Partner" : "Client Member"}
                </span>
              </p>
              {user.salonName && (
                <p className="auth-partner-tag">
                  Studio: <strong>{user.salonName}</strong> ({user.district})
                </p>
              )}
              <div className="auth-quick-actions">
                <a href="#salons" className="primary-button auth-full-button">
                  Discover Salons
                </a>
                <a href="#products" className="auth-secondary-button">
                  Browse Salon Products
                </a>
                <button
                  type="button"
                  className="auth-text-button"
                  onClick={onLogout}
                >
                  Register a different account
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-form-wrap">
              <div className="auth-card-header">
                <span className="auth-eyebrow">CUSTOMER REGISTRATION</span>
                <h2>Create your account</h2>
                <p>
                  Fill in your details below to register as a Ceylon Cutz
                  customer.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="auth-grid-two">
                  <label className="auth-field">
                    <span>First Name</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nethmi"
                      autoComplete="given-name"
                      required
                    />
                  </label>

                  <label className="auth-field">
                    <span>Last Name</span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Perera"
                      autoComplete="family-name"
                      required
                    />
                  </label>
                </div>

                <div className="auth-grid-two">
                  <label className="auth-field">
                    <span>Telephone Number</span>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      autoComplete="tel"
                      required
                    />
                  </label>

                  <label className="auth-field">
                    <span>Gender</span>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other / Prefer not to say</option>
                    </select>
                  </label>
                </div>

                <label className="auth-field">
                  <span>Email Address</span>
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
                  <span>Address</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="No. 42, Flower Road"
                    autoComplete="street-address"
                    required
                  />
                </label>

                <div className="auth-grid-two">
                  <label className="auth-field">
                    <span>District</span>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                    >
                      {districts.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="auth-field">
                    <span>Town</span>
                    <input
                      type="text"
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      placeholder="e.g. Nugegoda"
                      autoComplete="address-level2"
                      required
                    />
                  </label>
                </div>

                <div className="auth-grid-two">
                  <label className="auth-field">
                    <span>Create Password</span>
                    <div className="auth-password-box">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="More than 8 characters (9+)"
                        autoComplete="new-password"
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

                  <label className="auth-field">
                    <span>Confirm Password</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      required
                    />
                  </label>
                </div>

                <div className="auth-strength" aria-live="polite">
                  <div className="auth-strength-header">
                    <span>Password strength</span>
                    <strong data-score={passwordChecks.score}>
                      {passwordChecks.label}
                    </strong>
                  </div>
                  <div className="auth-strength-bars" aria-hidden="true">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className={
                          passwordChecks.score >= level ? "is-filled" : ""
                        }
                      />
                    ))}
                  </div>
                  <div className="auth-strength-Rules">
                    <span className={passwordChecks.lengthOk ? "is-met" : ""}>
                      &gt; 8 chars (9+)
                    </span>
                    <span className={passwordChecks.caseOk ? "is-met" : ""}>
                      Upper &amp; lower
                    </span>
                    <span className={passwordChecks.numberOk ? "is-met" : ""}>
                      Number
                    </span>
                    <span className={passwordChecks.symbolOk ? "is-met" : ""}>
                      Symbol
                    </span>
                  </div>
                </div>

                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <span>
                    I agree to the Ceylon Cutz Terms &amp; Conditions and
                    Privacy Notice.
                  </span>
                </label>

                <button
                  type="submit"
                  className="primary-button auth-full-button"
                  disabled={submitting}
                >
                  {submitting ? "Creating account…" : "Create My Account"}
                </button>
              </form>

              <div className="auth-card-footer">
                <span>Already registered with Ceylon Cutz?</span>
                <a href="#login">Log in to your account →</a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
