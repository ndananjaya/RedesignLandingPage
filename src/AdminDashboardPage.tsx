import { FormEvent, useEffect, useRef, useState } from "react"
import { directoryTitles, salonImages, salons as initialSalons } from "./SalonsPage"
import type { AuthUser } from "./LoginPage"

type AdminTabId =
  | "activities"
  | "salons"
  | "resources"
  | "packagers"
  | "orders"
  | "requests"
  | "settings"

type ManagedSalon = {
  id: string
  name: string
  ownerName: string
  ownerEmail: string
  phone: string
  location: string
  gender: "Unisex" | "Men" | "Women"
  packageName: string
  status: "Active" | "Suspended"
  image: string
  storageMb: number
  storageQuotaMb: number
  ramMb: number
  cpuPercent: number
}

type SalonPackage = {
  id: string
  name: string
  badge: string
  monthlyPrice: number
  storageLimitGb: number
  ramAllocationMb: number
  cpuPriority: string
  maxProducts: number
  activeSalonsCount: number
  features: string[]
}

type PlatformOrder = {
  id: string
  customerName: string
  customerPhone: string
  salonName: string
  productName: string
  size: string
  amount: number
  date: string
  status: "Active" | "Completed" | "Returned"
  returnReason?: string
}

type OwnerRequest = {
  id: string
  salonName: string
  ownerName: string
  ownerEmail: string
  category:
    | "New Salon Registration"
    | "Package Upgrade"
    | "Resource Quota Increase"
    | "Product Listing Approval"
  subject: string
  message: string
  submittedAt: string
  status: "Pending" | "Approved" | "Rejected"
}

type AdminNotification = {
  id: string
  title: string
  detail: string
  time: string
  unread: boolean
  targetTab: AdminTabId
}

type AdminActivity = {
  id: string
  text: string
  when: string
  kind: AdminTabId
}

const adminIcons: Record<string, string> = {
  activities: "M3 12h4l3-8 4 16 3-8h4",
  salons: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5",
  resources:
    "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6ZM4 15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3ZM8 7.5h.01M8 16.5h.01",
  packagers:
    "M12 2 3 7l9 5 9-5-9-5ZM3 12l9 5 9-5M3 17l9 5 9-5",
  orders: "M6 8h12l-1 12H7L6 8ZM9 8V6a3 3 0 0 1 6 0v2",
  requests:
    "M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 3V7a2 2 0 0 1 2-2Z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  calendar: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM16 3v4M8 3v4M3 10h18",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z",
  heart: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z",
  check: "m5 12 5 5 9-10",
}

function AdminIcon({ name, size = 18 }: { name: string; size?: number }) {
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
      <path d={adminIcons[name] ?? adminIcons.activities} />
    </svg>
  )
}

function formatAdminDateAndTime(now: Date) {
  const datePart = now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  const hours24 = now.getHours()
  const ampm = hours24 >= 12 ? "PM" : "AM"
  const hours12 = hours24 % 12 || 12
  const hh = String(hours12).padStart(2, "0")
  const mm = String(now.getMinutes()).padStart(2, "0")
  const ss = String(now.getSeconds()).padStart(2, "0")
  return `${datePart} · ${hh}:${mm}:${ss} ${ampm}`
}

const adminTabs: { id: AdminTabId; label: string }[] = [
  { id: "activities", label: "Activities" },
  { id: "salons", label: "All Salons" },
  { id: "resources", label: "Resource usage" },
  { id: "packagers", label: "Packagers" },
  { id: "orders", label: "Orders" },
  { id: "requests", label: "Requests" },
  { id: "settings", label: "Settings" },
]

