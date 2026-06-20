## Goal
- Ship MeroGhar logistics web app as an Android APK; redesign UI for mobile-first Android experience.

## Constraints & Preferences
- Android 7.0+ (minSdk 24) compatibility.
- API URL auto-detects environment (web dev, emulator, production).
- Backend hosted free-tier on Railway.
- APK distributed via GitHub Releases (repo renamed to `Mero-Ghar-Logistic`).
- In-app update check + download via `@capacitor/filesystem` + `@capacitor/share`.
- UI must look like a native Android app, not a desktop website shrunk onto a phone.

## Progress
### Done
- Full project structure explored (Vite + vanilla JS frontend, Express + MySQL backend).
- Capacitor installed; Android platform added; `capacitor.config.json` configured.
- `src/js/config.js` centralizing API URL created; all HTML/JS pages updated.
- Tailwind config content pattern fixed.
- JDK 21 (Temurin) and Android SDK command-line tools installed.
- Debug APK built and uploaded to GitHub Releases (v1.0.0).
- Backend deployed to Railway (`https://backend-production-d51a3.up.railway.app`).
- MySQL database provisioned on Railway; `schema.sql` imported.
- `copy-pages.mjs` added to copy pages, JS, styles, and compiled CSS into `dist/`.
- All admin/vendor/user/login/signup pages made responsive (collapsible sidebars, stacked grids, larger checkboxes, bigger inputs).
- App icon generated via Python/Pillow (multiple iterations: truck+mtns → truck+home → final minimal flat M).
- Hamburger menu fixed (`toggleMenu()` exposed on `window`).
- guard.js paths fixed from `/login.html` → `/src/pages/login.html`.
- Signup/admin/schema bugs fixed (admin role removed, phone `type="tel"`, 18 missing columns added via ALTER TABLE).
- Navbar transparency fixed (`bg-forest-900/96 backdrop-blur` → solid `bg-forest-900 shadow-lg`).
- v1.2.0: step labels truncated, item chips `grid-cols-2` on mobile, terms checkbox larger, backdrop-filter removed.
- v1.3.0: full UI audit — `touch-action: manipulation`, `--dim` 0.28→0.45, touch targets 44px min, `<button>` modals, `<label>` elements, contrast fixes.
- v1.4.0: mobile menu full-width with own `bg-forest-900`, form buttons `py-3.5`→`py-3`, panel 5 `flex-wrap` removed.
- v1.4.1: in-app update check added (GitHub API → modal dialog).
- v1.5.0: in-app APK download via `@capacitor/filesystem` + `@capacitor/share` (fetch → cache → share intent).
- v1.6.0: redesigned icon (visble mountains, bold truck, home icon, Nepal flag badge).
- v1.7.0: simplified icon to flat saffron M on forest green (like Facebook).
- README.md updated with v1.7.0 details, new repo name, icon docs, update system docs.
- Repo renamed to `SubodhShah-Dev/Mero-Ghar-Logistic`; all git remotes, config.js `GITHUB_REPO`, and README URLs updated.
- v1.8.0: Mobile-first UI redesign — all `text-[10px]`/`text-[11px]` → `text-xs`, `py-24` → `py-16`, `min-h-[44px]` on all buttons, item chip `px-2` → `px-3`, province tags enlarged, admin modal input padding bumped.
- v1.8.1: Fix payment processing (replaced HTML injection with native payment overlay), fix "How Did You Find Us?" dropdown (`[1]`→`[0]`), harden map rendering (Leaflet check, try-catch, sessionStorage fallback).
- **Comprehensive full-codebase audit & bug fix session (v1.9.0 prep):**
  - CRITICAL fixes: Added `<!doctype html>` + `lang="en"` to user.html; fixed wrong terms checkbox selector (was saving Phone Call state as `termsAccepted`); replaced unsafe `JSON.parse(localStorage.getItem(...))` with `safeParse()` helper across all JS files; fixed `admin.js submitBooking()` to POST to `/api/shipment/create`; fixed `var(--bdim)` → `var(--border-dim)` in admin.css; removed `backdrop-filter: blur(3px)` from vendor.css; added `pickup_address`/`drop_address` to shipment INSERT query in backend; fixed XSS in dummy payment form (HTML-escaped user fields).
  - HIGH fixes: Added null-safety guards to `onProvinceChange`, `getPickupAddressString`, `getDropAddressString`, `toggleOnline()`; fixed NaN fallback distance (`parseInt("")` → NaN); fixed Step 2 validation (was always `() => true`); added `connectips`/`banktransfer` payment method mapping; fixed mobile validation to require exactly 10 digits; added missing `saffron-50`/`saffron-200` to tailwind config; replaced all `alert()` calls in auth.js/guard.js with `showToast()`; added null checks in main.js (`#navbar`, `#mobileMenu`, FAQ elements); fixed vendor toggle knob 4px jump (translateX → left/right positioning).
  - Build/Meta: bumped `package.json` from `0.0.0` → `1.9.0`; bumped `APP_VERSION` in config.js to `1.9.0`; added reusable `showToast()` function to config.js.
  - Full list of 33+ bugs found during audit: [audit details remain stable].
