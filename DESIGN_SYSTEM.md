# Review Destination — Design System

> Agent reference file. Use this to stay consistent with the project's visual language when creating or editing any UI code.

---

## Color Palette

| Token          | Hex       | Usage                                                         |
| -------------- | --------- | ------------------------------------------------------------- |
| `primary`      | `#853853` | Brand color — buttons, icons, accents, links, decorative bars |
| `primary-dark` | `#612D53` | Hover / active state of primary buttons; hero gradient end    |
| `surface`      | `#F3F4F4` | Page background, ghost button fill, skeleton loaders          |
| `foreground`   | `#2C2C2C` | Primary text, headings, logo text                             |
| `white`        | `#FFFFFF` | Card backgrounds, form panels, navbar background              |

### Tailwind Usage (inline, hardcoded)

```
bg-[#853853]        → primary fill
hover:bg-[#612D53]  → primary hover
bg-[#F3F4F4]        → surface / ghost button bg
text-[#2C2C2C]      → primary text
border-[#853853]/10 → subtle primary-tinted border
border-[#853853]/30 → stronger primary-tinted border on hover
text-[#853853]      → primary-colored text / links
```

> **Note:** Tailwind CSS v4 is used (`@import "tailwindcss"`). Colors are written as inline arbitrary values — no custom theme extension in `tailwind.config`.

---

## Typography

| Role          | Class / Font                                           |
| ------------- | ------------------------------------------------------ |
| Primary font  | `var(--font-geist-sans)` (Google: Geist)               |
| Mono font     | `var(--font-geist-mono)` (Google: Geist Mono)          |
| Body fallback | `Arial, Helvetica, sans-serif`                         |
| Icon font     | `Material Symbols Outlined` (loaded from Google Fonts) |

### Typescale

| Size                                       | Usage                        |
| ------------------------------------------ | ---------------------------- |
| `text-7xl font-extrabold`                  | Hero H1 (lg screens)         |
| `text-5xl font-extrabold`                  | Hero H1 (mobile)             |
| `text-4xl font-bold`                       | Section H2 (lg)              |
| `text-3xl font-bold`                       | Section H2                   |
| `text-2xl font-bold` / `text-xl font-bold` | Sub-section headings         |
| `text-lg font-medium`                      | Subheadings / lead text      |
| `text-sm font-semibold`                    | Nav links, labels, meta text |
| `text-sm`                                  | Body / card descriptions     |
| `text-xs`                                  | Timestamps, captions         |

---

## Buttons

### Primary (filled)

```tsx
className="bg-[#853853] hover:bg-[#612D53] text-white font-bold rounded-xl
           py-4 px-8 transition-all shadow-2xl hover:scale-105 active:scale-95"
```

### Primary (small — navbar / forms)

```tsx
className="bg-[#853853] hover:bg-[#612D53] text-white font-bold rounded-lg
           h-10 px-5 text-sm transition-all"
```

### Ghost / Secondary

```tsx
className="bg-[#F3F4F4] text-[#2C2C2C] font-bold rounded-lg
           h-10 px-5 text-sm border border-[#853853]/10
           hover:border-[#853853]/30 transition-all"
```

### Transparent / Outline (on dark backgrounds)

```tsx
className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white
           border border-white/30 py-4 px-8 rounded-xl font-bold
           transition-all shadow-2xl"
```

---

## Cards

```tsx
// Review card
className="bg-white rounded-2xl shadow-md overflow-hidden
           hover:shadow-xl transition-all duration-300 hover:-translate-y-1
           flex flex-col"

// Feature / info card
className="bg-white rounded-2xl p-6 shadow-sm"
```

---

## Layout & Spacing