export default function AdminDashboardPage({
  user,
}: {
  user: AuthUser | null
}) {
  const [tab, setTab] = useState<AdminTabId>("activities")
  const [now, setNow] = useState(() => new Date())
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: "an1",
      title: "High Resource Alert",
      detail: "Colombo Style Salon reached 84% of its allocated storage quota.",
      time: "12 mins ago",
      unread: true,
      targetTab: "resources",
    },
    {
      id: "an2",
      title: "3 Salon Owner Requests",
      detail: "Package upgrade and product catalog approvals awaiting admin review.",
      time: "1 hour ago",
      unread: true,
      targetTab: "requests",
    },
  ])

  const [managedSalons, setManagedSalons] = useState<ManagedSalon[]>(() =>
    initialSalons.map((s, idx) => ({
      id: s.id,
      name: directoryTitles[s.id] ?? s.name,
      ownerName: [
        "Kasun Perera",
        "Ruwan Silva",
        "Dilani Jayawardena",
        "Nadeesha Fernando",
        "Chathura Bandara",
        "Malith Wickramasinghe",
      ][idx % 6],
      ownerEmail: `${s.id.replace("-", ".")}@ceyloncutz.lk`,
      phone: [
        "077 446 6550",
        "071 882 3410",
        "077 889 9112",
        "071 234 5678",
        "076 554 4332",
        "077 332 2110",
      ][idx % 6],
      location: s.location,
      gender: (s.gender as "Unisex" | "Men" | "Women") ?? "Unisex",
      packageName:
        idx === 0 || idx === 3
          ? "Enterprise Luxe"
          : idx === 1 || idx === 2
            ? "Professional Studio"
            : "Starter Salon",
      status: "Active",
      image: salonImages[s.id] ?? "/images/salons/salon-1.png",
      storageMb: [4200, 1850, 3100, 3800, 1450, 980][idx % 6],
      storageQuotaMb: [5000, 3000, 3000, 5000, 2000, 2000][idx % 6],
      ramMb: [1680, 920, 1240, 1520, 740, 610][idx % 6],
      cpuPercent: [34, 18, 26, 31, 14, 11][idx % 6],
    })),
  )

  const [salonSearch, setSalonSearch] = useState("")
  const [salonLocationFilter, setSalonLocationFilter] = useState("")
  const [editingSalon, setEditingSalon] = useState<ManagedSalon | null>(null)
  const [addingSalonOpen, setAddingSalonOpen] = useState(false)
  const [newSalonForm, setNewSalonForm] = useState({
    name: "",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    location: "Colombo",
    gender: "Unisex" as "Unisex" | "Men" | "Women",
    packageName: "Professional Studio",
  })

  const [packages, setPackages] = useState<SalonPackage[]>([
    {
      id: "pkg-starter",
      name: "Starter Salon",
      badge: "ESSENTIAL",
      monthlyPrice: 4500,
      storageLimitGb: 2,
      ramAllocationMb: 1024,
      cpuPriority: "Standard (1 vCPU Burst)",
      maxProducts: 15,
      activeSalonsCount: 92,
      features: [
        "Public Salon Profile & QR Code",
        "Up to 15 Product Catalog Listings",
        "2 GB Media & Portfolio Storage",
        "Standard Appointment Booking",
      ],
    },
    {
      id: "pkg-pro",
      name: "Professional Studio",
      badge: "MOST POPULAR",
      monthlyPrice: 9500,
      storageLimitGb: 3,
      ramAllocationMb: 2048,
      cpuPriority: "High Priority (2 vCPU)",
      maxProducts: 50,
      activeSalonsCount: 114,
      features: [
        "Featured Directory Placement",
        "Up to 50 Product Listings & Direct Orders",
        "3 GB High-Speed Media Storage",
        "SMS & Email Appointment Reminders",
      ],
    },
    {
      id: "pkg-enterprise",
      name: "Enterprise Luxe",
      badge: "UNLIMITED SCALE",
      monthlyPrice: 18500,
      storageLimitGb: 5,
      ramAllocationMb: 4096,
      cpuPriority: "Dedicated (4 vCPU)",
      maxProducts: 200,
      activeSalonsCount: 44,
      features: [
        "Multi-Branch Salon Management",
        "Up to 200 Products & Priority Checkout",
        "5 GB Dedicated Cloud Storage & 4 GB RAM",
        "24/7 Dedicated Account Manager",
      ],
    },
  ])
  const [editingPackage, setEditingPackage] = useState<SalonPackage | null>(null)

  const [orders, setOrders] = useState<PlatformOrder[]>([
    {
      id: "ORD-9041",
      customerName: "Karish Perera",
      customerPhone: "077 446 6550",
      salonName: "Colombo Style Salon",
      productName: "Sunslik Shampoo",
      size: "250 ml",
      amount: 850,
      date: "29 Oct 2026",
      status: "Active",
    },
    {
      id: "ORD-9042",
      customerName: "Tharushi Mendis",
      customerPhone: "071 334 9981",
      salonName: "Colombo Beauty Salon",
      productName: "Bellose Shampoo",
      size: "350 ml",
      amount: 1350,
      date: "29 Oct 2026",
      status: "Active",
    },
    {
      id: "ORD-9043",
      customerName: "Kavindu Rajapaksha",
      customerPhone: "076 221 4409",
      salonName: "Kandy Style Salon",
      productName: "Dreamron Shampoo",
      size: "250 ml",
      amount: 890,
      date: "28 Oct 2026",
      status: "Active",
    },
    {
      id: "ORD-8994",
      customerName: "Nethmi Perera",
      customerPhone: "077 123 4567",
      salonName: "Colombo Style Salon",
      productName: "Khomba Soap",
      size: "100 g",
      amount: 240,
      date: "25 Oct 2026",
      status: "Completed",
    },
    {
      id: "ORD-8988",
      customerName: "Sachini De Silva",
      customerPhone: "075 667 8890",
      salonName: "Galle Beauty Salon",
      productName: "Rani Soap",
      size: "150 g",
      amount: 360,
      date: "23 Oct 2026",
      status: "Completed",
    },
    {
      id: "ORD-8962",
      customerName: "Dinesh Karunaratne",
      customerPhone: "077 910 2233",
      salonName: "Galle Barber Salon",
      productName: "Lifebuoy Shampoo",
      size: "100 ml",
      amount: 390,
      date: "20 Oct 2026",
      status: "Returned",
      returnReason: "Customer requested exchange for 250 ml bottle.",
    },
  ])
  const [orderFilter, setOrderFilter] = useState<
    "All" | "Active" | "Completed" | "Returned"
  >("All")

  const [requests, setRequests] = useState<OwnerRequest[]>([
    {
      id: "REQ-301",
      salonName: "Galle Beauty Salon",
      ownerName: "Dilani Jayawardena",
      ownerEmail: "galle.beauty@ceyloncutz.lk",
      category: "Package Upgrade",
      subject: "Upgrade from Professional Studio to Enterprise Luxe",
      message:
        "We are opening a second treatment wing next month and need 5 GB storage and higher product limits.",
      submittedAt: "Today, 09:45 AM",
      status: "Pending",
    },
    {
      id: "REQ-302",
      salonName: "Colombo Style Salon",
      ownerName: "Kasun Perera",
      ownerEmail: "colombo.studio@ceyloncutz.lk",
      category: "Resource Quota Increase",
      subject: "Additional 2 GB media storage for lookbook photos",
      message:
        "Our high-resolution bridal and styling gallery is at 84% capacity. Requesting extra storage allocation.",
      submittedAt: "Yesterday, 04:15 PM",
      status: "Pending",
    },
    {
      id: "REQ-303",
      salonName: "Kandy Barber Salon",
      ownerName: "Ruwan Silva",
      ownerEmail: "kandy.barber@ceyloncutz.lk",
      category: "Product Listing Approval",
      subject: "Approve stock update for Dreamron & Bellose 350 ml",
      message:
        "We received 40 new units of Dreamron and Bellose shampoos. Please verify our updated stock badge.",
      submittedAt: "27 Oct 2026",
      status: "Approved",
    },
  ])

  const [settings, setSettings] = useState({
    siteName: "Ceylon Cutz",
    adminEmail: "admin@ceyloncutz.lk",
    hotline: "+94 11 234 5678",
    enforceStrongPassword: true,
    requireAdmin2FA: true,
    manualSalonVerification: true,
    onlinePaymentsEnabled: true,
    cashOnDeliveryEnabled: true,
    maintenanceMode: false,
    cpuAlertThreshold: "80",
    ramAlertThreshold: "85",
    backupSchedule: "Daily at 02:00 AM",
  })
  const [settingsSaved, setSettingsSaved] = useState(false)

  const [activityLog, setActivityLog] = useState<AdminActivity[]>([
    {
      id: "act1",
      kind: "salons",
      text: "Verified salon profile for Colombo Style Salon",
      when: "25 mins ago",
    },
    {
      id: "act2",
      kind: "orders",
      text: "Order ORD-9041 placed for Sunslik Shampoo (250 ml)",
      when: "1 hour ago",
    },
    {
      id: "act3",
      kind: "resources",
      text: "Automated daily resource snapshot completed (28.5% CPU, 11.4 GB RAM)",
      when: "3 hours ago",
    },
    {
      id: "act4",
      kind: "requests",
      text: "Approved product stock listing request REQ-303 for Kandy Barber Salon",
      when: "Yesterday",
    },
  ])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!notifOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [notifOpen])

  const pushActivity = (kind: AdminTabId, text: string) => {
    setActivityLog((prev) => [
      { id: `${Date.now()}`, kind, text, when: "Just now" },
      ...prev,
    ])
  }

  const unreadCount = notifications.filter((n) => n.unread).length
  const pendingRequestsCount = requests.filter((r) => r.status === "Pending").length
  const activeOrdersCount = orders.filter((o) => o.status === "Active").length
  const highUsageSalonsCount = managedSalons.filter(
    (s) => s.storageMb / s.storageQuotaMb >= 0.75,
  ).length

  // Hero KPI numbers matching screenshot (256 Active users, 250 Registered Salons, 0 Pending Salons, 300 Active orders)
  const registeredSalonsTotal = 250 + (managedSalons.length - initialSalons.length)
  const activeOrdersTotal = 300 + (activeOrdersCount - 3)

  const tabBadges: Partial<Record<AdminTabId, number>> = {
    resources: highUsageSalonsCount,
    packagers: 2,
    orders: activeOrdersCount,
    requests: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
  }

  const handleCreateSalon = (event: FormEvent) => {
    event.preventDefault()
    if (!newSalonForm.name.trim() || !newSalonForm.ownerName.trim()) return
    const id = `${newSalonForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-3)}`
    const created: ManagedSalon = {
      id,
      name: newSalonForm.name.trim(),
      ownerName: newSalonForm.ownerName.trim(),
      ownerEmail:
        newSalonForm.ownerEmail.trim() || `${id}@ceyloncutz.lk`,
      phone: newSalonForm.phone.trim() || "077 000 0000",
      location: newSalonForm.location,
      gender: newSalonForm.gender,
      packageName: newSalonForm.packageName,
      status: "Active",
      image: "/images/salons/salon-2.png",
      storageMb: 320,
      storageQuotaMb:
        newSalonForm.packageName === "Enterprise Luxe"
          ? 5000
          : newSalonForm.packageName === "Professional Studio"
            ? 3000
            : 2000,
      ramMb: 480,
      cpuPercent: 9,
    }
    setManagedSalons((prev) => [created, ...prev])
    pushActivity("salons", `Added new salon "${created.name}" (${created.location})`)
    setAddingSalonOpen(false)
    setNewSalonForm({
      name: "",
      ownerName: "",
      ownerEmail: "",
      phone: "",
      location: "Colombo",
      gender: "Unisex",
      packageName: "Professional Studio",
    })
    setTab("salons")
  }

  const handleSaveSalonEdit = (event: FormEvent) => {
    event.preventDefault()
    if (!editingSalon) return
    setManagedSalons((prev) =>
      prev.map((s) => (s.id === editingSalon.id ? editingSalon : s)),
    )
    pushActivity("salons", `Updated salon details for "${editingSalon.name}"`)
    setEditingSalon(null)
  }

  const handleDeleteSalon = (salon: ManagedSalon) => {
    setManagedSalons((prev) => prev.filter((s) => s.id !== salon.id))
    pushActivity("salons", `Deleted salon "${salon.name}" from platform`)
  }

  const filteredSalons = managedSalons.filter(
    (s) =>
      (!salonLocationFilter || s.location === salonLocationFilter) &&
      `${s.name} ${s.ownerName} ${s.location} ${s.packageName}`
        .toLowerCase()
        .includes(salonSearch.trim().toLowerCase()),
  )

  const filteredOrders = orders.filter(
    (o) => orderFilter === "All" || o.status === orderFilter,
  )

  const adminDisplayName = user?.firstName ?? user?.name ?? "Admin"

  return (
    <main className="products-main dash admin-dash" id="dashboard-content" tabIndex={-1}>
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">Home</a>
        <span>/</span>
        <span aria-current="page">Admin Dashboard</span>
      </nav>

      {/* HERO BANNER MATCHING SCREENSHOT */}
      <section className="dash-hero">
        <div className="dash-avatar" aria-hidden="true">
          {adminDisplayName.slice(0, 1).toUpperCase()}
        </div>
        <div className="dash-hero-text">
          <h1>
            Ayubowan, <span>{adminDisplayName}.</span>
          </h1>
          <p className="dash-datetime" aria-live="off">
            {formatAdminDateAndTime(now)}
          </p>
        </div>
        <div className="dash-hero-actions">
          <div className="dash-notif-wrap" ref={notifRef}>
            <button
              type="button"
              className="dash-notif-button"
              onClick={() => setNotifOpen((prev) => !prev)}
              aria-expanded={notifOpen}
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <AdminIcon name="bell" size={18} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="dash-notif-badge">{unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div
                className="dash-notif-popover"
                role="region"
                aria-label="Admin notifications"
              >
                <div className="dash-notif-header">
                  <strong>Admin Alerts</strong>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="dash-notif-mark"
                      onClick={() =>
                        setNotifications((list) =>
                          list.map((n) => ({ ...n, unread: false })),
                        )
                      }
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <ul className="dash-notif-list">
                  {notifications.map((item) => (
                    <li key={item.id} className={item.unread ? "is-unread" : ""}>
                      <button
                        type="button"
                        className="dash-notif-item"
                        onClick={() => {
                          setNotifications((list) =>
                            list.map((n) =>
                              n.id === item.id ? { ...n, unread: false } : n,
                            ),
                          )
                          setTab(item.targetTab)
                          setNotifOpen(false)
                        }}
                      >
                        <div className="dash-notif-item-top">
                          <strong>{item.title}</strong>
                          <time>{item.time}</time>
                        </div>
                        <p>{item.detail}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => setAddingSalonOpen(true)}
          >
            + Add new Salon
          </button>
        </div>
      </section>

      {/* ADMIN TAB BAR */}
      <div className="dash-tabs" role="tablist" aria-label="Admin dashboard sections">
        {adminTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`admin-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="admin-dash-panel"
            className="dash-tab"
            onClick={() => setTab(t.id)}
          >
            <AdminIcon name={t.id} size={16} />
            <span>{t.label}</span>
            {tabBadges[t.id] !== undefined && <em>{tabBadges[t.id]}</em>}
          </button>
        ))}
      </div>

      <div
        id="admin-dash-panel"
        role="tabpanel"
        aria-labelledby={`admin-tab-${tab}`}
        className="dash-panel"
      >
        {/* TAB 1: ACTIVITIES */}
        {tab === "activities" && (
          <div className="dash-activities">
            <div className="dash-stats">
              <button
                type="button"
                className="dash-stat"
                onClick={() => setTab("activities")}
              >
                <strong>256</strong>
                <span>Active users</span>
                <AdminIcon name="calendar" size={18} />
              </button>
              <button
                type="button"
                className="dash-stat"
                onClick={() => setTab("salons")}
              >
                <strong>{registeredSalonsTotal}</strong>
                <span>Registered Salons</span>
                <AdminIcon name="star" size={18} />
              </button>
              <button
                type="button"
                className="dash-stat"
                onClick={() => setTab("requests")}
              >
                <strong>0</strong>
                <span>Pending Salons</span>
                <AdminIcon name="heart" size={18} />
              </button>
              <button
                type="button"
                className="dash-stat"
                onClick={() => setTab("orders")}
              >
                <strong>{activeOrdersTotal}</strong>
                <span>Active orders</span>
                <AdminIcon name="orders" size={18} />
              </button>
            </div>

            <div className="dash-two">
              <section className="dash-card">
                <h2>Platform activity log</h2>
                <ol className="dash-timeline">
                  {activityLog.map((a) => (
                    <li key={a.id}>
                      <span className="dash-dot">
                        <AdminIcon name={a.kind} size={14} />
                      </span>
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
                  <span className="products-eyebrow">PLATFORM SYSTEM HEALTH</span>
                  <h3>All Systems Operational</h3>
                  <p>
                    Storage: 184.6 GB / 500 GB · RAM: 11.4 GB / 32 GB · CPU: 28.5%
                  </p>
                  <button
                    type="button"
                    className="dash-link"
                    onClick={() => setTab("resources")}
                  >
                    Inspect resource usage →
                  </button>
                </section>

                <section className="dash-card dash-nudge">
                  <h3>{pendingRequestsCount} Salon Owner Requests</h3>
                  <p>
                    Review package upgrades and storage quota requests from salon
                    partners.
                  </p>
                  <button
                    type="button"
                    className="dash-link"
                    onClick={() => setTab("requests")}
                  >
                    Review requests →
                  </button>
                </section>
              </aside>
            </div>
          </div>
        )}

        {/* TAB 2: ALL SALONS */}
        {tab === "salons" && (
          <div className="dash-stack">
            <div className="admin-toolbar-card">
              <div>
                <h2 className="dash-h2">All Registered Salons</h2>
                <p className="admin-subtext">
                  Manage salon profiles, edit owner details, change packages, or
                  remove salons from Ceylon Cutz.
                </p>
              </div>
              <div className="admin-toolbar-controls">
                <input
                  type="search"
                  className="admin-input"
                  placeholder="Search salon or owner…"
                  value={salonSearch}
                  onChange={(e) => setSalonSearch(e.target.value)}
                />
                <select
                  className="admin-select"
                  value={salonLocationFilter}
                  onChange={(e) => setSalonLocationFilter(e.target.value)}
                >
                  <option value="">All locations</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                </select>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setAddingSalonOpen(true)}
                >
                  + Add new Salon
                </button>
              </div>
            </div>

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Salon</th>
                    <th>Owner &amp; Contact</th>
                    <th>Location · Gender</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalons.map((salon) => (
                    <tr key={salon.id}>
                      <td>
                        <div className="admin-salon-cell">
                          <img
                            src={salon.image}
                            alt={salon.name}
                            className="admin-salon-thumb"
                          />
                          <div>
                            <strong>{salon.name}</strong>
                            <span>ID: {salon.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-meta-cell">
                          <strong>{salon.ownerName}</strong>
                          <span>
                            {salon.ownerEmail} · {salon.phone}
                          </span>
                        </div>
                      </td>
                      <td>
                        {salon.location} · <span>{salon.gender}</span>
                      </td>
                      <td>
                        <span className="admin-pkg-pill">{salon.packageName}</span>
                      </td>
                      <td>
                        <span
                          className={`dash-badge ${
                            salon.status === "Active" ? "confirmed" : "cancelled"
                          }`}
                        >
                          {salon.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="salon-view-pill-btn"
                            onClick={() => setEditingSalon({ ...salon })}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-delete-btn"
                            onClick={() => handleDeleteSalon(salon)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: RESOURCE USAGE */}
        {tab === "resources" && (
          <div className="dash-stack">
            <div className="admin-resource-grid">
              <article className="dash-card admin-resource-card">
                <div className="admin-resource-top">
                  <span className="products-eyebrow">TOTAL PLATFORM STORAGE</span>
                  <strong>184.6 GB / 500 GB</strong>
                </div>
                <div className="admin-meter">
                  <div className="admin-meter-fill" style={{ width: "37%" }} />
                </div>
                <p>
                  36.9% utilized across salon media galleries, product images, and
                  database backups.
                </p>
              </article>

              <article className="dash-card admin-resource-card">
                <div className="admin-resource-top">
                  <span className="products-eyebrow">PLATFORM RAM MEMORY</span>
                  <strong>11.4 GB / 32 GB</strong>
                </div>
                <div className="admin-meter">
                  <div className="admin-meter-fill" style={{ width: "36%" }} />
                </div>
                <p>
                  35.6% active memory across booking engine, live search cache, and
                  partner sessions.
                </p>
              </article>

              <article className="dash-card admin-resource-card">
                <div className="admin-resource-top">
                  <span className="products-eyebrow">PROCESSING POWER (CPU)</span>
                  <strong>28.5% · 8 vCPU</strong>
                </div>
                <div className="admin-meter">
                  <div className="admin-meter-fill" style={{ width: "29%" }} />
                </div>
                <p>
                  Healthy compute load with 99.98% uptime over the last 30 days.
                </p>
              </article>
            </div>

            <section className="admin-table-card">
              <div className="admin-card-head">
                <div>
                  <h2>Salon-by-Salon Resource Breakdown</h2>
                  <p className="admin-subtext">
                    Live storage, RAM memory, and CPU processing consumption per
                    registered salon.
                  </p>
                </div>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Salon Name</th>
                    <th>Package Tier</th>
                    <th>Storage Used</th>
                    <th>RAM Usage</th>
                    <th>CPU Processing</th>
                    <th>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {managedSalons.map((salon) => {
                    const storagePct = Math.min(
                      100,
                      Math.round((salon.storageMb / salon.storageQuotaMb) * 100),
                    )
                    const highLoad = storagePct >= 75
                    return (
                      <tr key={salon.id}>
                        <td>
                          <strong>{salon.name}</strong>
                          <div className="admin-subtext">{salon.location}</div>
                        </td>
                        <td>
                          <span className="admin-pkg-pill">{salon.packageName}</span>
                        </td>
                        <td>
                          <div className="admin-inline-usage">
                            <span>
                              {(salon.storageMb / 1000).toFixed(2)} GB /{" "}
                              {(salon.storageQuotaMb / 1000).toFixed(1)} GB (
                              {storagePct}%)
                            </span>
                            <div className="admin-mini-bar">
                              <div
                                className={`admin-mini-fill ${highLoad ? "warn" : ""}`}
                                style={{ width: `${storagePct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{salon.ramMb} MB</strong>
                        </td>
                        <td>
                          <strong>{salon.cpuPercent}%</strong> vCPU
                        </td>
                        <td>
                          <span
                            className={`dash-badge ${
                              highLoad ? "pending" : "confirmed"
                            }`}
                          >
                            {highLoad ? "Near Quota" : "Optimal"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* TAB 4: PACKAGERS (PACKAGES FOR SALON OWNERS) */}
        {tab === "packagers" && (
          <div className="dash-stack">
            <div className="admin-toolbar-card">
              <div>
                <h2 className="dash-h2">Salon Owner Subscription Packages</h2>
                <p className="admin-subtext">
                  Configure pricing, storage quotas, RAM allocations, and product
                  catalog limits for salon partners.
                </p>
              </div>
            </div>

            <div className="admin-packages-grid">
              {packages.map((pkg) => (
                <article className="dash-card admin-package-card" key={pkg.id}>
                  <span className="products-eyebrow">{pkg.badge}</span>
                  <h3>{pkg.name}</h3>
                  <div className="admin-package-price">
                    <strong>Rs. {pkg.monthlyPrice.toLocaleString()}</strong>
                    <span>/ month</span>
                  </div>
                  <p className="admin-subtext">
                    <strong>{pkg.activeSalonsCount}</strong> active salons subscribed
                  </p>
                  <dl className="dash-facts">
                    <div>
                      <dt>Storage Quota</dt>
                      <dd>{pkg.storageLimitGb} GB</dd>
                    </div>
                    <div>
                      <dt>RAM Allocation</dt>
                      <dd>{pkg.ramAllocationMb} MB</dd>
                    </div>
                    <div>
                      <dt>Processing Tier</dt>
                      <dd>{pkg.cpuPriority}</dd>
                    </div>
                    <div>
                      <dt>Max Products</dt>
                      <dd>{pkg.maxProducts} items</dd>
                    </div>
                  </dl>
                  <ul className="admin-package-features">
                    {pkg.features.map((f) => (
                      <li key={f}>
                        <AdminIcon name="check" size={14} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="salon-view-pill-btn dash-wide"
                    onClick={() => setEditingPackage({ ...pkg })}
                  >
                    Edit Package
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS */}
        {tab === "orders" && (
          <div className="dash-stack">
            <div className="admin-order-kpis">
              <button
                type="button"
                className={`dash-card admin-order-kpi ${
                  orderFilter === "Active" ? "is-active" : ""
                }`}
                onClick={() => setOrderFilter("Active")}
              >
                <span className="products-eyebrow">CURRENTLY ACTIVE</span>
                <strong>
                  {orders.filter((o) => o.status === "Active").length}
                </strong>
                <span>Active orders in fulfillment</span>
              </button>
              <button
                type="button"
                className={`dash-card admin-order-kpi ${
                  orderFilter === "Completed" ? "is-active" : ""
                }`}
                onClick={() => setOrderFilter("Completed")}
              >
                <span className="products-eyebrow">COMPLETED ORDERS</span>
                <strong>
                  {orders.filter((o) => o.status === "Completed").length}
                </strong>
                <span>Delivered &amp; settled</span>
              </button>
              <button
                type="button"
                className={`dash-card admin-order-kpi ${
                  orderFilter === "Returned" ? "is-active" : ""
                }`}
                onClick={() => setOrderFilter("Returned")}
              >
                <span className="products-eyebrow">RETURNED ORDERS</span>
                <strong>
                  {orders.filter((o) => o.status === "Returned").length}
                </strong>
                <span>Returned or exchanged</span>
              </button>
            </div>

            <div className="admin-table-card">
              <div className="admin-card-head">
                <h2>Platform Product Orders ({orderFilter})</h2>
                <div className="admin-filter-pills">
                  {(["All", "Active", "Completed", "Returned"] as const).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        className={`salon-view-pill-btn ${
                          orderFilter === status ? "is-selected" : ""
                        }`}
                        onClick={() => setOrderFilter(status)}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Salon</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th className="text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <strong>{ord.id}</strong>
                        <div className="admin-subtext">{ord.date}</div>
                      </td>
                      <td>
                        <strong>{ord.customerName}</strong>
                        <div className="admin-subtext">{ord.customerPhone}</div>
                      </td>
                      <td>{ord.salonName}</td>
                      <td>
                        {ord.productName} ({ord.size})
                        {ord.returnReason && (
                          <div className="admin-return-note">
                            Note: {ord.returnReason}
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>Rs. {ord.amount}/-</strong>
                      </td>
                      <td>
                        <span
                          className={`dash-badge ${
                            ord.status === "Active"
                              ? "pending"
                              : ord.status === "Completed"
                                ? "confirmed"
                                : "cancelled"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="admin-row-actions">
                          {ord.status !== "Completed" && (
                            <button
                              type="button"
                              className="salon-view-pill-btn"
                              onClick={() => {
                                setOrders((prev) =>
                                  prev.map((x) =>
                                    x.id === ord.id
                                      ? { ...x, status: "Completed" }
                                      : x,
                                  ),
                                )
                                pushActivity(
                                  "orders",
                                  `Marked order ${ord.id} as Completed`,
                                )
                              }}
                            >
                              Complete
                            </button>
                          )}
                          {ord.status !== "Returned" && (
                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() => {
                                setOrders((prev) =>
                                  prev.map((x) =>
                                    x.id === ord.id
                                      ? {
                                          ...x,
                                          status: "Returned",
                                          returnReason:
                                            "Marked returned by administrator.",
                                        }
                                      : x,
                                  ),
                                )
                                pushActivity(
                                  "orders",
                                  `Marked order ${ord.id} as Returned`,
                                )
                              }}
                            >
                              Mark Returned
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REQUESTS (SENT BY SALON OWNERS TO ADMINS) */}
        {tab === "requests" && (
          <div className="dash-stack">
            <div className="admin-toolbar-card">
              <div>
                <h2 className="dash-h2">Salon Owner Requests</h2>
                <p className="admin-subtext">
                  Approve or decline requests sent by salon owners for package
                  upgrades, quota increases, and catalog changes.
                </p>
              </div>
            </div>

            {requests.map((req) => (
              <article className="dash-card" key={req.id}>
                <div className="dash-row">
                  <div>
                    <span className="products-eyebrow">
                      {req.category.toUpperCase()} · {req.id}
                    </span>
                    <h3>{req.subject}</h3>
                    <p className="admin-subtext">
                      From <strong>{req.ownerName}</strong> ({req.salonName} ·{" "}
                      {req.ownerEmail}) · {req.submittedAt}
                    </p>
                  </div>
                  <span
                    className={`dash-badge ${
                      req.status === "Approved"
                        ? "confirmed"
                        : req.status === "Pending"
                          ? "pending"
                          : "cancelled"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="dash-quote">{req.message}</p>
                {req.status === "Pending" && (
                  <div className="dash-actions">
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => {
                        setRequests((prev) =>
                          prev.map((x) =>
                            x.id === req.id ? { ...x, status: "Approved" } : x,
                          ),
                        )
                        pushActivity(
                          "requests",
                          `Approved request ${req.id} from ${req.salonName}`,
                        )
                      }}
                    >
                      Approve Request
                    </button>
                    <button
                      type="button"
                      className="dash-ghost"
                      onClick={() => {
                        setRequests((prev) =>
                          prev.map((x) =>
                            x.id === req.id ? { ...x, status: "Rejected" } : x,
                          ),
                        )
                        pushActivity(
                          "requests",
                          `Declined request ${req.id} from ${req.salonName}`,
                        )
                      }}
                    >
                      Decline
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* TAB 7: SETTINGS (CRITICAL SITE SETTINGS) */}
        {tab === "settings" && (
          <div className="dash-two">
            <form
              className="dash-card"
              onSubmit={(event: FormEvent) => {
                event.preventDefault()
                setSettingsSaved(true)
                pushActivity(
                  "settings",
                  "Updated critical platform & security configuration",
                )
                window.setTimeout(() => setSettingsSaved(false), 3000)
              }}
            >
              <h2>Critical Platform Settings</h2>
              <div className="dash-fields">
                <label>
                  Platform Name
                  <input
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                  />
                </label>
                <label>
                  Admin Contact Email
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, adminEmail: e.target.value })
                    }
                  />
                </label>
                <label>
                  Partner Support Hotline
                  <input
                    value={settings.hotline}
                    onChange={(e) =>
                      setSettings({ ...settings, hotline: e.target.value })
                    }
                  />
                </label>
                <label>
                  Automated Backup Schedule
                  <select
                    value={settings.backupSchedule}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        backupSchedule: e.target.value,
                      })
                    }
                  >
                    <option>Daily at 02:00 AM</option>
                    <option>Every 6 Hours</option>
                    <option>Weekly (Sunday 01:00 AM)</option>
                  </select>
                </label>
                <label>
                  CPU Alert Threshold (%)
                  <input
                    type="number"
                    min="50"
                    max="99"
                    value={settings.cpuAlertThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        cpuAlertThreshold: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  RAM Alert Threshold (%)
                  <input
                    type="number"
                    min="50"
                    max="99"
                    value={settings.ramAlertThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ramAlertThreshold: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="admin-toggles-list">
                <label className="admin-toggle-row">
                  <div>
                    <strong>Enforce &gt;8 Character Password Policy</strong>
                    <span>
                      Require customers and salon owners to use at least 9
                      characters on registration.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enforceStrongPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enforceStrongPassword: e.target.checked,
                      })
                    }
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <strong>Manual Admin Verification for New Salons</strong>
                    <span>
                      Require administrator approval before new salon accounts go
                      live in the directory.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.manualSalonVerification}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        manualSalonVerification: e.target.checked,
                      })
                    }
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <strong>Enable Online Card Payments (Pay Now)</strong>
                    <span>
                      Allow customers to pay online when ordering salon products.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlinePaymentsEnabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        onlinePaymentsEnabled: e.target.checked,
                      })
                    }
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <strong>Maintenance Mode</strong>
                    <span>
                      Temporarily pause public bookings and product orders during
                      system upgrades.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenanceMode: e.target.checked,
                      })
                    }
                  />
                </label>
              </div>

              <div className="dash-actions">
                <button type="submit" className="primary-button">
                  Save Critical Settings
                </button>
                {settingsSaved && (
                  <span role="status" className="dash-success">
                    <AdminIcon name="check" size={16} /> Settings saved
                  </span>
                )}
              </div>
            </form>

            <aside className="dash-side">
              <section className="dash-card">
                <h3>Administrator Security</h3>
                <dl className="dash-facts">
                  <div>
                    <dt>Signed in as</dt>
                    <dd>{user?.email ?? "admin@gmail.com"}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>Super Administrator</dd>
                  </div>
                  <div>
                    <dt>SSL / Encryption</dt>
                    <dd>TLS 1.3 Active</dd>
                  </div>
                  <div>
                    <dt>Database Region</dt>
                    <dd>Sri Lanka · Primary</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW SALON */}
      {addingSalonOpen && (
        <div
          className="product-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-salon-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddingSalonOpen(false)
          }}
        >
          <div className="product-window confirm-order-window">
            <button
              type="button"
              className="product-window-close"
              onClick={() => setAddingSalonOpen(false)}
              aria-label="Close add salon window"
            >
              ✕
            </button>
            <h2 id="add-salon-title" className="confirm-order-title">
              Add New Salon
            </h2>
            <p className="confirm-order-summary">
              Register a verified partner salon onto Ceylon Cutz
            </p>
            <form className="confirm-order-form" onSubmit={handleCreateSalon}>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Salon Name :</span>
                <input
                  required
                  value={newSalonForm.name}
                  onChange={(e) =>
                    setNewSalonForm({ ...newSalonForm, name: e.target.value })
                  }
                  placeholder="e.g. Negombo Luxe Salon"
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Owner Name :</span>
                <input
                  required
                  value={newSalonForm.ownerName}
                  onChange={(e) =>
                    setNewSalonForm({
                      ...newSalonForm,
                      ownerName: e.target.value,
                    })
                  }
                  placeholder="e.g. Shehan Fernando"
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Owner Email :</span>
                <input
                  type="email"
                  required
                  value={newSalonForm.ownerEmail}
                  onChange={(e) =>
                    setNewSalonForm({
                      ...newSalonForm,
                      ownerEmail: e.target.value,
                    })
                  }
                  placeholder="owner@salon.lk"
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Contact No :</span>
                <input
                  type="tel"
                  required
                  value={newSalonForm.phone}
                  onChange={(e) =>
                    setNewSalonForm({ ...newSalonForm, phone: e.target.value })
                  }
                  placeholder="077 123 4567"
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Location :</span>
                <select
                  value={newSalonForm.location}
                  onChange={(e) =>
                    setNewSalonForm({
                      ...newSalonForm,
                      location: e.target.value,
                    })
                  }
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                </select>
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Gender Served :</span>
                <select
                  value={newSalonForm.gender}
                  onChange={(e) =>
                    setNewSalonForm({
                      ...newSalonForm,
                      gender: e.target.value as "Unisex" | "Men" | "Women",
                    })
                  }
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                </select>
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Package Tier :</span>
                <select
                  value={newSalonForm.packageName}
                  onChange={(e) =>
                    setNewSalonForm({
                      ...newSalonForm,
                      packageName: e.target.value,
                    })
                  }
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="confirm-order-buttons">
                <button type="submit" className="confirm-btn primary">
                  Add Salon
                </button>
                <button
                  type="button"
                  className="confirm-btn back"
                  onClick={() => setAddingSalonOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SALON */}
      {editingSalon && (
        <div
          className="product-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-salon-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingSalon(null)
          }}
        >
          <div className="product-window confirm-order-window">
            <button
              type="button"
              className="product-window-close"
              onClick={() => setEditingSalon(null)}
              aria-label="Close edit salon window"
            >
              ✕
            </button>
            <h2 id="edit-salon-title" className="confirm-order-title">
              Edit Salon
            </h2>
            <p className="confirm-order-summary">{editingSalon.name}</p>
            <form className="confirm-order-form" onSubmit={handleSaveSalonEdit}>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Salon Name :</span>
                <input
                  required
                  value={editingSalon.name}
                  onChange={(e) =>
                    setEditingSalon({ ...editingSalon, name: e.target.value })
                  }
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Owner Name :</span>
                <input
                  required
                  value={editingSalon.ownerName}
                  onChange={(e) =>
                    setEditingSalon({
                      ...editingSalon,
                      ownerName: e.target.value,
                    })
                  }
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Contact No :</span>
                <input
                  required
                  value={editingSalon.phone}
                  onChange={(e) =>
                    setEditingSalon({ ...editingSalon, phone: e.target.value })
                  }
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Location :</span>
                <select
                  value={editingSalon.location}
                  onChange={(e) =>
                    setEditingSalon({
                      ...editingSalon,
                      location: e.target.value,
                    })
                  }
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                </select>
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Package :</span>
                <select
                  value={editingSalon.packageName}
                  onChange={(e) =>
                    setEditingSalon({
                      ...editingSalon,
                      packageName: e.target.value,
                    })
                  }
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Status :</span>
                <select
                  value={editingSalon.status}
                  onChange={(e) =>
                    setEditingSalon({
                      ...editingSalon,
                      status: e.target.value as "Active" | "Suspended",
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
              <div className="confirm-order-buttons">
                <button type="submit" className="confirm-btn primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="confirm-btn back"
                  onClick={() => setEditingSalon(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PACKAGE */}
      {editingPackage && (
        <div
          className="product-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-pkg-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingPackage(null)
          }}
        >
          <div className="product-window confirm-order-window">
            <button
              type="button"
              className="product-window-close"
              onClick={() => setEditingPackage(null)}
              aria-label="Close edit package window"
            >
              ✕
            </button>
            <h2 id="edit-pkg-title" className="confirm-order-title">
              Edit Package
            </h2>
            <p className="confirm-order-summary">{editingPackage.name}</p>
            <form
              className="confirm-order-form"
              onSubmit={(e: FormEvent) => {
                e.preventDefault()
                setPackages((prev) =>
                  prev.map((p) =>
                    p.id === editingPackage.id ? editingPackage : p,
                  ),
                )
                pushActivity(
                  "packagers",
                  `Updated package "${editingPackage.name}" (Rs. ${editingPackage.monthlyPrice}/mo)`,
                )
                setEditingPackage(null)
              }}
            >
              <label className="confirm-field-row">
                <span className="confirm-field-label">Package Name :</span>
                <input
                  required
                  value={editingPackage.name}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      name: e.target.value,
                    })
                  }
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Monthly Price (Rs) :</span>
                <input
                  type="number"
                  required
                  value={editingPackage.monthlyPrice}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      monthlyPrice: Number(e.target.value) || 0,
                    })
                  }
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Storage Limit (GB) :</span>
                <input
                  type="number"
                  required
                  value={editingPackage.storageLimitGb}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      storageLimitGb: Number(e.target.value) || 1,
                    })
                  }
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">RAM Quota (MB) :</span>
                <input
                  type="number"
                  required
                  value={editingPackage.ramAllocationMb}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      ramAllocationMb: Number(e.target.value) || 512,
                    })
                  }
                />
              </label>
              <label className="confirm-field-row">
                <span className="confirm-field-label">Max Products :</span>
                <input
                  type="number"
                  required
                  value={editingPackage.maxProducts}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      maxProducts: Number(e.target.value) || 10,
                    })
                  }
                />
              </label>
              <div className="confirm-order-buttons">
                <button type="submit" className="confirm-btn primary">
                  Save Package
                </button>
                <button
                  type="button"
                  className="confirm-btn back"
                  onClick={() => setEditingPackage(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
