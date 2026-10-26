import { useState } from "react"

export const salons = [
  {
    id: "colombo-studio",
    name: "Colombo Style Studio",
    location: "Colombo",
    gender: "Unisex",
    description:
      "A sample all-gender salon profile for exploring everyday cuts and styling.",
    services: ["Haircuts", "Hair styling", "Hair care"],
  },
  {
    id: "kandy-barber",
    name: "Kandy Barber Studio",
    location: "Kandy",
    gender: "Men",
    description:
      "A sample men's grooming profile with a focus on cuts and beard care.",
    services: ["Haircuts", "Beard grooming", "Hair styling"],
  },
  {
    id: "galle-beauty",
    name: "Galle Beauty Studio",
    location: "Galle",
    gender: "Women",
    description: "A sample women's salon profile for hair styling and care.",
    services: ["Haircuts", "Hair styling", "Hair treatments"],
  },
  {
    id: "colombo-beauty",
    name: "Colombo Beauty Studio",
    location: "Colombo",
    gender: "Women",
    description: "A sample women's salon profile for discovering a new look.",
    services: ["Haircuts", "Hair treatments", "Hair styling"],
  },
  {
    id: "kandy-style",
    name: "Kandy Style Studio",
    location: "Kandy",
    gender: "Unisex",
    description:
      "A sample all-gender salon profile for cuts and everyday hair care.",
    services: ["Haircuts", "Hair care", "Hair styling"],
  },
  {
    id: "galle-barber",
    name: "Galle Barber Studio",
    location: "Galle",
    gender: "Men",
    description: "A sample men's salon profile for haircuts and grooming.",
    services: ["Haircuts", "Beard grooming", "Hair care"],
  },
]

export const directoryTitles: Record<string, string> = {
  "colombo-studio": "Colombo Style Salon",
  "kandy-barber": "Kandy Barber Salon",
  "galle-beauty": "Galle Beauty Salon",
  "colombo-beauty": "Colombo Beauty Salon",
  "kandy-style": "Kandy Style Salon",
  "galle-barber": "Galle Barber Salon",
}

export const salonImages: Record<string, string> = {
  "colombo-studio": "/images/salons/salon-2.png",
  "kandy-barber": "/images/salons/salon-5.png",
  "galle-beauty": "/images/salons/salon-1.png",
  "colombo-beauty": "/images/salons/salon-4.png",
  "kandy-style": "/images/salons/salon-3.png",
  "galle-barber": "/images/salons/salon-5.png",
}

function SalonArtwork({ id, name }: { id: string; name: string }) {
  if (salonImages[id]) {
    return (
      <img
        className="salon-photo"
        src={salonImages[id]}
        alt={`Interior of ${name}`}
        loading="lazy"
        decoding="async"
      />
    )
  }
  return <SalonPlaceholder />
}

function SalonPlaceholder() {
  return (
    <div className="salon-artwork">
      <svg
        width="66"
        height="66"
        viewBox="0 0 64 64"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="12" y="13" width="40" height="39" rx="5" />
        <path d="M12 25h40M24 52V38h16v14M20 13V8h24v5M19 32h5M40 32h5" />
        <path d="M30 18h4" />
      </svg>
      <span>SALON PHOTO COMING SOON</span>
    </div>
  )
}

