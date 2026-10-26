import { useCallback, useEffect, useRef, useState } from "react"
import { salons } from "./SalonsPage"

type Detector = {
  detect: (video: HTMLVideoElement) => Promise<{ rawValue: string }[]>
}
type DetectorConstructor = new (options: { formats: string[] }) => Detector

function salonIdFromCode(value: string) {
  const code = value.trim()
  if (salons.some((salon) => salon.id === code)) return code
  try {
    const url = new URL(code, window.location.href)
    if (
      url.origin !== window.location.origin ||
      !url.hash.startsWith("#salons/")
    )
      return null
    const id = url.hash.slice(8)
    return salons.some((salon) => salon.id === id) ? id : null
  } catch {
    return null
  }
}

export default function ScanPage() {
  const video = useRef<HTMLVideoElement>(null)
  const stream = useRef<MediaStream | null>(null)
  const session = useRef(0)
  const [active, setActive] = useState(false)
  const [starting, setStarting] = useState(false)
  const [message, setMessage] = useState("")
  const stop = useCallback(() => {
    session.current += 1
    stream.current?.getTracks().forEach((track) => track.stop())
    stream.current = null
    if (video.current) video.current.srcObject = null
    setActive(false)
    setStarting(false)
  }, [])
  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) stop()
    }
    document.addEventListener("visibilitychange", onHidden)
    return () => {
      stop()
      document.removeEventListener("visibilitychange", onHidden)
    }
  }, [stop])
  const openSalon = (value: string) => {
    const id = salonIdFromCode(value)
    if (!id) return false
    stop()
    window.location.hash = `salons/${id}`
    return true
  }
  const start = async () => {
    const Constructor = (window as Window & {
      BarcodeDetector?: DetectorConstructor
    }).BarcodeDetector
    if (!Constructor || !navigator.mediaDevices?.getUserMedia) {
      setMessage(
        "Camera QR scanning is not supported in this browser. Please use a browser that supports camera QR scanning.",
      )
      return
    }
    stop()
    const token = session.current
    setStarting(true)
    setMessage("")
    try {
      const detector = new Constructor({ formats: ["qr_code"] })
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      })
      if (token !== session.current) {
        media.getTracks().forEach((track) => track.stop())
        return
      }
      stream.current = media
      if (!video.current) {
        stop()
        return
      }
      video.current.srcObject = media
      await video.current.play()
      if (token !== session.current) return
      setActive(true)
      setStarting(false)
      const scan = async () => {
        if (token !== session.current || !video.current) return
        try {
          const codes = await detector.detect(video.current)
          if (token !== session.current) return
          if (codes.length && openSalon(codes[0].rawValue)) return
          if (codes.length)
            setMessage(
              "This QR code does not match an available Ceylon Cutz salon. No external link was opened.",
            )
          if (token === session.current) window.setTimeout(scan, 350)
        } catch {
          if (token === session.current) {
            stop()
            setMessage(
              "Unable to read QR codes from this camera. Please try starting the camera again.",
            )
          }
        }
      }
      void scan()
    } catch (error) {
      if (token !== session.current) return
      stop()
      setMessage(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Camera permission was not granted. Allow camera access in your browser settings and try again."
          : "The camera could not be started. Check camera access and try again.",
      )
    }
  }
  return (
    <main className="products-main" id="scan-content" tabIndex={-1}>
      <nav className="products-breadcrumb" aria-label="Breadcrumb">
        <a href="#home">Home</a>
        <span>/</span>
        <span aria-current="page">Scan QR</span>
      </nav>
      <div className="products-heading">
        <div>
          <span className="products-eyebrow">A QUICK CONNECTION</span>
          <h1>
            Scan. Connect. <span>Your salon.</span>
          </h1>
          <p>Scan a Ceylon Cutz salon QR code to open its profile.</p>
        </div>
      </div>
      <div className="scan-layout">
        <section className="scan-camera-panel" aria-label="QR camera scanner">
          <div className={`scan-viewport ${active ? "is-active" : ""}`}>
            <video
              ref={video}
              muted
              playsInline
              aria-label="Live camera preview"
            />
            <div className="scan-reticle" aria-hidden="true" />
            {!active && (
              <div className="scan-placeholder">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="16" height="16" rx="2" />
                  <rect x="39" y="9" width="16" height="16" rx="2" />
                  <rect x="9" y="39" width="16" height="16" rx="2" />
                  <path d="M39 39h8v8h8v8H39V39Z" />
                </svg>
                <span>
                  {starting ? "Starting camera…" : "Ready when you are"}
                </span>
              </div>
            )}
          </div>
          <div className="scan-panel-bottom">
            <p>
              {active
                ? "Keep the QR code inside the frame."
                : "Your camera starts only when you choose to scan."}
            </p>
            {active || starting ? (
              <button className="save-salon-button" onClick={stop}>
                Stop camera
              </button>
            ) : (
              <button
                className="save-salon-button"
                onClick={() => void start()}
              >
                Start camera
              </button>
            )}
          </div>
        </section>
      </div>
      <p className="scan-status" role="status" aria-live="polite">
        {message}
      </p>
    </main>
  )
}
