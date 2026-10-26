import { FormEvent, useState } from "react"
import { directoryTitles, salonImages, salons } from "./SalonsPage"
import { products } from "./ProductsPage"
import type { AuthUser } from "./LoginPage"

type TabId =
  | "activities"
  | "reviews"
  | "profile"
  | "appointments"
  | "favorites"
  | "cart"

type Appointment = {
  id: string
  salonId: string
  service: string
  date: string
  time: string
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled"
  reviewed?: boolean
}
type Review = {
  id: string
  salonId: string
  rating: number
  text: string
  date: string
}
type Activity = { id: string; text: string; when: string; kind: string }
type CartItem = { name: string; brand: string; category: string; qty: number; image?: string }

const salonName = (id: string) =>
  directoryTitles[id] ?? salons.find((s) => s.id === id)?.name ?? "Salon"

const icons: Record<string, string> = {
  activities: "M3 12h4l3-8 4 16 3-8h4",
  reviews: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5",
  appointments: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM16 3v4M8 3v4M3 10h18",
  favorites: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z",
  cart: "M6 8h12l-1 12H7L6 8ZM9 8V6a3 3 0 0 1 6 0v2",
  check: "m5 12 5 5 9-10",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  pin: "M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
}

function Ico({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  )
}

function Stars({
  value,
  onChange,
}: {
  value: number
  onChange?: (n: number) => void
}) {
  return (
    <span
      className="dash-stars"
      role={onChange ? "radiogroup" : "img"}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className={n <= value ? "on" : ""}
            aria-hidden="true"
          >
            <path
              d={icons.reviews}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        )
        return onChange ? (
          <button
            type="button"
            key={n}
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        )
      })}
    </span>
  )
}

function Empty({
  title,
  text,
  href,
  cta,
}: {
  title: string
  text: string
  href: string
  cta: string
}) {
  return (
    <div className="products-empty">
      <h2>{title}</h2>
      <p>{text}</p>
      <a href={href} className="save-salon-button">
        {cta} →
      </a>
    </div>
  )
}

const tabs: { id: TabId; label: string }[] = [
  { id: "activities", label: "Activities" },
  { id: "reviews", label: "My Reviews" },
  { id: "profile", label: "Profile" },
  { id: "appointments", label: "My Appointments" },
  { id: "favorites", label: "My Favorite" },
  { id: "cart", label: "My Cart" },
]

