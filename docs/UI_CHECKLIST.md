# UI Checklist - Kiểm Tra Giao Diện

## ✅ Các File CSS Đã Được Tạo/Cập Nhật

### 1. ProductDetailPage.css ✅
- [x] Layout trang chi tiết sản phẩm
- [x] Breadcrumbs
- [x] Product images (main + thumbnails)
- [x] Product details section
- [x] Color & size options
- [x] Quantity selector
- [x] Trade type buttons (Mua/Thuê)
- [x] Rent price info display
- [x] Add to cart button
- [x] Product tabs (description, specs, reviews)

### 2. CheckoutPage.css ✅
- [x] Checkout page layout
- [x] Delivery form
- [x] Product list in cart
- [x] Quantity controls
- [x] Voucher selection
- [x] Summary rows
- [x] Continue button
- [x] **checkout-product-deposit** class (hiển thị thông tin thuê)

### 3. CheckoutPaymentPage.css ✅
- [x] Payment page layout
- [x] Shipping method options
- [x] Payment method options
- [x] Order summary
- [x] Product items display
- [x] **payment-summary-deposit** class (hiển thị thông tin thuê)
- [x] Voucher input
- [x] Complete order button

## 🔍 Các Trang Cần Kiểm Tra

### Trang Chi Tiết Sản Phẩm (`/product/:id`)
**Kiểm tra:**
- [ ] Hiển thị ảnh sản phẩm chính và thumbnails
- [ ] Breadcrumbs hoạt động
- [ ] Chọn màu sắc
- [ ] Chọn kích thước
- [ ] Nút Mua/Thuê (nếu sản phẩm BOTH)
- [ ] Chọn thời gian thuê (hiện khi chọn Thuê)
- [ ] Hiển thị giá thuê + cọc
- [ ] Tính tổng thanh toán đúng
- [ ] Nút "Thêm vào giỏ hàng"
- [ ] Tabs: Mô tả, Thông số, Đánh giá

**Sản phẩm test:**
- Sản phẩm BUY_ONLY: Chỉ hiện giá mua
- Sản phẩm RENT_ONLY: Chỉ hiện giá thuê + chọn thời gian
- Sản phẩm BOTH: Hiện nút chọn Mua/Thuê

### Trang Checkout (`/checkout`)
**Kiểm tra:**
- [ ] Form thông tin giao hàng
- [ ] Dropdown tỉnh/huyện/xã
- [ ] Danh sách sản phẩm trong giỏ
- [ ] Hiển thị đúng: "Thuê X ngày/tuần/tháng" cho sản phẩm thuê
- [ ] Hiển thị đúng: "Mua" cho sản phẩm mua
- [ ] Tăng/giảm số lượng
- [ ] Chọn voucher
- [ ] Tính tổng đúng (giá thuê × thời gian + cọc)
- [ ] Nút "Tiếp tục đến phương thức thanh toán"

### Trang Payment (`/checkout/payment`)
**Kiểm tra:**
- [ ] Chọn phương thức vận chuyển
- [ ] Chọn phương thức thanh toán
- [ ] Tóm tắt đơn hàng
- [ ] Hiển thị chi tiết thuê: "Thuê X ngày: XXX VNĐ + Cọc: XXX VNĐ"
- [ ] Nhập mã giảm giá
- [ ] Tính tổng cuối cùng đúng
- [ ] Nút "Hoàn tất đơn hàng"

### Trang Lịch Sử Đơn Hàng (`/order-history`)
**Kiểm tra:**
- [ ] Hiển thị danh sách đơn hàng
- [ ] Trạng thái đơn hàng (PENDING, RENTING, RETURNED, OVERDUE...)
- [ ] Chi tiết sản phẩm thuê
- [ ] Nút hủy đơn (khi PENDING)

## 🎨 CSS Classes Mới Được Thêm

### ProductDetailPage
```css
.trade-type-options
.trade-type-btn
.trade-type-btn.selected
.rent-price-info
.rent-price-main
.deposit-info
.total-rent-info
```

### CheckoutPage
```css
.checkout-product-deposit  /* Hiển thị "Thuê X ngày" hoặc "Mua" */
```

### CheckoutPaymentPage
```css
.payment-summary-deposit  /* Hiển thị chi tiết giá thuê + cọc */
```

## 🐛 Các Lỗi Thường Gặp

### 1. CSS không load
**Nguyên nhân:** File CSS chưa được import
**Giải pháp:** Kiểm tra import trong file JSX:
```javascript
import '../styles/ProductDetailPage.css';
```

### 2. Nút Mua/Thuê không hiện
**Nguyên nhân:** Sản phẩm không có `tradeType: 'BOTH'`
**Giải pháo:** Chỉ sản phẩm BOTH mới hiện nút chọn

### 3. Giá tính sai
**Nguyên nhân:** Logic tính giá thuê chưa đúng
**Kiểm tra:**
- Giá thuê = rentPrice × rentDuration
- Tổng = Giá thuê + deposit
- Với số lượng > 1: Tổng × quantity

### 4. Thời gian thuê không lưu
**Nguyên nhân:** `rentDuration` không được truyền vào cart
**Giải pháp:** Đảm bảo `addToCart` nhận đủ params:
```javascript
addToCart({
  productId,
  product,
  quantity,
  orderType: 'RENT',
  rentDuration: 7,  // ← Quan trọng!
  ...
});
```

## 📝 Test Cases

### Test Case 1: Thuê Sản Phẩm
1. Vào trang chi tiết sản phẩm RENT_ONLY
2. Chọn thời gian thuê: 7 ngày
3. Số lượng: 1
4. Thêm vào giỏ
5. Vào checkout
6. **Kỳ vọng:** Hiển thị "Thuê 7 ngày: XXX VNĐ + Cọc: XXX VNĐ"

### Test Case 2: Mua Sản Phẩm
1. Vào trang chi tiết sản phẩm BUY_ONLY
2. Số lượng: 2
3. Thêm vào giỏ
4. Vào checkout
5. **Kỳ vọng:** Hiển thị "Mua" và giá × 2

### Test Case 3: Sản Phẩm BOTH
1. Vào trang chi tiết sản phẩm BOTH
2. Chọn "Thuê"
3. Chọn thời gian: 14 ngày
4. Thêm vào giỏ
5. Quay lại, chọn "Mua"
6. Thêm vào giỏ
7. **Kỳ vọng:** Giỏ có 2 item: 1 thuê, 1 mua

## 🚀 Cách Test Nhanh

```bash
# 1. Build frontend
cd mimi/mimiStyle-frontend
npm run build

# 2. Start backend
cd mimi/mimiStyle-backend/mimi/mimi
mvn spring-boot:run

# 3. Mở browser
# http://localhost:5173 (dev) hoặc http://localhost:8080 (prod)

# 4. Test flow:
# - Đăng nhập
# - Vào trang sản phẩm
# - Chọn sản phẩm thuê
# - Thêm vào giỏ
# - Checkout
# - Kiểm tra hiển thị
```

## ✨ Kết Luận

Tất cả CSS đã được tạo và import đúng. Nếu vẫn thấy lỗi hiển thị:
1. Clear browser cache (Ctrl + Shift + R)
2. Kiểm tra Console (F12) xem có lỗi CSS không
3. Kiểm tra Network tab xem file CSS có load không
4. Restart dev server