export default function SalonsPage({
  detailId,
  favorites,
  onToggleFavorite,
}: {
  detailId?: string
  favorites: string[]
  onToggleFavorite: (id: string) => void
}) {
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [gender, setGender] = useState("")
  const clear = () => {
    setSearch("")
    setLocation("")
    setGender("")
  }
  const matches = salons.filter(
    (salon) =>
      `${directoryTitles[salon.id] ?? salon.name} ${salon.location}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()) &&
      (!location || salon.location === location) &&
      (!gender || salon.gender === gender),
  )
  const salon = salons.find((item) => item.id === detailId)
  if (detailId) {
    return (
      <main
        className="products-main salon-main"
        id="salons-content"
        tabIndex={-1}
      >
        <nav className="products-breadcrumb" aria-label="Breadcrumb">
          <a href="#home">Home</a>
          <span>/</span>
          <a href="#salons">Search Salons</a>
          <span>/</span>
          <span aria-current="page">
            {salon ? (directoryTitles[salon.id] ?? salon.name) : "Not found"}
          </span>
        </nav>
        {salon ? (
          <>
            <div className="products-heading">
              <div>
                <span className="products-eyebrow">SALON PROFILE</span>
                <h1>{directoryTitles[salon.id] ?? salon.name}</h1>
                <p>
                  {salon.location} · {salon.gender}
                </p>
              </div>
              <button
                className="save-salon-button"
                onClick={() => onToggleFavorite(salon.id)}
                aria-pressed={favorites.includes(salon.id)}
              >
                {favorites.includes(salon.id)
                  ? "Saved to favorites"
                  : "Save to favorites"}
              </button>
            </div>
            <p className="salon-demo-note">
              Illustrative demo only. This is not a verified business listing.
              Services and locations are sample data.
            </p>
            <div className="salon-detail-grid">
              <div className="salon-detail-image">
                <SalonArtwork id={salon.id} name={directoryTitles[salon.id] ?? salon.name} />
              </div>
              <div className="salon-detail-info">
                <h2>About this salon</h2>
                <p>{salon.description}</p>
                <h2>Sample services</h2>
                <div className="salon-service-tags">
                  {salon.services.map((service) => (
                    <span key={service}>{service}</span>
                  ))}
                </div>
                <dl>
                  <div>
                    <dt>Location</dt>
                    <dd>{salon.location} · Sample location</dd>
                  </div>
                  <div>
                    <dt>Gender served</dt>
                    <dd>{salon.gender}</dd>
                  </div>
                  <div>
                    <dt>Address & contact</dt>
                    <dd>Not provided</dd>
                  </div>
                  <div>
                    <dt>Opening hours</dt>
                    <dd>Not provided</dd>
                  </div>
                  <div>
                    <dt>Prices & appointments</dt>
                    <dd>Not available in this preview</dd>
                  </div>
                </dl>
              </div>
            </div>
            <a className="salon-back-link" href="#salons">
              ← Back to salons
            </a>
          </>
        ) : (
          <div className="products-empty">
            <h1>Salon not found</h1>
            <p>This salon profile is not available.</p>
            <a href="#salons" className="salon-back-link">
              Back to salons
            </a>
          </div>
        )}
      </main>
    )
  }
  return (
    <main
      className="products-main salon-main"
      id="salons-content"
      tabIndex={-1}
    >
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">Home</a>
        <span>/</span>
        <span aria-current="page">Search Salons</span>
      </nav>
      <div className="products-heading">
        <div>
          <span className="products-eyebrow">FIND YOUR PERFECT MATCH</span>
          <h1>
            Find your <span>salon.</span>
          </h1>
          <p>A new look starts with the right connection.</p>
        </div>
        <span className="catalog-label">
          6 SALONS <span /> DIRECTORY PREVIEW
        </span>
      </div>
      <section
        className="product-toolbar"
        aria-label="Search and filter salons"
      >
        <label className="product-search">
          <span className="sr-only">Search salons</span>
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            type="search"
            placeholder="Search salons or locations…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="product-filters">
          <label>
            <span>Location</span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
              <option value="">All locations</option>
              {["Colombo", "Kandy", "Galle"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Gender</span>
            <select
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            >
              <option value="">All genders</option>
              {["Men", "Women", "Unisex"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <div className="product-results-bar">
        <span role="status" aria-live="polite">
          {`${matches.length} salons are found.`}
        </span>
        {(search || location || gender) && (
          <button onClick={clear}>Clear filters</button>
        )}
      </div>
      {matches.length ? (
        <div className="salons-grid">
          {matches.map((salon) => (
            <a
              className="product-card salon-card"
              href={`#salons/${salon.id}`}
              key={salon.id}
            >
              <div className="salon-image-area">
                <span className="salon-demo-badge">DEMO SALON</span>
                <SalonArtwork id={salon.id} name={directoryTitles[salon.id] ?? salon.name} />
              </div>
              <div className="product-card-content">
                <span className="salon-location">
                  {salon.location} <span>{`· ${salon.gender}`}</span>
                </span>
                <h2>{directoryTitles[salon.id] ?? salon.name}</h2>
                <div className="product-card-bottom">
                  <span>View salon details</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="products-empty">
          <h2>No matching salons</h2>
          <p>Try another location, gender, or search term.</p>
          <button onClick={clear}>Clear all filters</button>
        </div>
      )}
    </main>
  )
}
