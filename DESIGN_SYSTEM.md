# 🎨 KasBon Digital & Inventaris Warung — Design System

This application features a modern, clean, and professional design system with a dominant **blue theme** paired with high-contrast semantic indicators for financial operations (emerald for positive/profit/cash, rose/amber for debt/low stock).

## 1. Color Palette

Our colors are configured within the Tailwind design configuration file `tailwind.config.js`.

- **Primary Brand (Blue)**:
  - `primary-50`: `#eff6ff` (Light background alerts)
  - `primary-600`: `#2563eb` (Main brand color, active buttons, highlights)
  - `primary-700`: `#1d4ed8` (Button hover states)
  - `primary-950`: `#172554` (Main titles / dark mode text headers)
- **Semantic Feedback**:
  - **Success (Emerald)**: Cash payments, paid status, net profits.
  - **Warning (Amber)**: Partially paid debts, warning indicators.
  - **Danger (Rose/Red)**: Outstanding unpaid debts, items out of stock, deleted actions.
- **Neutrals (Slate)**:
  - `slate-50`: `#f8fafc` (Main body background)
  - `slate-200`: `#e2e8f0` (Borders, card dividers)
  - `slate-800`: `#1e293b` (Sidebar headings)
  - `slate-900`: `#0f172a` (Sidebar background, extreme dark mode headers)

## 2. Typography

We use **Plus Jakarta Sans** as our primary typeface, imported directly from Google Fonts in the root layout.
- **Font Sizes**:
  - `text-[10px]` / `xs` (Labels, helper texts, table headers)
  - `text-sm` (Main body text, inputs, buttons)
  - `text-base` / `lg` (Card headers, modal titles)
  - `text-2xl` / `3xl` (Stat counts, numeric totals)

## 3. Spacing & Borders

- **Spacing**: Follows Tailwind 4x grid system (e.g. `p-4` = 16px, `p-6` = 24px, `space-y-4` = 16px).
- **Border Radius**: Consistent `rounded-xl` (12px) for cards, dialog inputs, POS grids, and `rounded-lg` (8px) for buttons/inputs.
- **Shadows**:
  - `shadow-sm` (Cards, POS grid items)
  - `shadow-md` / `shadow-lg` (Dropdowns, popups, hover states)

## 4. Reusable Styles (Component Wrappers)

- **Button (`Button.jsx`)**: Encapsulates `variants` (primary, secondary, danger, outline, ghost) and standard loading animations.
- **Input (`Input.jsx`)**: Groups form validation states, borders, outline focuses, and leading icons.
- **Badge (`Badge.jsx`)**: Semantic tags with soft background overlays (`bg-emerald-50 text-emerald-700 border-emerald-200`).
- **Card (`Card.jsx`)**: Container with standard border radius, borders, and shadows for clean grid structures.