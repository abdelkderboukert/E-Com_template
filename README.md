# Aurum — Luxury Fashion E-Commerce Platform

> A full-stack, production-ready e-commerce web application for a luxury Algerian fashion brand, built with **Next.js 14**, **TypeScript**, and integrated with the **Chargily Pay V2** banking gateway.

---

## 🌟 Overview

**Aurum** is a premium fashion e-commerce platform designed and developed end-to-end — from UI/UX to payment infrastructure. The project showcases real-world full-stack skills including server-side API design, secure payment gateway integration, role-based admin management, and a polished, mobile-first customer experience.

---

## 🚀 Live Features

### 🛍️ Customer-Facing Storefront
- **Home page** with animated hero, scrolling marquee, featured products grid, and brand story editorial
- **All Products page** (`/products`) with real-time filtering by category, price range, and tag — plus sort by price, rating, and name
- **Product cards** with color swatches, star ratings, discount badges, and adaptive behavior (hover overlay on desktop, always-visible actions on mobile)
- **Product Detail Modal** with multi-image gallery, prev/next navigation, size & color selection, quantity picker, and trust badges
- **Responsive design** — fully functional on all screen sizes
- **Floating contact button** with animated WhatsApp and Instagram quick-links

### 🧺 Cart & Checkout
- **Slide-in Cart Drawer** — live item count, quantity controls, remove per item, clear cart with confirmation
- Free shipping threshold indicator
- **Multi-step Checkout Modal** (4 steps):
  1. Order recap
  2. Delivery info with Algerian phone number validation and full 58-wilaya dropdown
  3. Payment method selection
  4. Order confirmation screen

### 💳 Dual Payment System
| Method | Implementation |
|---|---|
| **WhatsApp Orders** | Automatically builds a formatted order message and opens WhatsApp with one click |
| **Dahabia / CIB** | Redirects to the official **Chargily Pay V2** secure banking gateway — no card data ever touches the app |

### 🔐 Admin Dashboard (`/admin-secret-2026`)
- Password-protected login page
- Full **CRUD** for product catalog: add, edit, delete products
- Manage images, colors (with hex), sizes, tags, prices, descriptions
- **Toggle payment methods** on/off in real time (reflected immediately in checkout)
- Order management panel

---

## 🏗️ Technical Architecture

```
aurum/
├── app/
│   ├── page.tsx                  # Home page
│   ├── products/page.tsx         # All products with filters & sort
│   ├── admin-secret-2026/        # Admin dashboard + login
│   ├── success/                  # Post-payment success page
│   └── api/
│       ├── orders/route.ts       # Orders API (GET / POST)
│       ├── chargily/checkout/    # Chargily Pay V2 server-side checkout
│       └── settings/             # Admin settings API (payment toggles)
├── components/
│   ├── Navbar.tsx                # Responsive nav with mobile overlay
│   ├── ProductCard.tsx           # Adaptive card (hover/touch)
│   ├── ProductDetailModal.tsx    # Full-screen product detail
│   ├── CartDrawer.tsx            # Slide-in cart with clear confirmation
│   ├── CheckoutModal.tsx         # 4-step checkout flow
│   ├── AdminProductModal.tsx     # Admin CRUD modal
│   ├── FloatingContact.tsx       # WhatsApp + Instagram button
│   └── ...
└── lib/
    ├── data.ts                   # Types, product data, formatting utils
    └── ProductsContext.tsx       # Global products context (React Context API)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Vanilla CSS custom properties |
| **State Management** | React Context API + `useState` / `useCallback` |
| **Payment Gateway** | Chargily Pay V2 (official Algerian banking API) |
| **Fonts** | Playfair Display (display) · DM Sans (body) |
| **Icons** | Inline SVG (zero external dependency) |
| **Deployment-ready** | Vercel / any Node.js host |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/aurum.git
cd aurum

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Chargily Pay V2 credentials (from your Chargily dashboard)
CHARGILY_API_KEY=your_api_key_here
CHARGILY_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin authentication
ADMIN_PASSWORD=your_secure_password_here
```

### Run Locally

