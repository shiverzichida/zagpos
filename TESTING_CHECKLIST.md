# Testing Checklist - POS Ristro Clone

## 1. Sales Page Testing

### Product Selection
- [ ] Load `/sales` page
- [ ] Verify products loaded from Supabase (bukan demo data)
- [ ] Click "All" category - shows all products
- [ ] Click "Coffee" category - shows coffee products only
- [ ] Click "Food" category - shows food products only
- [ ] Click "Drinks" category - shows drinks products only

### Add to Cart
- [ ] Click product tanpa modifier
- [ ] Verify item added to Current Order panel
- [ ] Check subtotal calculation benar
- [ ] Increase quantity dengan tombol "+"
- [ ] Decrease quantity dengan tombol "-"
- [ ] Remove item dengan tombol "X"
- [ ] Click "Clear" - cart dikosongkan

### Modifier Selection (Jika sudah seed)
- [ ] Click coffee product
- [ ] Modal modifier muncul
- [ ] Select Size (required) - Small/Medium/Large
- [ ] Select Milk Type (optional)
- [ ] Select Sugar Level (optional)
- [ ] Verify price adjustment di total
- [ ] Click "Add to Order"
- [ ] Verify modifier names muncul di cart item

### Payment Flow
- [ ] Add minimal 1 item ke cart
- [ ] Click "Pay" button
- [ ] Payment modal muncul
- [ ] Verify order summary benar
- [ ] Select payment method (Cash/Card/QRIS)
- [ ] Click confirm
- [ ] Verify success alert muncul
- [ ] Verify cart cleared
- [ ] Check Supabase `orders` table - order baru ada
- [ ] Check Supabase `order_items` table - items ada

## 2. Transactions Page Testing

### Order List
- [ ] Load `/transactions` page
- [ ] Verify orders dari database muncul
- [ ] Verify sorting by date (terbaru di atas)
- [ ] Verify price format (IDR)
- [ ] Verify status badge (completed/pending/cancelled)

### Order Detail
- [ ] Click order card
- [ ] Modal detail muncul
- [ ] Verify order items benar
- [ ] Verify modifiers muncul (jika ada)
- [ ] Verify total benar
- [ ] Verify date & status
- [ ] Click "Close" - modal tertutup

## 3. Menu Builder Testing

### Categories CRUD
- [ ] Load `/menu-builder` page
- [ ] Click "+ Add" di Categories panel
- [ ] Enter name & icon emoji
- [ ] Click "Save" - category baru muncul
- [ ] Click edit icon category
- [ ] Ubah name/icon
- [ ] Click "Save" - perubahan tersimpan
- [ ] Click delete icon
- [ ] Confirm delete - category terhapus
- [ ] Verify di Supabase `categories` table

### Products CRUD
- [ ] Click "+ Add Product"
- [ ] Enter name, price, category
- [ ] Click "Save" - product baru muncul
- [ ] Verify di grid sesuai category
- [ ] Click edit icon product
- [ ] Ubah name/price/category
- [ ] Click "Save" - perubahan tersimpan
- [ ] Click delete icon
- [ ] Confirm delete - product terhapus
- [ ] Verify di Supabase `products` table

### Category Filter
- [ ] Click "All Products" - shows all
- [ ] Click category - filter by category
- [ ] Verify product count benar

## 4. Account Page Testing

- [ ] Load `/account` page
- [ ] Verify placeholder info muncul
- [ ] Check layout responsive

## 5. Settings Page Testing

- [ ] Load `/settings` page
- [ ] Verify placeholder settings muncul
- [ ] All cards render correctly

## 6. Responsive Design Testing

### Desktop (1920x1080)
- [ ] Sidebar visible
- [ ] Current Order panel fixed right
- [ ] Product grid 5 columns
- [ ] All modals center

### Tablet (768x1024)
- [ ] Sidebar collapse/expand
- [ ] Product grid 3-4 columns
- [ ] Current Order overlay atau scroll

### Mobile (375x667)
- [ ] Sidebar hamburger menu
- [ ] Product grid 2 columns
- [ ] Current Order bottom sheet
- [ ] Modals full width

## 7. Performance Testing

- [ ] Page load < 3 seconds
- [ ] Smooth scrolling
- [ ] No layout shift
- [ ] Images optimized (Next/Image)

## 8. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## 9. Database Integrity

- [ ] Orders table has correct data
- [ ] Order items linked correctly
- [ ] Foreign keys valid
- [ ] No orphaned records

## 10. Error Handling

- [ ] Network error - graceful fallback
- [ ] Empty states - show placeholder
- [ ] Form validation - show errors
- [ ] Database error - console log

---

## Critical Issues
List any critical bugs found:

1.
2.
3.

## Nice to Have Improvements
List enhancement ideas:

1.
2.
3.