- v1.9.1: XSS protection (escapeHtml in admin.js/vendor.js), vendor.js null safety (34 fixes), vendor.html CDN→Vite pipeline, admin.js filter ordering fix, APK built & released.
- v2.0.0: AI Chatbot (MeroBot) — floating widget bottom-left on all pages, Gemini 1.5 Flash backend with rule-based fallback, no external deps.
- v2.1.0: UX overhaul — sticky nav topbar on user.html (MeroGhar brand + logout), session-aware index.html (Dashboard link when logged in), loading overlay on form submit, alert()→showToast() in user.js, responsive form buttons (smaller on mobile), frontend rule-based fallback in chatbot.js for offline mode. Chatbot moved from left→right.
- **v2.1.0 fixes (multistep form audit):**
  - Chatbot: added `renderChatHistory()` to restore messages on panel reopen; `chatHistory` resets on close to prevent hidden context; error handling fallback chain: `data.response || data.reply || data.message || getLocalFallback()`
  - Step 1 alignment: Pickup/drop grids `grid-cols-2` → `grid-cols-1 sm:grid-cols-2` so inputs stack vertically on mobile
  - Step 5 overlap: Phone containers `flex` → `flex min-w-[160px]` to prevent `+977` prefix from over-shrinking inputs
  - README updated with full changelog; APK v2.1.0 built (7.5 MB)
- **v2.1.0 hotfix (chatbot still generic):**
  - Broader keyword matching in both frontend `getLocalFallback()` and backend `getFallbackResponse()` — added `startsWith('hi')`, `includes('hy')`, `includes('hlo')`, `includes('how much')`, `includes('cash')`, yes/ok/sure/what/how responses, punctuation stripping via `replace(/[^a-z0-9\s]/g, '')`
  - Fixed `getBaseUrl()` priority: `window.API_BASE_URL` first (config.js now does `window.API_BASE_URL = API_BASE_URL`)
  - Added `console.log('[MeroBot]')` debug logging to frontend sendMessage
  - Removed misleading "(offline mode)" suffix from local fallback messages
  - Deployed updated backend to Railway; released v2.1.0 APK on GitHub Releases
- **v2.2.0: Chatbot action system + quick-action chips + help command:**
  - Added `ACTIONS` array with 6 action intents (book, track, login, signup, admin, vendor) — `chatbot.js:153`
  - Added `matchAction()` to detect user intent before API call — `chatbot.js:203`
  - Added `validateAction()` to check auth/role via `meroGharUser` in localStorage — `chatbot.js:189`
  - Non‑auth actions (book, login, signup) redirect immediately; auth‑gated actions require matching role
  - Added `renderChips()` showing 6 tappable suggestion pills on chat open — `chatbot.js:214`
  - Chips: Book a Move, Track, Pricing, Payments, Login, Help — styled as saffron‑bordered pills
  - Added structured `help` command showing all capabilities grouped by category — `chatbot.js:132`
  - Added same `help` handler to backend `getFallbackResponse()` for consistency