```bash
npm run dev
# → http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🔒 Security Highlights

- **No card data on the server** — all card handling is done exclusively by Chargily's official banking interface
- Admin dashboard protected behind a secret route + password authentication
- Algerian phone number regex validation on the checkout form
- API routes validate input before processing orders
- Webhook signature verification for Chargily payment confirmations

---

## 📱 Mobile UX Decisions

- Cart drawer is full-width on mobile with large touch targets
- Product size & color selectors are always visible on mobile (not hidden behind hover)
- Mobile navigation is a full-screen overlay with staggered animations
- Filter sidebar slides in as a drawer on mobile
- All modals adapt to `92dvh` max-height with internal scrolling

---

## 📸 Key Pages at a Glance

| Page | Description |
|---|---|
| `/` | Home — hero, marquee, featured products, brand story |
| `/products` | Full catalog with sidebar filters and sort controls |
| Cart Drawer | Accessible from any page via navbar |
| Checkout | 4-step modal: recap → delivery → payment → confirmation |
| `/admin-secret-2026` | Protected product & order management dashboard |
| `/success` | Post-Chargily-payment confirmation landing page |

---

## 🔄 CI/CD & DevOps

Aurum uses a fully automated GitHub Actions pipeline covering continuous integration, security scanning, and continuous deployment via ArgoCD.

### Workflow Overview

| Workflow | File | Trigger |
|---|---|---|
| **CI Pipeline** | `CI.yml` | Push to `main` |
| **Security Scan & Build** | `Security.yml` | Push / PR to `main`, `development`, `dev-*` · Weekly schedule |
| **CD — ArgoCD Sync** | `argocd-sync.yml` | After CI pipeline succeeds on `main` or `development` |
| **Dependabot** | `dependabot.yml` | Every Monday |

---

### CI Pipeline (`CI.yml`)

Runs on every push to `main` and on manual dispatch. Ensures the codebase lints and builds cleanly before anything else runs.

```
Push to main
    │
    ▼
Frontend Lint (ESLint)
    │
    ▼
Frontend Build (npm run build)
```

**Jobs:**
- **`lint-frontend`** — installs dependencies and runs `npm run lint`
- **`build-frontend`** — depends on lint passing, then runs `npm run build` from the root

---

### Security Scan & Build (`Security.yml`)

Runs on every push and pull request to `main`, `development`, or any `dev-*` branch, plus a weekly scheduled scan every Sunday at 02:00 UTC. All jobs run in parallel except `build-and-scan`, which waits on `secrets-scan` and `code-quality`.

**Jobs:**

| Job | Tools | What it does |
|---|---|---|
| `secrets-scan` | TruffleHog · GitLeaks | Scans the full git history for leaked credentials and secrets |
| `codeql-analysis` | GitHub CodeQL | Static analysis for JS/TS security and quality issues |
| `dependency-check` | npm audit | Audits all Node.js dependencies for known CVEs |
| `code-quality` | ESLint · Prettier | Lints source code and checks formatting |
| `semgrep-analysis` | Semgrep (`p/javascript`, `p/nextjs`) | SAST pattern scanning for common JS/Next.js vulnerabilities |
| `build-and-scan` | Docker · Trivy · Grype | Builds the Docker image, scans it for OS and package CVEs, then pushes to GHCR on non-PR runs |
| `security-summary` | — | Aggregates all scan results and prints a final report |

Results from Trivy and Grype are uploaded to the **GitHub Security tab** as SARIF reports. Artifact reports (GitLeaks, npm audit, ESLint, Semgrep) are stored as workflow artifacts for each run.

---

### CD — ArgoCD Sync (`argocd-sync.yml`)

Triggers automatically once the CI pipeline completes successfully on `main` or `development`. Connects to your ArgoCD instance and syncs the application, then waits up to 5 minutes for it to reach a healthy state.

```
CI Pipeline succeeds (main / development)
    │
    ▼
Install ArgoCD CLI
    │
    ▼
Login to ArgoCD server
    │
    ▼
argocd app sync
    │
    ▼
argocd app wait --health (timeout: 300s)
```

**Required secrets:**

| Secret | Description |
|---|---|
| `ARGOCD_SERVER` | Hostname of your ArgoCD instance |
| `ARGOCD_USERNAME` | ArgoCD login username |
| `ARGOCD_PASSWORD` | ArgoCD login password |

---

### Dependabot (`dependabot.yml`)

Keeps dependencies up to date automatically with weekly pull requests every Monday.

| Ecosystem | Directory | PRs limit |
|---|---|---|
| `github-actions` | `/` | 3 open PRs max |

> **Note:** The original config also included `pip` (Python) updates — this has been removed as Aurum is a pure Next.js project. Only GitHub Actions versions are auto-updated.

All Dependabot PRs are assigned to `@abdelkderboukert` and labeled `dependencies`.

---

## 👤 Author

**Abdelkader Boukert**  
Full-Stack Web Developer  
📧 [abdelkaderboukart@gmail.com](mailto:abdelkaderboukart@gmail.com)  
🐙 [github.com/abdelkaderboukert](https://github.com/abdelkaderboukert)

---

## 📄 License

Copyright © 2026 **Abdelkader Boukert**. All rights reserved.

This software and its source code are **proprietary and confidential**. It is licensed, not sold.

- ✅ You may use, modify, and deploy this software for your own clients as part of a commercial SaaS offering.
- ❌ You may **not** redistribute, resell, sublicense, or publish the source code publicly without explicit written permission from the author.
- ❌ You may **not** claim authorship of this software.

For licensing inquiries, contact: [abdelkaderboukart@gmail.com](mailto:abdelkaderboukart@gmail.com)

See the [`LICENSE`](./LICENSE) file for the full legal terms.

---

> *Built with attention to detail — from pixel-perfect UI to secure server-side payment architecture.*