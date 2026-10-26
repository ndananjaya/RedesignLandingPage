# Ceylon Cutz landing-page redesign

## Goal and confirmed decisions
Redesign the supplied landing-page sketch as a polished, dark action dashboard for **Ceylon Cutz**. Use blue, purple, white, and black, with dark surfaces wherever practical. Preserve the information architecture rather than replacing it with a marketing landing page.

Confirmed scope: landing page only, with honest preview interactions. Additional pages will be specified later. Do not implement authentication, camera access, QR decoding, salon search services, commerce, or a backend.

## Repository grounding
- The repository is an empty React 19 + Vite + Tailwind CSS v4 scaffold; `src/App.tsx` currently renders an empty container.
- `src/index.css` imports Tailwind; global styling and font wiring belong here.
- Follow `AGENTS.md`. The development server is already supervised; never launch another server.
- Existing scripts are `build` (vite build), `format` (oxfmt), `dev`, and `preview`. No test script or testing framework is configured.
- No existing components, design-system dependency, or icon package is present.
- No repository files have been changed during planning.

## Source assets
- Layout sketch: attachment `a9666e95-55a8-4276-ab5d-4e84a11c76bf` (`Landing page.png`).
- Brand logo: attachment `1b396898-d44d-4968-beeb-3fe741e28266` (`image.png`).
- Resolve attachments with `figma attachments get <id>` and use the returned paths; copy the logo into a persistent local asset location during implementation.
- Reuse the logo without redrawing or distorting it. Its dark lettering needs a light backing on the dark page: use a compact white or near-white logo plate. Pair it with readable Ceylon Cutz brand text where the compact image alone would be illegible.

## Page structure and visual direction
Keep the sketch's section order and navigation intent:
1. Header: brand at left; **Log in** and **Register** at right. Register is the stronger purple/blue call to action; Log in is quieter.
2. Main: the four original actions, in original reading order: **Scan QR**, **Search Salons**, **Salon Products**, **My Favorite**.
3. Footer: brand, About Us/Contact Us, Quick Links, and Useful Links.

Use a near-black page background, slightly lighter charcoal/indigo cards, thin cool-toned borders, white primary text, and muted but legible secondary text. Blue and purple provide restrained gradients and highlights, not full-page bright fills. Use a clean sans-serif system font stack, strong heading hierarchy, generous spacing, rounded cards, and subtle hover elevation. No photography, extra promotional sections, invented testimonials, statistics, or salon listings.

Main content may begin with a compact heading such as “Your next great cut starts here” and a short instruction to choose an action, within the existing main section. The four cards remain the dominant content. Each has an original simple inline SVG line icon, action title, one short explanatory sentence, and a directional affordance. Do not add a package solely for icons.

Footer content:
- About: “Discover salons, explore salon products, and keep your favorites in one place.”
- Contact: indicate “Contact details coming soon”; do not turn the sketch's placeholder phone digits into a real phone link.
- Quick Links: Home, Search Salons, Products, Favorite.
- Useful Links: Privacy Notice, Privacy, FAQ, Terms & Conditions; preserve the sketch's labels, including both privacy entries.
- A subtle copyright line for Ceylon Cutz may close the footer.

## Responsive behavior
- Desktop: centered content with approximately 1120px maximum width; two-column, two-row action grid; horizontal header; multi-column footer.
- Tablet: retain two card columns when space permits; allow footer columns to wrap.
- Mobile: one card column, compact brand/header controls, stacked footer sections. Avoid horizontal scrolling at 320px. Do not introduce a hamburger menu for only two header actions.
- Maintain comfortable tap targets, readable text, and consistent spacing at all sizes.

## Preview interaction contract
Use one reusable accessible preview dialog, driven by React state. All controls respond without implying completed functionality.
- Scan QR: explain that scanning will allow access to a salon through its QR code and that the scanner is not available in this preview. Never request camera permissions.
- Search Salons: show a clearly labeled upcoming salon-discovery preview; do not render fake search results or a nonworking input.
- Salon Products: explain that product browsing will be provided on a future page; no catalog or checkout.
- My Favorite: explain that saved salons will appear here once favorites are implemented; no simulated saved state.
- Log in/Register: show action-specific previews saying account access is not connected; do not collect credentials.
- Footer feature links open the same corresponding previews. Home returns to the top of the page. Legal and FAQ links open labeled informational placeholders, explicitly stating that their content is not yet available; do not fabricate policy text.
- Dialogs have a visible Close button, focus management, Escape dismissal, focus restoration to the trigger, accessible title/description, and no background interaction while open. Prefer the native HTML `dialog` API with a React ref, `showModal()`, and a consistent state lifecycle.
- Hover, focus-visible, and pressed states must be clear. Respect reduced-motion preferences; transitions should be brief and unobtrusive.

## Implementation approach
- Implement page composition and a small number of local reusable components in `src/App.tsx`: Header, ActionCard, Footer, and PreviewDialog. Keep the page's default export.
- Define typed action/preview metadata once and use it for cards and corresponding footer links, preventing copy and behavior drift.
- Use local React state for the active preview only. No routing, network requests, persistence, authentication SDK, or backend dependencies.
- Put global theme variables, font defaults, and any small reusable visual rules in `src/index.css`; use Tailwind v4 utility classes for layout and component styling. Keep CSS imports first.
- Store the supplied logo as a local asset and provide meaningful alt text. Decorative SVG icons are hidden from assistive technology.
- Inspect `index.html` before adjusting the document title to Ceylon Cutz; preserve existing shell wiring.
- Keep modifications limited to the page, styles, logo asset, and document title. Do not create additional pages or documentation during implementation.

## Accessibility and edge cases
- Semantic header/main/footer regions, one page-level heading, logical heading order, and real buttons for dialog triggers.
- Sufficient text and focus contrast on dark surfaces. No color-only communication.
- Dialog content must remain readable and scrollable on short mobile screens.
- Opening different triggers always selects the correct title and description; closing and reopening does not retain stale content or leave focus trapped.
- Long footer labels wrap without overflow. Logo scales proportionally and remains legible against its light plate.

## Verification and acceptance
Because implementation creates the entire page rather than a localized change, run the repository's build script (`pnpm build`) and format the changed source using the existing `format` script with targeted file arguments. Do not invent a test suite or start another development server.

Use the existing preview for visual/interaction inspection where a supported inspection capability is available:
- Desktop and mobile layouts preserve the header → four actions → footer architecture.
- All four actions, both account buttons, and footer links respond according to the preview contract.
- Keyboard navigation, dialog focus, Escape, close controls, and focus restoration work.
- No camera request, credentials collection, external services, fake data, broken navigation, horizontal overflow, or browser errors.
- Branding consistently says Ceylon Cutz and the supplied logo is present.
- Dark palette uses blue/purple accents and readable white text.

If runtime inspection is unavailable, report that limitation rather than claiming it was performed. Use logs only to diagnose an observed failure. Report implementation changes and the actual verification outcomes; do not commit or deploy unless asked.

## Explicitly deferred
Additional site pages, functional QR scanning, real salon search, product catalogs/purchases, favorites persistence, account flows, real contact information, and approved legal content await future requirements.