export default function DashboardPage({
  user,
  favorites,
  onRemoveFavorite,
  onUpdateUser,
}: {
  user: AuthUser | null
  favorites: string[]
  onRemoveFavorite: (id: string) => void
  onUpdateUser: (user: AuthUser) => void
}) {
  const [tab, setTab] = useState<TabId>("activities")
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "a1", salonId: "colombo-studio", service: "Haircut & styling", date: "2026-10-22", time: "10:30 AM", status: "Confirmed" },
    { id: "a2", salonId: "galle-beauty", service: "Hair treatment", date: "2026-11-03", time: "2:00 PM", status: "Pending" },
    { id: "a3", salonId: "kandy-style", service: "Haircut", date: "2026-09-28", time: "11:00 AM", status: "Completed" },
    { id: "a4", salonId: "colombo-beauty", service: "Hair care", date: "2026-09-05", time: "4:30 PM", status: "Completed", reviewed: true },
  ])
  const [reviews, setReviews] = useState<Review[]>([
    { id: "r1", salonId: "colombo-beauty", rating: 5, text: "Warm, unhurried service and a treatment that left my hair soft for weeks. The team listened before they picked up the scissors.", date: "2026-09-07" },
    { id: "r2", salonId: "colombo-studio", rating: 4, text: "Clean space and a sharp cut. Booking was easy; I only wish the waiting area had more seating.", date: "2026-08-14" },
  ])
  const [activity, setActivity] = useState<Activity[]>([
    { id: "x1", kind: "appointments", text: "Appointment confirmed at Colombo Style Salon", when: "2 days ago" },
    { id: "x2", kind: "reviews", text: "You reviewed Colombo Beauty Salon (5 stars)", when: "5 weeks ago" },
    { id: "x3", kind: "favorites", text: "You joined Ceylon Cutz", when: "3 months ago" },
  ])
  const [cart, setCart] = useState<CartItem[]>([
    { name: products[0].name, brand: products[0].brand, category: products[0].category, qty: 1, image: products[0].image },
    { name: products[4].name.trim(), brand: products[4].brand, category: products[4].category, qty: 2, image: products[4].image },
  ])
  const [cartSent, setCartSent] = useState(false)
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [draft, setDraft] = useState({ rating: 5, text: "" })
  const [writing, setWriting] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const log = (kind: string, text: string) =>
    setActivity((a) => [{ id: `${Date.now()}`, kind, text, when: "Just now" }, ...a])

  if (!user) {
    return (
      <main className="products-main" id="dashboard-content" tabIndex={-1}>
        <Empty
          title="Log in to see your dashboard"
          text="Your appointments, reviews, favorites and cart live in your account."
          href="#login"
          cta="Log in"
        />
      </main>
    )
  }

  const upcoming = appointments.filter((a) => a.status === "Confirmed" || a.status === "Pending")
  const past = appointments.filter((a) => a.status === "Completed" || a.status === "Cancelled")
  const cartCount = cart.reduce((n, i) => n + i.qty, 0)
  const toReview = appointments.filter((a) => a.status === "Completed" && !a.reviewed)
  const next = [...upcoming].sort((a, b) => a.date.localeCompare(b.date))[0]
  const fmt = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  const first = user.firstName ?? user.name.split(" ")[0]
  const counts: Record<TabId, number> = {
    activities: 0,
    reviews: reviews.length,
    profile: 0,
    appointments: upcoming.length,
    favorites: favorites.length,
    cart: cartCount,
  }

  const cancel = (a: Appointment) => {
    setAppointments((list) => list.map((x) => (x.id === a.id ? { ...x, status: "Cancelled" } : x)))
    log("appointments", `You cancelled ${a.service} at ${salonName(a.salonId)}`)
  }
  const submitReview = (a: Appointment) => {
    if (!draft.text.trim()) return
    setReviews((r) => [{ id: `r${Date.now()}`, salonId: a.salonId, rating: draft.rating, text: draft.text.trim(), date: new Date().toISOString().slice(0, 10) }, ...r])
    setAppointments((list) => list.map((x) => (x.id === a.id ? { ...x, reviewed: true } : x)))
    log("reviews", `You reviewed ${salonName(a.salonId)} (${draft.rating} stars)`)
    setWriting(null)
    setDraft({ rating: 5, text: "" })
  }
  const saveReviewEdit = (id: string) => {
    if (!draft.text.trim()) return
    setReviews((r) => r.map((x) => (x.id === id ? { ...x, rating: draft.rating, text: draft.text.trim() } : x)))
    setEditingReview(null)
  }
  const setQty = (name: string, delta: number) =>
    setCart((c) => c.map((i) => (i.name === name ? { ...i, qty: Math.max(1, i.qty + delta) } : i)))
  const addToCart = (p: (typeof products)[number]) => {
    const name = p.name.trim()
    setCartSent(false)
    setCart((c) =>
      c.some((i) => i.name === name)
        ? c.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { name, brand: p.brand, category: p.category, qty: 1, image: p.image }],
    )
  }
  const saveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? "").trim()
    const firstName = get("firstName")
    const lastName = get("lastName")
    onUpdateUser({
      ...user,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || user.name,
      telephone: get("telephone"),
      address: get("address"),
      district: get("district"),
      town: get("town"),
      gender: get("gender"),
    })
    log("profile", "You updated your profile details")
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2600)
  }

  const suggestions = products.filter((p) => !cart.some((i) => i.name === p.name.trim())).slice(0, 4)

  return (
    <main className="products-main dash" id="dashboard-content" tabIndex={-1}>
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">Home</a>
        <span>/</span>
        <span aria-current="page">Dashboard</span>
      </nav>

      <section className="dash-hero">
        <div className="dash-avatar" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</div>
        <div className="dash-hero-text">
          <span className="products-eyebrow">
            {user.role === "partner" ? "SALON PARTNER" : "CLIENT ACCOUNT"} · {(user.district ?? "Sri Lanka").toUpperCase()}
          </span>
          <h1>
            Ayubowan, <span>{first}.</span>
          </h1>
          <p>
            {next
              ? `Your next visit is ${fmt(next.date)} at ${salonName(next.salonId)}.`
              : "No visits booked yet. Find a salon that gets your style."}
          </p>
        </div>
        <div className="dash-hero-actions">
          <a href="#salons" className="primary-button">Book an appointment</a>
        </div>
      </section>

      <div className="dash-tabs" role="tablist" aria-label="Dashboard sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="dash-panel"
            className="dash-tab"
            onClick={() => setTab(t.id)}
          >
            <Ico name={t.id} size={16} />
            <span>{t.label}</span>
            {counts[t.id] > 0 && <em>{counts[t.id]}</em>}
          </button>
        ))}
      </div>

      <div id="dash-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="dash-panel">
        {tab === "activities" && (
          <div className="dash-activities">
            <div className="dash-stats">
              {[
                ["Upcoming visits", upcoming.length, "appointments"],
                ["Reviews written", reviews.length, "reviews"],
                ["Saved salons", favorites.length, "favorites"],
                ["Items in cart", cartCount, "cart"],
              ].map(([label, n, id]) => (
                <button key={label as string} className="dash-stat" onClick={() => setTab(id as TabId)}>
                  <strong>{n}</strong>
                  <span>{label}</span>
                  <Ico name={id as string} size={18} />
                </button>
              ))}
            </div>

            <div className="dash-two">
              <section className="dash-card">
                <h2>Recent activity</h2>
                <ol className="dash-timeline">
                  {activity.slice(0, 7).map((a) => (
                    <li key={a.id}>
                      <span className="dash-dot"><Ico name={a.kind === "profile" ? "profile" : a.kind} size={14} /></span>
                      <div>
                        <p>{a.text}</p>
                        <time>{a.when}</time>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
              <aside className="dash-side">
                <section className="dash-next">
                  <span className="products-eyebrow">NEXT APPOINTMENT</span>
                  {next ? (
                    <>
                      <h3>{salonName(next.salonId)}</h3>
                      <p>{next.service}</p>
                      <div className="dash-when">
                        <span><Ico name="appointments" size={15} />{fmt(next.date)}</span>
                        <span><Ico name="clock" size={15} />{next.time}</span>
                      </div>
                      <button className="dash-link" onClick={() => setTab("appointments")}>Manage appointment →</button>
                    </>
                  ) : (
                    <p>Nothing scheduled.</p>
                  )}
                </section>
                {toReview.length > 0 && (
                  <section className="dash-card dash-nudge">
                    <h3>How was {salonName(toReview[0].salonId)}?</h3>
                    <p>Your feedback helps others choose a salon.</p>
                    <button
                      className="dash-link"
                      onClick={() => {
                        setTab("reviews")
                        setWriting(toReview[0].id)
                      }}
                    >
                      Write a review →
                    </button>
                  </section>
                )}
              </aside>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="dash-stack">
            {toReview.map((a) => (
              <article className="dash-card dash-pending" key={a.id}>
                <div className="dash-row">
                  <div>
                    <span className="products-eyebrow">AWAITING YOUR REVIEW</span>
                    <h3>{salonName(a.salonId)}</h3>
                    <p>{a.service} · {fmt(a.date)}</p>
                  </div>
                  {writing !== a.id && (
                    <button className="primary-button" onClick={() => { setWriting(a.id); setDraft({ rating: 5, text: "" }) }}>
                      Write review
                    </button>
                  )}
                </div>
                {writing === a.id && (
                  <div className="dash-form-inline">
                    <Stars value={draft.rating} onChange={(rating) => setDraft((d) => ({ ...d, rating }))} />
                    <label className="dash-sr" htmlFor={`rv-${a.id}`}>Your review</label>
                    <textarea id={`rv-${a.id}`} rows={3} placeholder="Tell others about your visit" value={draft.text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))} />
                    <div className="dash-actions">
                      <button className="primary-button" onClick={() => submitReview(a)}>Publish review</button>
                      <button className="dash-ghost" onClick={() => setWriting(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </article>
            ))}
            {reviews.length === 0 && (
              <Empty title="No reviews yet" text="After a visit, share how it went and it will appear here." href="#salons" cta="Explore salons" />
            )}
            {reviews.map((r) => (
              <article className="dash-card" key={r.id}>
                <div className="dash-row">
                  <div>
                    <h3>{salonName(r.salonId)}</h3>
                    <time className="dash-meta">{fmt(r.date)}</time>
                  </div>
                  {editingReview === r.id ? null : <Stars value={r.rating} />}
                </div>
                {editingReview === r.id ? (
                  <div className="dash-form-inline">
                    <Stars value={draft.rating} onChange={(rating) => setDraft((d) => ({ ...d, rating }))} />
                    <label className="dash-sr" htmlFor={`ed-${r.id}`}>Edit review</label>
                    <textarea id={`ed-${r.id}`} rows={3} value={draft.text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))} />
                    <div className="dash-actions">
                      <button className="primary-button" onClick={() => saveReviewEdit(r.id)}>Save changes</button>
                      <button className="dash-ghost" onClick={() => setEditingReview(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="dash-quote">{r.text}</p>
                    <div className="dash-actions">
                      <button className="dash-link" onClick={() => { setEditingReview(r.id); setDraft({ rating: r.rating, text: r.text }) }}>Edit</button>
                      <button className="dash-link danger" onClick={() => setReviews((x) => x.filter((i) => i.id !== r.id))}>Delete</button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}

        {tab === "appointments" && (
          <div className="dash-stack">
            <div className="dash-row">
              <h2 className="dash-h2">Upcoming</h2>
              <a href="#salons" className="dash-link">+ New appointment</a>
            </div>
            {upcoming.length === 0 && (
              <Empty title="Nothing booked" text="Pick a salon and choose a time that suits you." href="#salons" cta="Search salons" />
            )}
            {upcoming.map((a) => (
              <article className="dash-card dash-appt" key={a.id}>
                <div className="dash-date">
                  <strong>{new Date(`${a.date}T00:00:00`).getDate()}</strong>
                  <span>{new Date(`${a.date}T00:00:00`).toLocaleDateString("en-GB", { month: "short" }).toUpperCase()}</span>
                </div>
                <div className="dash-appt-body">
                  <h3>{salonName(a.salonId)}</h3>
                  <p>
                    {a.service} · {a.time} ·{" "}
                    <span className="dash-loc"><Ico name="pin" size={12} />{salons.find((s) => s.id === a.salonId)?.location}</span>
                  </p>
                </div>
                <span className={`dash-badge ${a.status.toLowerCase()}`}>{a.status}</span>
                <button className="dash-link danger" onClick={() => cancel(a)}>Cancel</button>
              </article>
            ))}
            <h2 className="dash-h2">History</h2>
            {past.map((a) => (
              <article className="dash-card dash-appt muted" key={a.id}>
                <div className="dash-date">
                  <strong>{new Date(`${a.date}T00:00:00`).getDate()}</strong>
                  <span>{new Date(`${a.date}T00:00:00`).toLocaleDateString("en-GB", { month: "short" }).toUpperCase()}</span>
                </div>
                <div className="dash-appt-body">
                  <h3>{salonName(a.salonId)}</h3>
                  <p>{a.service} · {a.time}</p>
                </div>
                <span className={`dash-badge ${a.status.toLowerCase()}`}>{a.status}</span>
                {a.status === "Completed" && !a.reviewed ? (
                  <button className="dash-link" onClick={() => { setTab("reviews"); setWriting(a.id); setDraft({ rating: 5, text: "" }) }}>Review</button>
                ) : (
                  <a className="dash-link" href={`#salons/${a.salonId}`}>Book again</a>
                )}
              </article>
            ))}
          </div>
        )}

        {tab === "favorites" &&
          (favorites.length ? (
            <div className="salons-grid">
              {salons
                .filter((s) => favorites.includes(s.id))
                .map((s) => (
                  <article className="product-card favorite-card" key={s.id}>
                    <a href={`#salons/${s.id}`} className="favorite-salon-link">
                      <img className="salon-photo" src={salonImages[s.id]} alt={`Interior of ${salonName(s.id)}`} loading="lazy" decoding="async" />
                      <span className="salon-location">{`${s.location} · ${s.gender}`}</span>
                      <h2>{salonName(s.id)}</h2>
                      <span className="dash-chips">
                        {s.services.map((x) => <i key={x}>{x}</i>)}
                      </span>
                      <span className="favorite-details">View salon details →</span>
                    </a>
                    <button className="favorite-remove" onClick={() => onRemoveFavorite(s.id)} aria-label={`Remove ${salonName(s.id)} from favorites`}>
                      Remove from favorites
                    </button>
                  </article>
                ))}
            </div>
          ) : (
            <Empty title="Your shortlist starts here" text="Save a salon from its detail page and it will appear here." href="#salons" cta="Explore salons" />
          ))}

        {tab === "cart" &&
          (cart.length ? (
            <div className="dash-two dash-cart">
              <section className="dash-card">
                <h2>Your items</h2>
                <ul className="dash-cart-list">
                  {cart.map((i) => (
                    <li key={i.name}>
                      <div className="dash-thumb" aria-hidden="true">
                        {i.image ? <img src={i.image} alt="" loading="lazy" /> : <svg width="26" height="30" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 24h14v31H14zM17 24v-8h8v8M21 16V9h13M28 9v5" /></svg>}
                      </div>
                      <div className="dash-cart-name">
                        <strong>{i.name}</strong>
                        <span>{i.category}{i.brand ? ` · ${i.brand}` : ""}</span>
                      </div>
                      <div className="dash-qty" role="group" aria-label={`Quantity for ${i.name}`}>
                        <button onClick={() => setQty(i.name, -1)} aria-label="Decrease quantity">−</button>
                        <span>{i.qty}</span>
                        <button onClick={() => setQty(i.name, 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button className="dash-link danger" onClick={() => setCart((c) => c.filter((x) => x.name !== i.name))}>Remove</button>
                    </li>
                  ))}
                </ul>
              </section>
              <aside className="dash-card dash-summary">
                <h2>Summary</h2>
                <dl>
                  <div><dt>Products</dt><dd>{cart.length}</dd></div>
                  <div><dt>Total units</dt><dd>{cartCount}</dd></div>
                  <div><dt>Pricing</dt><dd>Set by salon</dd></div>
                </dl>
                <p className="dash-note">Prices and availability are confirmed by the partner salon. Nothing is charged online.</p>
                {cartSent ? (
                  <p role="status" className="dash-success"><Ico name="check" size={16} /> Request sent. A salon will contact you.</p>
                ) : (
                  <button className="primary-button dash-wide" onClick={() => { setCartSent(true); log("cart", `You sent a request for ${cartCount} products`) }}>
                    Request from salon
                  </button>
                )}
              </aside>
            </div>
          ) : (
            <Empty title="Your cart is empty" text="Browse salon products and add what you need." href="#products" cta="Browse products" />
          ))}
        {tab === "cart" && suggestions.length > 0 && (
          <section className="dash-suggest">
            <h2 className="dash-h2">Add more from the catalog</h2>
            <div>
              {suggestions.map((p) => (
                <button key={p.name} onClick={() => addToCart(p)}>
                  <span>{p.name.trim()}</span>
                  <em>+ Add</em>
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === "profile" && (
          <div className="dash-two dash-profile">
            <form className="dash-card" onSubmit={saveProfile} key={user.email + user.name}>
              <h2>Personal details</h2>
              <div className="dash-fields">
                <label>First name<input name="firstName" defaultValue={user.firstName ?? user.name.split(" ")[0]} required /></label>
                <label>Last name<input name="lastName" defaultValue={user.lastName ?? user.name.split(" ").slice(1).join(" ")} /></label>
                <label className="full">Email<input value={user.email} readOnly aria-readonly="true" /></label>
                <label>Telephone<input name="telephone" type="tel" defaultValue={user.telephone ?? ""} /></label>
                <label>Gender
                  <select name="gender" defaultValue={user.gender ?? ""}>
                    <option value="">Prefer not to say</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="full">Address<input name="address" defaultValue={user.address ?? ""} /></label>
                <label>District<input name="district" defaultValue={user.district ?? ""} /></label>
                <label>Town<input name="town" defaultValue={user.town ?? ""} /></label>
              </div>
              <div className="dash-actions">
                <button className="primary-button" type="submit">Save changes</button>
                {saved && <span role="status" className="dash-success"><Ico name="check" size={16} /> Saved</span>}
              </div>
            </form>
            <aside className="dash-side">
              <section className="dash-card">
                <h3>Account</h3>
                <dl className="dash-facts">
                  <div><dt>Type</dt><dd>{user.role === "partner" ? "Salon partner" : "Client"}</dd></div>
                  {user.salonName && <div><dt>Salon</dt><dd>{user.salonName}</dd></div>}
                  <div><dt>Login</dt><dd>Email address</dd></div>
                </dl>
              </section>
              <section className="dash-card">
                <h3>Need a salon owner account?</h3>
                <p>Contact the admin at <a className="dash-inline" href="mailto:admin@ceyloncutz.lk">admin@ceyloncutz.lk</a>.</p>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
