import { useId, useState } from "react"

export const products = [
  {
    name: "Sunslik Shampoo", image: "/images/products/product-1.png",
    category: "Shampoo",
    brand: "Sunslik",
    availability: "Unknown",
  },
  {
    name: "Dreamron Shampoo", image: "/images/products/product-2.png",
    category: "Shampoo",
    brand: "Dreamron",
    availability: "Unknown",
  },
  {
    name: "Bellose Shampoo", image: "/images/products/product-3.png",
    category: "Shampoo",
    brand: "Bellose",
    availability: "Unknown",
  },
  {
    name: "Lifebuoy Shampoo", image: "/images/products/product-4.png",
    category: "Shampoo",
    brand: "Lifebuoy",
    availability: "Unknown",
  },
  {
    name: "Khomba Soap", image: "/images/products/product-5.png",
    category: "Soap",
    brand: "",
    availability: "Unknown",
  },
  {
    name: "Champion Soap", image: "/images/products/product-6.png",
    category: "Soap",
    brand: "",
    availability: "Unknown",
  },
  {
    name: "Rani Soap", image: "/images/products/product-7.png",
    category: "Soap",
    brand: "",
    availability: "Unknown",
  },
  { name: "Ayush Soap", image: "/images/products/product-8.png", category: "Soap", brand: "", availability: "Unknown" },
]

function ProductPlaceholder({ soap }: { soap: boolean }) {
  const fillId = useId()
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      aria-hidden="true"
      className="product-placeholder"
    >
      {soap ? (
        <>
          <rect
            x="15"
            y="37"
            width="70"
            height="48"
            rx="17"
            fill={`url(#${fillId})`}
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="24"
            y="45"
            width="52"
            height="32"
            rx="12"
            stroke="currentColor"
            opacity=".35"
          />
          <path
            d="M42 60h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="77" cy="23" r="5" stroke="currentColor" opacity=".5" />
          <circle cx="88" cy="33" r="3" stroke="currentColor" opacity=".3" />
        </>
      ) : (
        <>
          <rect
            x="37"
            y="10"
            width="26"
            height="15"
            rx="4"
            fill="currentColor"
            opacity=".35"
          />
          <path
            d="M36 25h28v10c0 7 9 10 9 20v45c0 5-4 9-9 9H36c-5 0-9-4-9-9V55c0-10 9-13 9-20V25Z"
            fill={`url(#${fillId})`}
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="33"
            y="56"
            width="34"
            height="34"
            rx="4"
            stroke="currentColor"
            opacity=".4"
          />
          <path
            d="M43 68h14M46 76h8"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </>
      )}
      <defs>
        <linearGradient
          id={fillId}
          x1="15"
          y1="20"
          x2="85"
          y2="110"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-accent)" stopOpacity=".22" />
          <stop offset="1" stopColor="var(--color-accent-light)" stopOpacity=".06" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function ProductsPage({
  onPreview,
}: {
  onPreview: (name: string) => void
}) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [availability, setAvailability] = useState("")
  const [brand, setBrand] = useState("")
  const query = search.trim().toLowerCase()
  const filteredProducts = products.filter(
    (product) =>
      (!query ||
        `${product.name} ${product.category} ${product.brand}`
          .toLowerCase()
          .includes(query)) &&
      (!type || product.category === type) &&
      (!availability || product.availability === availability) &&
      (!brand || product.brand === brand),
  )
  const hasFilters = Boolean(search || type || availability || brand)
  const clearFilters = () => {
    setSearch("")
    setType("")
    setAvailability("")
    setBrand("")
  }
  return (
    <main className="products-main" id="products-content" tabIndex={-1}>
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">Home</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Salon Products</span>
      </nav>
      <div className="products-heading">
        <div>
          <span className="products-eyebrow">GOOD HAIR, EVERY DAY</span>
          <h1>
            Salon <span>Products</span>
          </h1>
          <p>A little care for your everyday routine.</p>
        </div>
        <span className="catalog-label">
          8 PRODUCTS <span /> CATALOG PREVIEW
        </span>
      </div>
      <section
        className="product-toolbar"
        aria-label="Search and filter products"
      >
        <label className="product-search">
          <span className="sr-only">Search products</span>
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
            placeholder="Search products or brands…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="product-filters">
          <label>
            <span>Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">All types</option>
              {["Shampoo", "Soap", "Gel", "Face wash"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Availability</span>
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              aria-describedby="stock-note"
            >
              <option value="">All availability</option>
              <option>In stock</option>
              <option>Out of stock</option>
            </select>
          </label>
          <label>
            <span>Brand</span>
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
            >
              <option value="">All brands</option>
              {["Sunslik", "Dreamron", "Bellose", "Lifebuoy"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <div className="product-results-bar">
        <span role="status" aria-live="polite">
          {`${filteredProducts.length} of ${products.length} products`}
        </span>
        {hasFilters && <button onClick={clearFilters}>Clear filters</button>}
      </div>
      <p className="product-stock-note" id="stock-note">
        Stock information is not yet available. In-stock and out-of-stock
        filters will show products once availability is confirmed.
      </p>
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <button
              className={`product-card ${
                product.category === "Soap" ? "soap-card" : ""
              }`}
              key={product.name}
              onClick={() => onPreview(product.name)}
              aria-label={`Preview ${product.name}`}
            >
              <div className="product-image-area">
                <span className="product-category">{product.category}</span>
                <span className="product-index">
                  {`0${products.indexOf(product) + 1}`}
                </span>
                {product.image ? (
                  <img
                    className="product-photo"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <>
                    <ProductPlaceholder soap={product.category === "Soap"} />
                    <span className="image-placeholder-label">
                      PRODUCT IMAGE COMING SOON
                    </span>
                  </>
                )}
              </div>
              <div className="product-card-content">
                <h2>{product.name}</h2>
                <div className="product-card-bottom">
                  <span>Explore product</span>
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
            </button>
          ))}
        </div>
      ) : (
        <div className="products-empty">
          <h2>No matching products</h2>
          <p>
            {availability
              ? "No products have confirmed stock information yet. Try removing the availability filter."
              : "Try a different search or clear your filters to explore the collection."}
          </p>
          <button onClick={clearFilters}>Clear all filters</button>
        </div>
      )}
      <p className="products-preview-note">
        A first look at our product collection. Details and shopping are coming
        soon.
      </p>
    </main>
  )
}
