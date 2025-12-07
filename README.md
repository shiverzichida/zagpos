# README - POS Ristro Clone

## 📦 Tentang Project
Clone aplikasi POS (Point of Sale) dari [pos.ristro.id](https://pos.ristro.id) menggunakan Next.js 14, React 18, TypeScript, dan Supabase.

## ✨ Fitur

### ✅ Sudah Diimplementasikan
- **Sales/POS Page** - Point of sale dengan product grid, category filter, cart management
- **Payment Flow** - Multi payment methods (Cash, Card, QRIS) dengan penyimpanan ke database
- **Transactions Page** - Riwayat order lengkap dengan detail items dan modifiers
- **Menu Builder** - CRUD Categories & Products
- **Modifiers** - Size, Milk Type, Sugar Level untuk coffee products
- **Account Page** - User profile placeholder
- **Settings Page** - System settings placeholder
- **Dark Theme** - UI dengan accent hijau/teal

### 🎨 Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS v4, Custom CSS Variables
- **Backend:** Supabase (Database, Auth)
- **State Management:** Zustand
- **Deployment:** Netlify

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd posspa
npm install
```

### 2. Setup Supabase
1. Buat project baru di [Supabase](https://supabase.com)
2. Run SQL schema dari root folder (lihat file SQL)
3. Copy credentials ke `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Seed Database
Jalankan SQL berikut di Supabase SQL Editor:
- Schema tables (categories, products, dll)
- Seed data (sample products)
- Modifier data (optional - lihat `MODIFIER_SEED.md`)

### 4. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/
│   │   ├── sales/             # POS page
│   │   ├── transactions/      # Order history
│   │   ├── menu-builder/      # CRUD products
│   │   ├── account/           # User profile
│   │   └── settings/          # Settings
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # Button, Card, Modal, Input
│   ├── auth/                  # LoginForm, PinDialog
│   ├── layout/                # Sidebar
│   └── pos/                   # POS components
├── lib/supabase/              # Supabase client
├── stores/                    # Zustand stores
└── types/                     # TypeScript types
```

## 🗄️ Database Schema

### Tables
- `categories` - Product categories (Coffee, Food, Drinks)
- `products` - Menu items dengan price
- `modifier_groups` - Group modifiers (Size, Milk Type, Sugar Level)
- `modifiers` - Modifier options
- `product_modifiers` - Link products dengan modifier groups
- `orders` - Order records
- `order_items` - Items dalam order dengan modifiers

## 🎯 Usage

### Sales Page
1. Pilih kategori atau lihat semua produk
2. Klik produk untuk add to cart (dengan modifier jika ada)
3. Adjust quantity di cart panel
4. Click "Pay" dan pilih payment method
5. Order akan tersimpan ke database

### Menu Builder
1. Add/Edit/Delete categories dengan emoji icon
2. Add/Edit/Delete products dengan harga
3. Assign products ke categories
4. Real-time sync dengan database

### Transactions
1. Lihat semua order history
2. Click order untuk detail items dan modifiers
3. Status tracking (completed, pending, cancelled)

## 🔧 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
```

## 🚢 Deployment

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap deployment ke Netlify.

### Quick Deploy
```bash
# Push ke GitHub
git push origin main

# Connect di Netlify
# Set environment variables
# Auto-deploy on push
```

## 📝 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 🎨 Design System

### Colors
- Background Primary: `#0a0a0a`
- Background Secondary: `#1a1a1a`
- Card: `#242424`
- Accent: `#10b981` (Green)
- Text Primary: `#ffffff`
- Text Secondary: `#a3a3a3`

### Typography
- Font: Geist Sans
- Mono: Geist Mono

## 🐛 Known Issues & Limitations

- Authentication flow not fully implemented (skip for demo)
- Image upload not implemented di Menu Builder
- Print receipt feature not implemented
- Real-time sync via Supabase Realtime not enabled

## 🚀 Future Improvements

- [ ] User authentication & roles
- [ ] Product image upload
- [ ] Receipt printing
- [ ] Real-time order updates
- [ ] Sales analytics dashboard
- [ ] Multi-store support
- [ ] Inventory management
- [ ] Customer management

## 📄 License

MIT

## 👤 Author

Your Name

---

**Demo:** [Live Demo URL setelah deploy]

**Support:** [Your contact/support info]
