import { FormEvent, useEffect, useId, useState } from "react"

export type ProductSalonStock = {
  id: string
  name: string
  district: string
  city: string
  availability: "In stock" | "Out of stock"
  contactNo: string
  mapQuery: string
  address: string
}

export type ProductItem = {
  id: string
  codePrefix: string
  name: string
  image: string
  category: "Shampoo" | "Soap"
  brand: string
  availability: "In stock" | "Out of stock"
  description: string
  sizes: { label: string; price: number }[]
  salons: ProductSalonStock[]
}

const defaultSalons: ProductSalonStock[] = [
  {
    id: "colombo-studio",
    name: "Colombo Style Salon",
    district: "Colombo",
    city: "Colombo",
    availability: "In stock",
    contactNo: "0774466550",
    mapQuery: "Colombo,Sri+Lanka",
    address: "No. 42, Galle Road, Colombo 03",
  },
  {
    id: "galle-beauty",
    name: "Galle Beauty Salon",
    district: "Galle",
    city: "Galle",
    availability: "Out of stock",
    contactNo: "0778899112",
    mapQuery: "Galle,Sri+Lanka",
    address: "No. 18, Wakwella Road, Galle",
  },
  {
    id: "colombo-beauty",
    name: "Colombo Beauty Salon",
    district: "Colombo",
    city: "Nugegoda",
    availability: "In stock",
    contactNo: "0712345678",
    mapQuery: "Nugegoda,Colombo,Sri+Lanka",
    address: "No. 105, High Level Road, Nugegoda",
  },
  {
    id: "kandy-style",
    name: "Kandy Style Salon",
    district: "Kandy",
    city: "Kandy",
    availability: "In stock",
    contactNo: "0765544332",
    mapQuery: "Kandy,Sri+Lanka",
    address: "No. 27, Peradeniya Road, Kandy",
  },
  {
    id: "kandy-barber",
    name: "Kandy Barber Salon",
    district: "Kandy",
    city: "Peradeniya",
    availability: "Out of stock",
    contactNo: "0759988776",
    mapQuery: "Peradeniya,Kandy,Sri+Lanka",
    address: "No. 12, Botanical Gardens Road, Peradeniya",
  },
  {
    id: "galle-barber",
    name: "Galle Barber Salon",
    district: "Galle",
    city: "Hikkaduwa",
    availability: "In stock",
    contactNo: "0773322110",
    mapQuery: "Hikkaduwa,Galle,Sri+Lanka",
    address: "No. 64, Galle Road, Hikkaduwa",
  },
]

const sriLankaDistrictCities: Record<string, string[]> = {
  Colombo: ["Colombo", "Nugegoda", "Dehiwala", "Maharagama", "Mount Lavinia"],
  Galle: ["Galle", "Hikkaduwa", "Ambalangoda", "Karapitiya"],
  Kandy: ["Kandy", "Peradeniya", "Katugastota", "Gampola"],
  Gampaha: ["Gampaha", "Negombo", "Kadawatha", "Wattala"],
  Kalutara: ["Kalutara", "Panadura", "Horana", "Beruwala"],
  Matara: ["Matara", "Weligama", "Dickwella"],
  Kurunegala: ["Kurunegala", "Kuliyapitiya", "Pannala"],
}