| Pattern                    | Classes                                                |
| -------------------------- | ------------------------------------------------------ |
| Page background            | `min-h-screen bg-[#F3F4F4]`                            |
| Section padding            | `px-6 lg:px-20 py-20`                                  |
| Section — white background | `px-6 lg:px-20 py-20 bg-white`                         |
| Content max-width (large)  | `max-w-7xl mx-auto`                                    |
| Content max-width (medium) | `max-w-6xl mx-auto` / `max-w-5xl mx-auto`              |
| Content max-width (narrow) | `max-w-4xl mx-auto` / `max-w-2xl mx-auto`              |
| Section heading block      | `flex flex-col gap-4 mb-16 text-center items-center`   |
| Decorative underline bar   | `h-1.5 w-20 bg-[#853853] rounded-full`                 |
| Responsive grid (reviews)  | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8` |
| Responsive grid (features) | `grid grid-cols-1 md:grid-cols-3 gap-10`               |

---

## Navbar

- `sticky top-0 z-50`
- Background: `bg-white`
- Border: `border-b border-[#853853]/10`
- Padding: `px-6 py-4 lg:px-20`
- Logo icon: `size-8 bg-[#853853] rounded-lg text-white` with `explore` Material Symbol
- Logo text: `text-[#2C2C2C] text-xl font-bold tracking-tight`
- Nav links: `text-[#2C2C2C] text-sm font-semibold hover:text-[#853853] transition-colors`

---

## Form Elements

```tsx
// Label
className="text-sm font-medium text-slate-700 dark:text-slate-300"

// Input
className="w-full px-4 py-3 rounded-lg border border-slate-200
           dark:border-slate-700 bg-white dark:bg-stone-900
           text-slate-900 dark:text-slate-100
           focus:outline-none focus:ring-2 focus:ring-[#853853]/30
           focus:border-[#853853] transition-all text-sm"

// Error message
className="text-red-500 text-sm"

// Submit button — same as Primary button, full width
className="w-full bg-[#853853] hover:bg-[#612D53] ..."
```

---

## Avatars & Initials

- Shape: `rounded-full`
- Size (standard): `w-10 h-10`
- Text: `text-sm font-bold text-white select-none`
- Avatar colors pool (assigned by name charCode):
  ```
  bg-[#853853]  → primary
  bg-[#612D53]  → primary-dark
  bg-green-500
  bg-orange-500
  bg-pink-500
  bg-teal-500
  ```
- Profile images: `rounded-full border-2 border-white object-cover`

---

## Hero / Background Images

```tsx
// Overlay gradient (brand-tinted)
backgroundImage: "linear-gradient(rgba(133,56,83,0.72), rgba(97,45,83,0.80)), url('<image-url>')";

// Dark overlay (generic)
className =
  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent";
```

---

## Skeleton / Loading States

```tsx
// Inline skeleton block
className = "bg-[#F3F4F4] rounded-lg animate-pulse";

// Skeleton for buttons
className = "w-20 h-10 bg-[#F3F4F4] rounded-lg animate-pulse";
className = "w-28 h-10 bg-[#853853]/20 rounded-lg animate-pulse";
```

---

## Icons

Use **Material Symbols Outlined** exclusively.

```tsx
<span className="material-symbols-outlined">icon_name</span>
```

Size is controlled by the parent's font-size or custom `text-xl`, `text-2xl`, etc.  
The font is globally configured in `globals.css` under `.material-symbols-outlined`.

---

## Transitions & Motion

| Pattern              | Classes                                                   |
| -------------------- | --------------------------------------------------------- |
| Standard interactive | `transition-all duration-300`                             |
| Fast colors/borders  | `transition-colors` / `transition-all`                    |
| Card lift on hover   | `hover:-translate-y-1`                                    |
| Button scale         | `hover:scale-105 active:scale-95`                         |
| Image zoom in card   | `group-hover:scale-105 transition-transform duration-500` |

---

## Tech Stack

| Area         | Tool                                                        |
| ------------ | ----------------------------------------------------------- |
| Framework    | Next.js 15+ (App Router, Server Components)                 |
| Styling      | Tailwind CSS v4                                             |
| Fonts        | `next/font/google` — Geist, Geist Mono                      |
| Icons        | Material Symbols Outlined                                   |
| Animations   | Lottie (`lottie-react`)                                     |
| Images       | `next/image` + Cloudinary / Unsplash                        |
| Navigation   | `react-transition-progress/next` `<Link>` (not `next/link`) |
| Auth         | Custom (actions: sign-in, sign-up, sign-out)                |
| Database     | MongoDB                                                     |
| Progress bar | `react-transition-progress` — sky-500                       |
