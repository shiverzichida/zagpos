POS Ristro Clone - Implementation Plan
Clone aplikasi POS (Point of Sale) dari https://pos.ristro.id menggunakan Next.js + React dengan Supabase sebagai backend dan deploy ke Netlify.

Tech Stack
Layer	Technology
Frontend	Next.js 14 (App Router), React 18, TypeScript
Styling	CSS Modules + Custom CSS (dark theme, glassmorphism)
Backend	Supabase (Auth, Database, Real-time)
Deployment	Netlify
State	React Context + Zustand (untuk cart/order)
Proposed Changes
1. Project Initialization
[NEW] Project Setup
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install @supabase/supabase-js zustand
[NEW] 
.env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
[NEW] 
netlify.toml
Konfigurasi build untuk Netlify deployment.

2. Supabase Database Schema
Tables to Create:
-- Categories (Coffee, Food, Drinks)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Products (Espresso, Cappuccino, etc)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Modifier Groups (Size, Milk Type, Sugar Level)
CREATE TABLE modifier_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  required BOOLEAN DEFAULT false
);
-- Modifiers (Small, Medium, Large, Dairy, Oat, etc)
CREATE TABLE modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES modifier_groups(id),
  name TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0
);
-- Product-Modifier relationship
CREATE TABLE product_modifiers (
  product_id UUID REFERENCES products(id),
  modifier_group_id UUID REFERENCES modifier_groups(id),
  PRIMARY KEY (product_id, modifier_group_id)
);
-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT DEFAULT 1,
  modifiers JSONB,
  subtotal DECIMAL(10,2)
);
3. Project Structure
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   ├── sales/page.tsx          # Main POS page
│   │   ├── transactions/page.tsx   # Order history
│   │   ├── menu-builder/page.tsx   # Product management
│   │   ├── account/page.tsx        # Account info
│   │   └── settings/page.tsx       # Settings
│   ├── layout.tsx
│   └── page.tsx                    # Redirect to /sales
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── PinDialog.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── pos/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── CurrentOrder.tsx
│   │   ├── OrderItem.tsx
│   │   └── ModifierModal.tsx
│   └── menu-builder/
│       ├── CategoryList.tsx
│       └── ProductForm.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Supabase client
│   │   └── server.ts               # Server-side client
│   └── utils.ts
├── stores/
│   └── orderStore.ts               # Zustand store for cart
├── types/
│   └── index.ts                    # TypeScript interfaces
└── styles/
    └── globals.css                 # Global styles + theme
4. Key Components
[NEW] 
src/components/pos/ProductGrid.tsx
Grid produk dengan kategori filter, responsive layout.

[NEW] 
src/components/pos/CurrentOrder.tsx
Panel order di sisi kanan, menampilkan items, subtotal, dan tombol Pay.

[NEW] 
src/components/pos/ModifierModal.tsx
Modal untuk memilih modifier (Size, Milk Type) saat klik produk.

[NEW] 
src/components/auth/PinDialog.tsx
Dialog PIN dengan virtual keypad (6 digit).

5. Design System
Theme: Dark mode dengan accent hijau/teal (seperti Ristro)

:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-card: #242424;
  --accent: #10b981;
  --accent-light: #34d399;
  --text-primary: #ffffff;
  --text-secondary: #a3a3a3;
  --border: #333333;
}
User Review Required
IMPORTANT

Supabase Project Setup Required Anda perlu membuat project Supabase baru dan memberikan credentials:

SUPABASE_URL
SUPABASE_ANON_KEY
WARNING

Scope Prioritas Mengingat kompleksitas, saya sarankan fokus dulu ke:

✅ Login + PIN
✅ Sales/POS page (core functionality)
⏳ Transactions page
⏳ Menu Builder, Account, Settings (phase 2)
Setuju dengan prioritas ini?

Verification Plan
Automated Tests
# Run Next.js build to check for errors
npm run build
# Run linting
npm run lint
Manual Verification (Browser)
Login Flow:

Buka http://localhost:3000/login
Input email/password → klik Sign In
Dialog PIN muncul → input 6 digit → submit
Redirect ke /sales
POS Page:

Klik kategori filter (All, Coffee, Food, Drinks)
Klik produk → modal modifier muncul
Pilih modifier → Add to Order
Item muncul di Current Order panel
Total terupdate
Responsive:

Test di viewport mobile (375px)
Sidebar collapse/expand
Netlify Deployment
# Build command
npm run build
# Publish directory
.next