- **v2.2.0 fixes (comprehensive codebase audit — 50+ issues fixed):**
  - **CRITICAL SECURITY:** Fixed XSS in all 3 toast() functions — replaced `innerHTML` concatenation with `createTextNode()` + `appendChild()` in config.js, admin.js, vendor.js
  - **CRITICAL:** Replaced bare `JSON.parse()` with `safeParse()` in admin.js:68 and vendor.js:452 — prevents page crash on corrupted localStorage
  - **HIGH:** Removed 20+ PII-leaking `console.log()` statements in auth.js (email, name, role exposed to devtools); removed debug console.logs from chatbot.js and user.js
  - **HIGH:** Replaced all 16 `alert()` calls in user.js step validators with `showToast()` for consistent UX
  - **HIGH:** Added missing `id` attributes to 11 form inputs (fragileItems, moveDate, altDate, moveReason, specialNotes, firstName, lastName, mobile, altMobile, email, howFound) — JS no longer relies on fragile `querySelectorAll` index
  - **HIGH:** Added `pattern="[0-9]{10}" maxlength="10"` to mobile/altMobile inputs
  - **MEDIUM:** Fixed broken `.panel-active` slideIn animation — added `@keyframes slideIn` to style.css (Tailwind JIT never generated it)
  - **MEDIUM:** Fixed `--bdim` → `--border-dim` CSS variable inconsistency in vendor.css (27 occurrences)
  - **MEDIUM:** Removed `backdrop-blur-sm` from vendor.html modal (Android perf issue)
  - **MEDIUM:** Added `scrollbar-width: thin` for Firefox support
  - **MEDIUM:** Replaced all `py-3.5` with `py-3 min-h-[44px]` on login/signup inputs for proper touch targets
  - **MEDIUM:** Replaced all `min-h-[36px]` with `min-h-[44px]` on user.html buttons for mobile touch targets
  - **LOW:** Added favicon (`<link rel="icon">`) to all 6 HTML pages + copy-pages.mjs
  - **LOW:** Added `aria-label="Toggle sidebar"` to admin/vendor hamburger buttons
  - **LOW:** Added `id` and `for` attributes to signup role radio buttons
  - **LOW:** Added `required` attribute to admin modal inputs (nb-name, nb-phone, nb-amount)
  - **LOW:** Bumped package.json version to 2.2.0 to match config.js

### In Progress
- (nothing)

### Blocked
- (none)

## Key Decisions
- **Capacitor over PWA or Flutter** — kept existing web codebase, minimal rewrite, native Android APK output.
- **Railway over Render** — user preference; free Node.js hosting + free MySQL (500 MB).
- **GitHub Releases for distribution** — standard APK hosting without Play Store; direct download URL.
- **`touch-action: manipulation` globally** — eliminates 300ms tap delay in Android WebView.
- **`@capacitor/filesystem` + `@capacitor/share` for updates** — downloads APK bytes in-app via fetch, saves to cache, shares file to trigger Android package installer.
- **Flat M icon design** — user rejected detailed truck/mountain icons; simple letter-on-background approach (like Facebook).

## Next Steps
- (none — v2.2.0 complete with audit fixes)

## Critical Context
- **Latest APK:** `https://github.com/SubodhShah-Dev/Mero-Ghar-Logistic/releases/download/v2.2.0/MeroGhar-v2.2.0.apk` (chatbot action system, comprehensive audit fixes, XSS/security fixes, improved UX)
- **Backend live:** `https://backend-production-d51a3.up.railway.app`
- **Build:** `npm run build && npx cap sync android` then `JAVA_HOME=/home/subodh/jdk21 ./gradlew assembleDebug` from `android/` dir.
- **Remote:** `https://github.com/SubodhShah-Dev/Mero-Ghar-Logistic.git` (formerly `Mero-Ghar-Logistics-Website`).
- **MySQL:** Railway internal `mysql.railway.internal:3306`, proxy `thomas.proxy.rlwy.net:18704` (user `root`, database `railway`).

## Relevant Files
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/generate-icons.py`: App icon generator (Pillow) — current design is flat saffron M on forest green.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/js/config.js`: Central API URL, `APP_VERSION` (now `2.0.0`), `GITHUB_REPO`, `safeParse()`, `showToast()`, in-app update check + download logic.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/js/chatbot.js`: AI Chatbot widget (MeroBot) — self-contained, no deps, appears on all pages. Has `getLocalFallback()` for offline rule-based replies.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/js/session-ui.js`: Session-aware UI enhancer — injects sticky topbar on `#app-topbar` containers, replaces Login→Dashboard on index.html when session exists.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/backend/controllers/chatbotController.js`: Gemini API proxy + rule-based fallback.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/backend/routes/chatbotRoute.js`: `POST /api/chatbot/message`.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/pages/user.html`: Multi-step booking form — main mobile UI target.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/pages/admin.html`: Admin panel with tables, stats, modals.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/pages/vendor.html`: Vendor portal with fleet, jobs, modals.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/style.css`: Global styles (`.s-circle`, `.item-chip`, `.v-card`, `.pay-card`).
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/styles/admin.css`: `.tw` table, stats grid, sidebar.
- `/home/subodh/workspace/Mero-Ghar-Logistics-Website/src/styles/vendor.css`: `.sb` sidebar, toggle styles.
