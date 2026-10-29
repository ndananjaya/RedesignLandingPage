import { useEffect, useRef, useState } from "react"
import ProductsPage from "./ProductsPage"
import SalonsPage from "./SalonsPage"
import FavoritesPage from "./FavoritesPage"
import ScanPage from "./ScanPage"
import LoginPage, { type AuthUser } from "./LoginPage"
import RegisterPage from "./RegisterPage"
import DashboardPage from "./DashboardPage"
import AdminDashboardPage from "./AdminDashboardPage"

function currentPage() {
  const hash = window.location.hash
  return ["#products", "#scan", "#favorites", "#login", "#register", "#dashboard"].includes(hash)
    ? hash.slice(1)
    : hash === "#salons" || hash.startsWith("#salons/")
      ? hash.slice(1)
      : "home"
}

type IconName = "qr" | "search" | "products" | "heart"
type Preview = { title: string; description: string; icon?: IconName }

const actions: (Preview & {
  icon: IconName
  eyebrow: string
  subtitle: string
  color: string
})[] = [
  {
    title: "Scan QR",
    icon: "qr",
    eyebrow: "A QUICK CONNECTION",
    subtitle: "Your salon experience, one scan away.",
    color: "blue",
    description:
      "Scan a salon’s QR code to connect directly with its services. QR scanning is coming in a future update and is not available in this preview. Your camera will not be accessed.",
  },
  {
    title: "Search Salons",
    icon: "search",
    eyebrow: "FIND YOUR PERFECT MATCH",
    subtitle: "Discover a salon that gets your style.",
    color: "purple",
    description:
      "Discover salons and find your next great cut. Salon discovery will be available on a future page; search and salon results are not connected in this preview.",
  },
  {
    title: "Salon Products",
    icon: "products",
    eyebrow: "GOOD HAIR, EVERY DAY",
    subtitle: "Bring the salon feeling home.",
    color: "purple",
    description:
      "Explore salon products to care for your look at home. Product browsing will be available on a future page. There is no catalog or checkout in this preview.",
  },
  {
    title: "My Favorite",
    icon: "heart",
    eyebrow: "YOUR PERSONAL SHORTLIST",
    subtitle: "Keep your go-to salons close.",
    color: "blue",
    description:
      "Your saved salons will live here once favorites are implemented. This preview does not save salons or connect to an account.",
  },
]

function Icon({
  name,
  className = "",
  stroke = "currentColor",
}: {
  name: IconName
  className?: string
  stroke?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke={stroke}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "qr" && (
        <>
          <path d="M17 5H7a2 2 0 0 0-2 2v10M47 5h10a2 2 0 0 1 2 2v10M5 47v10a2 2 0 0 0 2 2h10M59 47v10a2 2 0 0 1-2 2H47" />
          <rect x="14" y="14" width="13" height="13" rx="2" />
          <rect x="37" y="14" width="13" height="13" rx="2" />
          <rect x="14" y="37" width="13" height="13" rx="2" />
          <path d="M38 37h6v7h6v6H38v-6M50 36v2M32 16v5M32 31h-9M14 32h3" />
        </>
      )}
      {name === "search" && (
        <>
          <circle cx="28" cy="27" r="18" />
          <path d="m41 41 15 15M22 27h12M28 21v12" />
        </>
      )}
      {name === "products" && (
        <>
          <path d="M14 24h14v31H14zM17 24v-8h8v8M21 16V9h13M28 9v5M39 28h13l-2 27h-9zM39 22h13v6M16 38h10M42 41h7" />
          <path d="M45 9v7M41.5 12.5h7" />
        </>
      )}
      {name === "heart" && (
        <path d="M32 54 10 32C-3 17 18 2 32 18 46 2 67 17 54 32L32 54Z" />
      )}
    </svg>
  )
}

function Arrow({
  className = "",
  stroke = "currentColor",
}: {
  className?: string
  stroke?: string
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  )
}

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <div className={`brand ${footer ? "footer-brand" : ""}`}>
      <div className="logo-plate">
        <img src="/images/ceylon-cutz-logo.png" alt="Ceylon Cutz logo" />
      </div>
      <div>
        <span className="brand-name">
          Ceylon<span>Cutz</span>
        </span>
        <span className="brand-tagline">YOUR STYLE. YOUR WAY.</span>
      </div>
    </div>
  )
}