export const products: ProductItem[] = [
  {
    id: "sunslik-shampoo",
    codePrefix: "SUN-SHP",
    name: "Sunslik Shampoo",
    image: "/images/products/product-1.png",
    category: "Shampoo",
    brand: "Sunslik",
    availability: "In stock",
    description:
      "Enriched with Amla Pearl Complex, Sunslik Stunning Black Shine Shampoo deeply nourishes hair from root to tip for long-lasting salon shine, smoothness, and healthy-looking locks.",
    sizes: [
      { label: "100 ml", price: 420 },
      { label: "250 ml", price: 850 },
      { label: "350 ml", price: 1150 },
    ],
    salons: defaultSalons,
  },
  {
    id: "dreamron-shampoo",
    codePrefix: "DRM-SHP",
    name: "Dreamron Shampoo",
    image: "/images/products/product-2.png",
    category: "Shampoo",
    brand: "Dreamron",
    availability: "In stock",
    description:
      "Formulated with King Coconut oil and conditioning vitamins, Dreamron Shampoo gently cleanses while restoring moisture balance and natural silkiness to dry or styled hair.",
    sizes: [
      { label: "100 ml", price: 450 },
      { label: "250 ml", price: 890 },
      { label: "350 ml", price: 1200 },
    ],
    salons: defaultSalons,
  },
  {
    id: "bellose-shampoo",
    codePrefix: "BEL-SHP",
    name: "Bellose Shampoo",
    image: "/images/products/product-3.png",
    category: "Shampoo",
    brand: "Bellose",
    availability: "In stock",
    description:
      "Professional salon-care keratin and conditioning shampoo designed to strengthen treated strands, reduce frizz, and leave hair effortlessly manageable after every wash.",
    sizes: [
      { label: "100 ml", price: 520 },
      { label: "250 ml", price: 980 },
      { label: "350 ml", price: 1350 },
    ],
    salons: defaultSalons,
  },
  {
    id: "lifebuoy-shampoo",
    codePrefix: "LFB-SHP",
    name: "Lifebuoy Shampoo",
    image: "/images/products/product-4.png",
    category: "Shampoo",
    brand: "Lifebuoy",
    availability: "In stock",
    description:
      "Fortified with milk protein nutrients to protect scalp hygiene and reinforce hair strength, reducing hair fall and keeping family hair thick, clean, and fresh.",
    sizes: [
      { label: "100 ml", price: 390 },
      { label: "250 ml", price: 780 },
      { label: "350 ml", price: 1050 },
    ],
    salons: defaultSalons,
  },
  {
    id: "khomba-soap",
    codePrefix: "KHM-SOP",
    name: "Khomba Soap",
    image: "/images/products/product-5.png",
    category: "Soap",
    brand: "",
    availability: "In stock",
    description:
      "Pure herbal Kohomba (Margosa) beauty soap crafted with natural Sri Lankan botanical extracts to gently purify, soothe, and refresh everyday skin.",
    sizes: [
      { label: "75 g", price: 180 },
      { label: "100 g", price: 240 },
      { label: "150 g", price: 340 },
    ],
    salons: defaultSalons,
  },
  {
    id: "champion-soap",
    codePrefix: "CHP-SOP",
    name: "Champion Soap",
    image: "/images/products/product-6.png",
    category: "Soap",
    brand: "",
    availability: "In stock",
    description:
      "Energizing cleansing bar with active skin-refreshing botanicals that washes away impurities and leaves a crisp, revitalizing fragrance all day.",
    sizes: [
      { label: "75 g", price: 170 },
      { label: "100 g", price: 220 },
      { label: "150 g", price: 310 },
    ],
    salons: defaultSalons,
  },
  {
    id: "rani-soap",
    codePrefix: "RAN-SOP",
    name: "Rani Soap",
    image: "/images/products/product-7.png",
    category: "Soap",
    brand: "",
    availability: "In stock",
    description:
      "Enriched with aromatic Red Sandalwood oil and natural moisturizers for radiant, soft, and delicately perfumed skin.",
    sizes: [
      { label: "75 g", price: 190 },
      { label: "100 g", price: 250 },
      { label: "150 g", price: 360 },
    ],
    salons: defaultSalons,
  },
  {
    id: "ayush-soap",
    codePrefix: "AYS-SOP",
    name: "Ayush Soap",
    image: "/images/products/product-8.png",
    category: "Soap",
    brand: "",
    availability: "Out of stock",
    description:
      "Inspired by authentic Ayurvedic herbal wisdom with Saffron and Turmeric extracts to brighten complexion and nourish skin naturally.",
    sizes: [
      { label: "75 g", price: 210 },
      { label: "100 g", price: 280 },
      { label: "150 g", price: 390 },
    ],
    salons: defaultSalons,
  },
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
  onPreview?: (name: string) => void
}) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [availability, setAvailability] = useState("")
  const [brand, setBrand] = useState("")

  // Modal flow state:
  // Step 1: Product Detail window
  // Step 2: Salon View window ("View" button clicked)
  // Step 3: Confirm Order window ("Order now" button clicked)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null,
  )
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1)
  const [salonDistrictFilter, setSalonDistrictFilter] = useState("")
  const [salonCityFilter, setSalonCityFilter] = useState("")
  const [viewingSalon, setViewingSalon] = useState<ProductSalonStock | null>(
    null,
  )
  const [isOrdering, setIsOrdering] = useState(false)

  // Confirm Order form state
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [orderDistrict, setOrderDistrict] = useState("Colombo")
  const [orderCity, setOrderCity] = useState("Colombo")
  const [contactNumber, setContactNumber] = useState("")
  const [additionalNumber, setAdditionalNumber] = useState("")
  const [billEmail, setBillEmail] = useState("")
  const [orderError, setOrderError] = useState("")
  const [orderSuccess, setOrderSuccess] = useState<{
    mode: "order" | "pay"
    productName: string
    sizeLabel: string
    salonName: string
    price: number
  } | null>(null)

  useEffect(() => {
    if (!selectedProduct) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isOrdering) {
          setIsOrdering(false)
          setOrderSuccess(null)
        } else if (viewingSalon) {
          setViewingSalon(null)
        } else {
          setSelectedProduct(null)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedProduct, viewingSalon, isOrdering])

  const openProductWindow = (product: ProductItem) => {
    setSelectedProduct(product)
    setSelectedSizeIndex(product.sizes.length > 1 ? 1 : 0)
    setSalonDistrictFilter("")
    setSalonCityFilter("")
    setViewingSalon(null)
    setIsOrdering(false)
    setOrderError("")
    setOrderSuccess(null)
  }

  const closeAllWindows = () => {
    setSelectedProduct(null)
    setViewingSalon(null)
    setIsOrdering(false)
    setOrderError("")
    setOrderSuccess(null)
  }

  const openSalonView = (salon: ProductSalonStock) => {
    setViewingSalon(salon)
    setIsOrdering(false)
    setOrderError("")
    setOrderSuccess(null)
  }

  const openOrderWindow = () => {
    if (viewingSalon) {
      setOrderDistrict(viewingSalon.district)
      setOrderCity(viewingSalon.city)
    }
    setOrderError("")
    setOrderSuccess(null)
    setIsOrdering(true)
  }

  const submitOrder = (mode: "order" | "pay") => {
    if (!customerName.trim()) {
      setOrderError("Please enter your name.")
      return
    }
    if (!customerAddress.trim()) {
      setOrderError("Please enter your delivery address.")
      return
    }
    if (!orderDistrict) {
      setOrderError("Please select your district.")
      return
    }
    if (!orderCity) {
      setOrderError("Please select your city.")
      return
    }
    if (!contactNumber.trim()) {
      setOrderError("Please enter your contact number.")
      return
    }
    setOrderError("")
    if (!selectedProduct || !viewingSalon) return
    const activeSize =
      selectedProduct.sizes[selectedSizeIndex] ?? selectedProduct.sizes[0]
    setOrderSuccess({
      mode,
      productName: selectedProduct.name,
      sizeLabel: activeSize.label,
      salonName: viewingSalon.name,
      price: activeSize.price,
    })
  }

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

  const availableSalonDistricts = selectedProduct
    ? Array.from(new Set(selectedProduct.salons.map((s) => s.district)))
    : []

  const availableSalonCities = selectedProduct
    ? Array.from(
        new Set(
          selectedProduct.salons
            .filter(
              (s) => !salonDistrictFilter || s.district === salonDistrictFilter,
            )
            .map((s) => s.city),
        ),
      )
    : []

  const filteredProductSalons = selectedProduct
    ? selectedProduct.salons.filter(
        (s) =>
          (!salonDistrictFilter || s.district === salonDistrictFilter) &&
          (!salonCityFilter || s.city === salonCityFilter),
      )
    : []

  const activeSize =
    selectedProduct?.sizes[selectedSizeIndex] ?? selectedProduct?.sizes[0]

  const generatedProductCode =
    selectedProduct && activeSize
      ? `${selectedProduct.codePrefix}-${activeSize.label.replace(/\s+/g, "").toUpperCase()}`
      : ""

  const orderCitiesForDistrict =
    sriLankaDistrictCities[orderDistrict] ?? ["Colombo"]

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
        Click on any product below to view sizes, check salon availability across
        Sri Lanka, and place an order.
      </p>
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <button
              className={`product-card ${
                product.category === "Soap" ? "soap-card" : ""
              }`}
              key={product.name}
              onClick={() => {
                openProductWindow(product)
                onPreview?.(product.name)
              }}
              aria-label={`View ${product.name}`}
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
              ? "No products match the selected availability filter. Try clearing or changing your filters."
              : "Try a different search or clear your filters to explore the collection."}
          </p>
          <button onClick={clearFilters}>Clear all filters</button>
        </div>
      )}
      <p className="products-preview-note">
        Select any salon product above to inspect sizes, salon stock, location
        map, and order options.
      </p>

      {selectedProduct && (
        <div
          className="product-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-heading"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeAllWindows()
          }}
        >
          {/* WINDOW 1: PRODUCT DETAIL & AVAILABLE SALONS */}
          {!viewingSalon && !isOrdering && (
            <div className="product-window product-detail-window">
              <button
                type="button"
                className="product-window-close"
                onClick={closeAllWindows}
                aria-label="Close product window"
              >
                ✕
              </button>

              <div className="product-detail-layout">
                <div className="product-detail-image-panel">
                  <div className="product-detail-image-frame">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="product-detail-photo"
                    />
                  </div>
                </div>

                <div className="product-detail-body">
                  <h2 id="product-modal-heading" className="product-window-title">
                    {selectedProduct.name}
                  </h2>

                  <div className="product-detail-section">
                    <span className="product-section-heading">
                      Description :-
                    </span>
                    <div className="product-description-box">
                      <p>{selectedProduct.description}</p>
                    </div>
                  </div>

                  <div className="product-detail-section">
                    <span className="product-section-heading">
                      Select Product
                    </span>
                    <div
                      className="product-size-options"
                      role="group"
                      aria-label="Select product size"
                    >
                      {selectedProduct.sizes.map((size, index) => (
                        <button
                          key={size.label}
                          type="button"
                          className={`product-size-btn ${
                            selectedSizeIndex === index ? "is-selected" : ""
                          }`}
                          onClick={() => setSelectedSizeIndex(index)}
                          aria-pressed={selectedSizeIndex === index}
                        >
                          <span>{size.label}</span>
                          <small>Rs. {size.price}/-</small>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="product-detail-section product-salons-full">
                <div className="product-salons-header">
                  <span className="product-section-heading">
                    Available Salons :-
                  </span>
                  <div className="product-salons-filters">
                    <label className="product-mini-select">
                      <span className="sr-only">Filter by District</span>
                      <select
                        value={salonDistrictFilter}
                        onChange={(e) => {
                          setSalonDistrictFilter(e.target.value)
                          setSalonCityFilter("")
                        }}
                      >
                        <option value="">District</option>
                        {availableSalonDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="product-mini-select">
                      <span className="sr-only">Filter by City</span>
                      <select
                        value={salonCityFilter}
                        onChange={(e) => setSalonCityFilter(e.target.value)}
                      >
                        <option value="">City</option>
                        {availableSalonCities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="product-salons-box">
                  <table className="product-salons-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>City</th>
                        <th>Availability</th>
                        <th>
                          <span className="sr-only">Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProductSalons.map((salon) => (
                        <tr key={salon.id}>
                          <td className="salon-col-name">{salon.name}</td>
                          <td className="salon-col-city">{salon.city}</td>
                          <td>
                            <span
                              className={`salon-stock-pill ${
                                salon.availability === "In stock"
                                  ? "in-stock"
                                  : "out-of-stock"
                              }`}
                            >
                              {salon.availability === "In stock"
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>
                          </td>
                          <td className="salon-col-action">
                            <button
                              type="button"
                              className="salon-view-pill-btn"
                              onClick={() => openSalonView(salon)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* WINDOW 2: SALON VIEW WINDOW */}
          {viewingSalon && !isOrdering && activeSize && (
            <div className="product-window salon-view-window">
              <button
                type="button"
                className="product-window-close"
                onClick={closeAllWindows}
                aria-label="Close salon view window"
              >
                ✕
              </button>

              <h2 id="product-modal-heading" className="salon-view-title">
                {viewingSalon.name}
              </h2>

              <dl className="salon-view-specs">
                <div className="salon-view-spec-row">
                  <dt>Product Code</dt>
                  <dd>: {generatedProductCode}</dd>
                </div>
                <div className="salon-view-spec-row">
                  <dt>Product</dt>
                  <dd>
                    : {selectedProduct.name} {activeSize.label}
                  </dd>
                </div>
                <div className="salon-view-spec-row">
                  <dt>Price</dt>
                  <dd>: Rs. {activeSize.price}/-</dd>
                </div>
                <div className="salon-view-spec-row">
                  <dt>Contact No</dt>
                  <dd>: {viewingSalon.contactNo}</dd>
                </div>
              </dl>

              <div className="salon-view-map-section">
                <span className="salon-view-location-label">Location</span>
                <div className="salon-view-map-box">
                  <iframe
                    title={`Google Map location for ${viewingSalon.name}`}
                    src={`https://maps.google.com/maps?q=${viewingSalon.mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="salon-view-map-caption">
                    <span>
                      <strong>Google Map</strong> · {viewingSalon.address}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${viewingSalon.mapQuery}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="salon-view-actions">
                <button
                  type="button"
                  className="salon-action-pill primary"
                  onClick={openOrderWindow}
                >
                  Order now
                </button>
                <button
                  type="button"
                  className="salon-action-pill secondary"
                  onClick={() => setViewingSalon(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* WINDOW 3: CONFIRM ORDER WINDOW */}
          {viewingSalon && isOrdering && activeSize && (
            <div className="product-window confirm-order-window">
              <button
                type="button"
                className="product-window-close"
                onClick={closeAllWindows}
                aria-label="Close confirm order window"
              >
                ✕
              </button>

              <h2 id="product-modal-heading" className="confirm-order-title">
                Confirm Order
              </h2>

              <p className="confirm-order-summary">
                {selectedProduct.name} ({activeSize.label}) ·{" "}
                <strong>Rs. {activeSize.price}/-</strong> from{" "}
                <span>{viewingSalon.name}</span>
              </p>

              {orderSuccess ? (
                <div className="confirm-order-success" role="status">
                  <div className="confirm-order-check" aria-hidden="true">
                    ✓
                  </div>
                  <h3>
                    {orderSuccess.mode === "pay"
                      ? "Payment & Order Confirmed!"
                      : "Order Placed Successfully!"}
                  </h3>
                  <p>
                    Thank you, <strong>{customerName}</strong>. Your order for{" "}
                    <strong>
                      {orderSuccess.productName} ({orderSuccess.sizeLabel})
                    </strong>{" "}
                    at <strong>Rs. {orderSuccess.price}/-</strong> with{" "}
                    <strong>{orderSuccess.salonName}</strong> has been received.
                  </p>
                  <p className="confirm-order-subnote">
                    Delivery address: {customerAddress}, {orderCity},{" "}
                    {orderDistrict}. We will reach you on {contactNumber}
                    {billEmail ? ` and send your e-bill to ${billEmail}` : ""}.
                  </p>
                  <div className="confirm-order-buttons">
                    <button
                      type="button"
                      className="confirm-btn primary"
                      onClick={closeAllWindows}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  className="confirm-order-form"
                  onSubmit={(event: FormEvent) => {
                    event.preventDefault()
                    submitOrder("order")
                  }}
                  noValidate
                >
                  {orderError && (
                    <p className="confirm-order-error" role="alert">
                      {orderError}
                    </p>
                  )}

                  <label className="confirm-field-row">
                    <span className="confirm-field-label">Name :</span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </label>

                  <label className="confirm-field-row">
                    <span className="confirm-field-label">Address :</span>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Enter your street address"
                      required
                    />
                  </label>

                  <label className="confirm-field-row">
                    <span className="confirm-field-label">District :</span>
                    <select
                      value={orderDistrict}
                      onChange={(e) => {
                        const nextDistrict = e.target.value
                        setOrderDistrict(nextDistrict)
                        const nextCities =
                          sriLankaDistrictCities[nextDistrict] ?? []
                        setOrderCity(nextCities[0] ?? "")
                      }}
                    >
                      {Object.keys(sriLankaDistrictCities).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="confirm-field-row">
                    <span className="confirm-field-label">City :</span>
                    <select
                      value={orderCity}
                      onChange={(e) => setOrderCity(e.target.value)}
                    >
                      {orderCitiesForDistrict.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="confirm-field-row">
                    <span className="confirm-field-label">
                      Contact Number :
                    </span>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="077 446 6550"
                      required
                    />
                  </label>

                  <label className="confirm-field-row">
                    <span className="confirm-field-label">
                      Additional Number :
                    </span>
                    <input
                      type="tel"
                      value={additionalNumber}
                      onChange={(e) => setAdditionalNumber(e.target.value)}
                      placeholder="Optional secondary number"
                    />
                  </label>

                  <label className="confirm-field-row">
                    <span className="confirm-field-label">
                      Email (if bill is needed) :
                    </span>
                    <input
                      type="email"
                      value={billEmail}
                      onChange={(e) => setBillEmail(e.target.value)}
                      placeholder="Optional email for invoice"
                    />
                  </label>

                  <div className="confirm-order-buttons">
                    <button
                      type="submit"
                      className="confirm-btn primary"
                    >
                      Order Now
                    </button>
                    <button
                      type="button"
                      className="confirm-btn pay"
                      onClick={() => submitOrder("pay")}
                    >
                      Pay Now
                    </button>
                    <button
                      type="button"
                      className="confirm-btn back"
                      onClick={() => setIsOrdering(false)}
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
