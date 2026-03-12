# Hệ Thống Thuê Sản Phẩm - Tài Liệu Kỹ Thuật

## Tổng Quan

Hệ thống thuê sản phẩm đã được cải thiện để hoạt động giống các shop thuê sản phẩm chuyên nghiệp, bao gồm:
- Chọn thời gian thuê (ngày/tuần/tháng/năm)
- Quản lý tiền cọc
- Theo dõi ngày trả hàng
- Trạng thái đơn thuê chi tiết
- Hoàn trả tiền cọc

## Các Tính Năng Chính

### 1. Loại Giao Dịch (TradeType)
- **BUY_ONLY**: Chỉ bán
- **RENT_ONLY**: Chỉ cho thuê
- **BOTH**: Cả bán và thuê

### 2. Đơn Vị Thuê (RentUnit)
- **DAY**: Ngày
- **WEEK**: Tuần
- **MONTH**: Tháng
- **YEAR**: Năm

### 3. Trạng Thái Đơn Hàng (OrderStatus)

#### Đơn Mua:
- PENDING → CONFIRMED → SHIPPING → COMPLETED
- CANCELLED (có thể hủy khi PENDING)

#### Đơn Thuê:
- PENDING → CONFIRMED → SHIPPING → RENTING → RETURNED
- OVERDUE (quá hạn trả)
- CANCELLED (có thể hủy khi PENDING)

### 4. Quy Trình Thuê Sản Phẩm

#### Bước 1: Chọn Sản Phẩm
```javascript
// Frontend: ProductDetailPage.jsx
- Người dùng chọn loại giao dịch (Mua/Thuê) nếu sản phẩm hỗ trợ BOTH
- Chọn thời gian thuê (số ngày/tuần/tháng)
- Hệ thống tự động tính: Giá thuê × Thời gian + Tiền cọc
```

#### Bước 2: Thêm Vào Giỏ
```javascript
// CartContext.jsx
{
  productId: 123,
  orderType: 'RENT',
  rentDuration: 7,  // 7 ngày
  quantity: 1,
  product: {
    rentPrice: 50000,
    deposit: 200000,
    rentUnit: 'DAY'
  }
}
```

#### Bước 3: Thanh Toán
```javascript
// CheckoutPaymentPage.jsx
Tổng thanh toán = (Giá thuê × Thời gian + Tiền cọc) × Số lượng
Ví dụ: (50,000 × 7 + 200,000) × 1 = 550,000 VNĐ
```

#### Bước 4: Tạo Đơn Hàng
```java
// OrderServiceImpl.java
- Tính toán giá thuê theo thời gian
- Cộng tiền cọc vào tổng
- Tính ngày trả hàng dự kiến
- Lưu orderType = RENT, rentDuration
```

### 5. Quản Lý Trả Hàng

#### API Endpoint: POST /api/orders/{id}/return
```java
// Xác nhận khách đã trả hàng
- Cập nhật actualReturnDate = now()
- Đổi status = RETURNED
```

#### API Endpoint: POST /api/orders/{id}/refund-deposit
```java
// Hoàn trả tiền cọc
- Kiểm tra đã trả hàng chưa
- Đánh dấu depositRefunded = true
```

## Cấu Trúc Database

### Bảng `orders`
```sql
expected_return_date DATETIME    -- Ngày dự kiến trả hàng
actual_return_date   DATETIME    -- Ngày thực tế trả hàng
deposit_refunded     BOOLEAN     -- Đã hoàn cọc chưa
```

### Bảng `order_items`
```sql
order_type      ENUM('BUY', 'RENT')  -- Loại giao dịch
rent_duration   INT                   -- Số lượng đơn vị thuê
```

## Ví Dụ Sử Dụng

### Frontend: Thêm Sản Phẩm Thuê Vào Giỏ
```javascript
addToCart({
  productId: product.id,
  product: product,
  quantity: 1,
  orderType: 'RENT',
  rentDuration: 14,  // Thuê 14 ngày
  colorIndex: 0,
  sizeIndex: 0,
});
```

### Backend: Tạo Đơn Thuê
```java
CreateOrderRequest request = new CreateOrderRequest();
request.setBuyerId(userId);
request.setItems(List.of(
  new OrderItemRequest(
    productId,
    1,           // quantity
    null,        // variantId
    "RENT",      // orderType
    14           // rentDuration (14 ngày)
  )
));
```

### Tính Toán Giá
```java
// Sản phẩm: rentPrice = 50,000 VNĐ/ngày, deposit = 200,000 VNĐ
// Thuê 14 ngày
BigDecimal rentalPrice = 50000 × 14 = 700,000 VNĐ
BigDecimal deposit = 200,000 VNĐ
BigDecimal total = 700,000 + 200,000 = 900,000 VNĐ
```

## Cải Tiến So Với Phiên Bản Cũ

### Trước:
❌ Không chọn được thời gian thuê
❌ OrderType luôn là BUY
❌ Không theo dõi ngày trả hàng
❌ Không quản lý hoàn cọc
❌ Thiếu trạng thái thuê

### Sau:
✅ Chọn thời gian thuê linh hoạt
✅ OrderType chính xác (BUY/RENT)
✅ Theo dõi ngày trả dự kiến và thực tế
✅ Quản lý hoàn cọc đầy đủ
✅ Trạng thái RENTING, RETURNED, OVERDUE

## Lưu Ý Khi Triển Khai

1. **Migration Database**: Chạy file `V3__add_rental_fields.sql` để thêm các cột mới
2. **Kiểm tra Enum**: Đảm bảo database hỗ trợ các giá trị enum mới (RENTING, RETURNED, OVERDUE, YEAR)
3. **Frontend CSS**: Import file `ProductDetailPage.css` để hiển thị UI chọn loại giao dịch
4. **Testing**: Test kỹ flow thuê từ đầu đến cuối

## Tính Năng Có Thể Mở Rộng

- [ ] Tự động chuyển status sang OVERDUE khi quá hạn
- [ ] Tính phí phạt trả muộn
- [ ] Gia hạn thời gian thuê
- [ ] Thông báo nhắc trả hàng
- [ ] Đánh giá tình trạng sản phẩm khi trả
- [ ] Lịch sử thuê của sản phẩm
- [ ] Kiểm tra tồn kho theo ngày thuê
