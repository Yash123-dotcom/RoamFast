# NeonStay UI/UX Testing Guide

## Quick Start
1. Ensure both servers are running
2. Open browser to `http://localhost:3000`
3. Follow tests below

---

## 🎨 Visual Design Tests

### Color Scheme
- [ ] Dark backgrounds (`#020617`, `#0f172a`) throughout
- [ ] Gold accent (`#D4AF37`) on CTAs, highlights
- [ ] White text for headings, `slate-400` for secondary text
- [ ] Consistent color usage across all pages

### Typography
- [ ] Headings use Cormorant Garamond (serif)
- [ ] Body text uses DM Sans (sans-serif)
- [ ] Font sizes appropriate for hierarchy
- [ ] Text readable on all backgrounds

### Spacing & Layout
- [ ] Consistent padding/margins
- [ ] Proper alignment of elements
- [ ] No overlapping content
- [ ] White space well-utilized

---

## 🏠 Homepage Tests (`/`)

### Hero Section
- [ ] Main heading visible and impactful
- [ ] Subheading/tagline readable
- [ ] CTA buttons styled with gold accent
- [ ] Background gradient/image loads

### Sections (Scroll Down)
- [ ] Featured Destinations cards display
- [ ] How It Works (3 steps with icons)
- [ ] Trending Hotels grid
- [ ] AI Concierge section
- [ ] Testimonials carousel
- [ ] Stats section with numbers

### Interactions
- [ ] Hover effects on cards/buttons work
- [ ] Animations smooth (not janky)
- [ ] Click destination → goes to search
- [ ] Click trending hotel → goes to details

---

## 🧭 Navigation Tests

### Navbar
- [ ] Logo visible (links to home)
- [ ] Nav links readable
- [ ] Sign In button styled
- [ ] Book Now button prominent
- [ ] Mobile hamburger menu (on small screens)
- [ ] Glassmorphism effect on scroll

### Footer
- [ ] All sections visible
- [ ] Links styled appropriately
- [ ] Newsletter input field styled
- [ ] Social icons present

---

## 🔍 Search Page (`/search`)

### Layout
- [ ] Filter sidebar/section visible
- [ ] Hotel cards in grid layout
- [ ] Responsive on mobile

### Filters (if visible)
- [ ] Price range slider styled
- [ ] Amenities checkboxes aligned
- [ ] Location search box

### Hotel Cards
- [ ] Images load (or placeholder shown)
- [ ] Hotel name, city, price visible
- [ ] Rating stars/number displayed
- [ ] Hover effect on cards
- [ ] Click redirects to hotel details

---

## 🏨 Hotel Details (`/hotels/[id]`)

### Information Display
- [ ] Hotel name as prominent heading
- [ ] Image gallery styled
- [ ] Description readable
- [ ] Address and city visible
- [ ] Amenities list with icons

### Booking Form
- [ ] Date pickers styled
- [ ] Guest selector dropdown
- [ ] Price displayed
- [ ] "Book Now" button prominent
- [ ] Form validation messages styled

### Reviews Section
- [ ] Reviews display nicely
- [ ] Rating breakdown visible
- [ ] Submit review form styled

---

## 💳 Checkout (`/checkout`)

### Layout
- [ ] Two-column or single-column responsive layout
- [ ] Booking summary card styled
- [ ] Payment form section distinct

### Booking Summary
- [ ] Hotel details clear
- [ ] Dates formatted nicely
- [ ] Price breakdown readable
- [ ] Total prominent

### Payment Form
- [ ] Stripe elements load and match theme
- [ ] Input fields styled consistently
- [ ] Submit button prominent
- [ ] Error messages styled

---

## 👤 Dashboards

### User Dashboard (`/dashboard`)
- [ ] Welcome message/heading
- [ ] Bookings cards/table styled
- [ ] Empty state (if no bookings) designed
- [ ] Status badges color-coded

### Owner Dashboard (`/owner/dashboard`)
- [ ] Analytics cards in grid
- [ ] Numbers large and readable
- [ ] Tabs styled and interactive
- [ ] Property cards consistent
- [ ] "Manage" buttons visible

### Admin Dashboard (`/admin/dashboard`)
- [ ] Stats cards prominent
- [ ] "Total Revenue" card clickable with hover
- [ ] Pending approvals list styled
- [ ] Approve/Reject buttons distinct

### Admin Revenue (`/admin/revenue`)
- [ ] 4 stat cards in grid
- [ ] Icons match theme
- [ ] Payout breakdown cards color-coded:
  - Pending (amber)
  - Paid (green)
  - Failed (red)
- [ ] Transactions table:
  - Headers clear
  - Rows readable
  - Status badges colored
  - Responsive (scrollable on mobile)
- [ ] "Back to Dashboard" link styled

---

## 🏢 Forms

### List Property (`/list-property`)
- [ ] Progress indicator visible
- [ ] Step navigation works (Next/Back)
- [ ] Form inputs styled consistently
- [ ] File upload area designed
- [ ] Subscription tiers cards styled
- [ ] Submit button prominent

### Edit Property (`/owner/properties/[id]/edit`)
- [ ] Pre-filled data loads
- [ ] Form matches create style
- [ ] Save button distinct

---

## 📱 Responsive Design

### Mobile (< 768px)
- [ ] Navbar collapses to hamburger
- [ ] Cards stack vertically
- [ ] Text sizes readable
- [ ] Buttons thumb-friendly
- [ ] No horizontal scroll

### Tablet (768px - 1024px)
- [ ] 2-column grids where appropriate
- [ ] Sidebar filters accessible
- [ ] Forms comfortable width

### Desktop (> 1024px)
- [ ] 3-4 column grids utilized
- [ ] Max-width containers centered
- [ ] Ample white space

---

## ✨ Animations & Effects

### Hover States
- [ ] Buttons change on hover
- [ ] Cards lift/scale slightly
- [ ] Links show underline/color change

### Transitions
- [ ] Smooth (not instant)
- [ ] Consistent duration (~200-300ms)
- [ ] No lag or jank

### Framer Motion
- [ ] Elements fade in on scroll
- [ ] Stagger animations work
- [ ] Not too aggressive

---

## ♿ Accessibility

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Enter/Space activate buttons

### Contrast
- [ ] Text readable on backgrounds
- [ ] Meets WCAG AA standards (check with tool)

### Labels
- [ ] Buttons have descriptive text/aria-labels
- [ ] Form inputs have labels

---

## 🐛 Common Issues to Check

### Images
- [ ] No broken image icons
- [ ] Placeholders if image fails
- [ ] Lazy loading works

### Text
- [ ] No Lorem Ipsum left
- [ ] No overflowing text
- [ ] Line breaks appropriate

### Spacing
- [ ] No cramped sections
- [ ] No excessive gaps
- [ ] Mobile spacing adequate

### Performance
- [ ] Pages load quickly
- [ ] No spinning/loading indefinitely
- [ ] Smooth scrolling

---

## 📸 Screenshot Checklist

Take screenshots of:
1. Homepage (full scroll)
2. Search page with filters
3. Hotel detail page
4. Owner dashboard
5. Admin dashboard
6. Admin revenue page
7. List property form (step 1)
8. Mobile navbar menu

---

## ✅ Overall UI Quality Check

- [ ] Professional appearance
- [ ] Consistent design language
- [ ] Polished and production-ready
- [ ] Premium feel (not generic)
- [ ] Responsive across devices
- [ ] Smooth interactions
- [ ] No obvious bugs or glitches
