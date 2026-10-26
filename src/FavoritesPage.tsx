import { directoryTitles, salonImages, salons } from "./SalonsPage"

export default function FavoritesPage({
  favorites,
  onRemove,
}: {
  favorites: string[]
  onRemove: (id: string) => void
}) {
  const saved = salons.filter((salon) => favorites.includes(salon.id))
  return (
    <main className="products-main" id="favorites-content" tabIndex={-1}>
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">Home</a>
        <span>/</span>
        <span aria-current="page">My Favorite</span>
      </nav>
      <div className="products-heading">
        <div>
          <span className="products-eyebrow">YOUR PERSONAL SHORTLIST</span>
          <h1>
            My <span>Favorite</span>
          </h1>
          <p>Your go-to salons, all in one place.</p>
        </div>
        <span className="catalog-label">{`${saved.length} SAVED SALONS`}</span>
      </div>
      <p className="salon-demo-note">
        Saved on this browser only, not synced to an account. Current salon
        listings are illustrative demos.
      </p>
      {saved.length ? (
        <div className="salons-grid">
          {saved.map((salon) => (
            <article className="product-card favorite-card" key={salon.id}>
              <a href={`#salons/${salon.id}`} className="favorite-salon-link">
                <span className="salon-demo-badge">DEMO SALON</span>
                <img
                  className="salon-photo"
                  src={salonImages[salon.id]}
                  alt={`Interior of ${directoryTitles[salon.id] ?? salon.name}`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="salon-location">{`${salon.location} · ${salon.gender}`}</span>
                <h2>{directoryTitles[salon.id] ?? salon.name}</h2>
                <span className="favorite-details">View salon details →</span>
              </a>
              <button
                className="favorite-remove"
                onClick={() => onRemove(salon.id)}
                aria-label={`Remove ${directoryTitles[salon.id] ?? salon.name} from favorites`}
              >
                Remove from favorites
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="products-empty">
          <svg
            width="56"
            height="56"
            viewBox="0 0 64 64"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M32 54 10 32C-3 17 18 2 32 18 46 2 67 17 54 32L32 54Z" />
          </svg>
          <h2>Your shortlist starts here</h2>
          <p>
            Find a salon you love and select “Save to favorites” on its detail
            page. It will appear here for your next visit.
          </p>
          <a href="#salons" className="save-salon-button">
            Explore salons →
          </a>
        </div>
      )}
    </main>
  )
}