function PreviewDialog({
  preview,
  onClose,
}: {
  preview: Preview | null
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (preview && !ref.current?.open) ref.current?.showModal()
    if (!preview && ref.current?.open) ref.current.close()
  }, [preview])
  return (
    <dialog
      ref={ref}
      className="preview-dialog"
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="preview-title"
      aria-describedby="preview-description"
    >
      <div className="dialog-content">
        <span className="preview-label">LANDING PAGE PREVIEW</span>
        {preview?.icon && <Icon name={preview.icon} className="dialog-icon" />}
        <h2 id="preview-title">{preview?.title}</h2>
        <p id="preview-description">{preview?.description}</p>
        <button
          className="primary-button dialog-close"
          onClick={() => ref.current?.close()}
          autoFocus
        >
          Close preview <Arrow />
        </button>
      </div>
    </dialog>
  )
}

export default function App() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem("ceylon-cutz-favorites") ?? "[]",
      )
      return Array.isArray(saved)
        ? saved.filter((id): id is string => typeof id === "string")
        : []
    } catch {
      return []
    }
  })
  const [storageMessage, setStorageMessage] = useState("")
  const toggleFavorite = (id: string) =>
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    )
  useEffect(() => {
    try {
      localStorage.setItem("ceylon-cutz-favorites", JSON.stringify(favorites))
      setStorageMessage("")
    } catch {
      setStorageMessage(
        "Browser storage is unavailable. Favorites will only last for this session.",
      )
    }
  }, [favorites])
  const [preview, setPreview] = useState<Preview | null>(null)
  const [page, setPage] = useState(currentPage)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  useEffect(() => {
    const handleNavigation = () => {
      const nextPage = currentPage()
      setPage(nextPage)
      setPreview(null)
      window.scrollTo({ top: 0, behavior: "instant" })
      requestAnimationFrame(() => {
        document
          .getElementById(
            nextPage === "products"
              ? "products-content"
              : nextPage.startsWith("salons")
                ? "salons-content"
                : nextPage === "scan"
                  ? "scan-content"
                  : nextPage === "favorites"
                    ? "favorites-content"
                    : nextPage === "login"
                      ? "login-content"
                      : nextPage === "register"
                        ? "register-content"
                        : nextPage === "dashboard"
                          ? "dashboard-content"
                    : "landing-content",
          )
          ?.focus({ preventScroll: true })
      })
    }
    window.addEventListener("hashchange", handleNavigation)
    return () => window.removeEventListener("hashchange", handleNavigation)
  }, [])
  const info = (title: string) =>
    setPreview({
      title,
      description: `${title} content is not yet available. This is a landing-page preview; approved information will be added on a future page.`,
    })
  return (
    <div className="site-shell" id="home">
      <header
        className="header"
        style={{
          borderBottomWidth: "5px",
          borderBottomColor: "var(--color-primary)",
        }}
      >
        <div className="header-photo">
          <img
            src="/images/footer-salon-treatment.png"
            alt="A relaxing facial treatment at a salon"
            width="1568"
            height="882"
            decoding="async"
          />
        </div>
        <div className="header-inner">
          <a href="#home" className="brand-link" aria-label="Ceylon Cutz home">
            <Brand />
          </a>
          <nav aria-label="Account" className="account-nav">
            {authUser ? (
              <>
                <a
                  href="#dashboard"
                  className="header-user"
                  aria-current={page === "dashboard" ? "page" : undefined}
                  aria-label="Go to my dashboard"
                >
                  <span className="dash-avatar" aria-hidden="true">
                    {authUser.name.slice(0, 1).toUpperCase()}
                  </span>
                  {authUser.firstName ?? authUser.name.split(" ")[0]}
                </a>
                <button
                  className="primary-button"
                  onClick={() => {
                    setAuthUser(null)
                    window.location.hash = "home"
                  }}
                >
                  Sign out <Arrow />
                </button>
              </>
            ) : (
              <>
                <button
                  className="login-button"
                  aria-current={page === "login" ? "page" : undefined}
                  onClick={() => (window.location.hash = "login")}
                >
                  Log in
                </button>
                <button
                  className="primary-button"
                  aria-current={page === "register" ? "page" : undefined}
                  onClick={() => (window.location.hash = "register")}
                >
                  Register <Arrow />
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      {page === "products" ? (
        <ProductsPage />
      ) : page.startsWith("salons") ? (
        <SalonsPage
          detailId={page.startsWith("salons/") ? page.slice(7) : undefined}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      ) : page === "scan" ? (
        <ScanPage />
      ) : page === "favorites" ? (
        <FavoritesPage favorites={favorites} onRemove={toggleFavorite} />
      ) : page === "dashboard" ? (
        authUser?.role === "admin" ? (
          <AdminDashboardPage user={authUser} />
        ) : (
          <DashboardPage
            user={authUser}
            favorites={favorites}
            onRemoveFavorite={toggleFavorite}
            onUpdateUser={setAuthUser}
          />
        )
      ) : page === "login" ? (
        <LoginPage
          user={authUser}
          favoritesCount={favorites.length}
          onLogin={(u) => {
            setAuthUser(u)
            window.location.hash = "dashboard"
          }}
          onLogout={() => setAuthUser(null)}
        />
      ) : page === "register" ? (
        <RegisterPage
          user={authUser}
          onRegister={(u) => {
            setAuthUser(u)
            window.location.hash = "dashboard"
          }}
          onLogout={() => setAuthUser(null)}
        />
      ) : (
        <main className="main-content" id="landing-content" tabIndex={-1}>
          <div className="intro"></div>
          <div className="section-label">
            <span>WHAT WOULD YOU LIKE TO DO?</span>
            <span className="section-line" />
            <span className="four-ways">FOUR WAYS TO GET STARTED</span>
          </div>
          <div className="action-grid">
            {actions.map((action) => (
              <button
                key={action.title}
                className={`action-card ${action.color}`}
                onClick={() =>
                  action.icon === "products"
                    ? (window.location.hash = "products")
                    : action.icon === "search"
                      ? (window.location.hash = "salons")
                      : action.icon === "qr"
                        ? (window.location.hash = "scan")
                        : (window.location.hash = "favorites")
                }
              >
                <div className="card-top">
                  <span className="card-eyebrow">{action.eyebrow}</span>
                </div>
                <div className="card-icon">
                  <Icon
                    name={action.icon}
                    stroke="currentColor"
                  />
                  <span className="icon-spark spark-one" />
                  <span className="icon-spark spark-two" />
                </div>
                <div className="card-bottom">
                  <div>
                    <h2>{action.title}</h2>
                    <p>{action.subtitle}</p>
                  </div>
                  <span className="card-arrow">
                    <Arrow stroke="var(--color-accent)" />
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="main-note">
            <svg
              className="note-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="m12 3 8 4v6c0 5-8 8-8 8s-8-3-8-8V7l8-4Z" />
              <path d="m8 12 3 3 5-6" />
            </svg>
            <span>A better salon experience, built around you.</span>
            <span className="note-dot" />
            <span>Made for Sri Lanka</span>
          </div>
        </main>
      )}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand-column">
              <Brand footer />
              <p>
                Great style starts with
                <br />
                the right connection.
              </p>
              <span className="country-label">
                <span /> MADE FOR SRI LANKA
              </span>
            </div>
            <div>
              <h3>About us</h3>
              <p>
                Discover salons, explore salon products, and keep your favorites
                in one place.
              </p>
              <h3 className="contact-title">Contact us</h3>
              <span className="contact-placeholder">
                Contact details coming soon
              </span>
            </div>
            <div>
              <h3>Quick links</h3>
              <div className="footer-links">
                <a href="#home">Home</a>
                <a href="#salons">Search Salons</a>
                <a href="#products">Products</a>
                <a href="#favorites">Favorite</a>
                {authUser && (
                  <a href="#dashboard">
                    {authUser.firstName ?? authUser.name.split(" ")[0]}
                    {"\u2019s account"}
                  </a>
                )}
              </div>
            </div>
            <div>
              <h3>Useful links</h3>
              <div className="footer-links">
                {["Privacy Notice", "Privacy", "FAQ", "Terms & Conditions"].map(
                  (title) => (
                    <button key={title} onClick={() => info(title)}>
                      {title}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Ceylon Cutz. All rights reserved.
            </span>
            <span>
              Step into style. <span className="footer-accent">Stay you.</span>
            </span>
          </div>
        </div>
      </footer>
      <PreviewDialog preview={preview} onClose={() => setPreview(null)} />
      {storageMessage && (
        <p role="status" className="storage-notice">
          {storageMessage}
        </p>
      )}
    </div>
  )
}
