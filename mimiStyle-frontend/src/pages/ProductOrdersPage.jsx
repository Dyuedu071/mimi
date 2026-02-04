import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCheck, Truck, User, ChevronDown, ChevronUp } from 'lucide-react';
import { getSoldProducts } from '../api/revenue';
import { updateOrderStatus } from '../api/order';
import { API_BASE_URL } from '../api/config';
import '../styles/ProductOrdersPage.css';
import '../styles/RevenuePage.css';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/48x48/f0f0f0/666?text=SP';

function buildProductImageSrc(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) return null;
  const raw = imageUrl.trim();
  if (raw.startsWith('http')) return raw;
  const base = API_BASE_URL.replace(/\/$/, '');
  if (raw.startsWith('/')) return base.replace(/\/api\/?$/, '') + raw;
  return `${base}/products/images/${raw}`;
}

function groupSoldProductsByOrder(soldProducts) {
  const byOrder = new Map();
  for (const p of soldProducts) {
    const orderId = p.orderId;
    if (!byOrder.has(orderId)) {
      byOrder.set(orderId, {
        orderId,
        orderStatus: p.orderStatus || 'PENDING',
        soldDate: p.soldDate,
        items: [],
        orderTotal: 0,
        shippingName: p.shippingName ?? p.shipping_name ?? '',
        shippingPhone: p.shippingPhone ?? p.shipping_phone ?? '',
        shippingAddress: p.shippingAddress ?? p.shipping_address ?? '',
        note: p.note ?? '',
      });
    }
    const order = byOrder.get(orderId);
    const amount = Number(p.totalAmount) || 0;
    order.items.push({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      quantity: p.quantity ?? 0,
      totalAmount: amount,
    });
    order.orderTotal += amount;
  }
  return Array.from(byOrder.values()).sort((a, b) => {
    const dateA = a.soldDate ? new Date(a.soldDate).getTime() : 0;
    const dateB = b.soldDate ? new Date(b.soldDate).getTime() : 0;
    return dateB - dateA;
  });
}

const ProductOrdersPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soldProducts, setSoldProducts] = useState([]);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('user');
    if (!saved) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      setUser(JSON.parse(saved));
    } catch {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const userId = user?.id ?? user?.userId ?? null;

  useEffect(() => {
    let cancelled = false;
    if (userId == null) {
      setLoading(false);
      setSoldProducts([]);
      return;
    }
    setLoading(true);
    getSoldProducts(userId, null, null, null)
      .then((data) => {
        if (!cancelled) setSoldProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error loading orders:', err);
        if (!cancelled) setSoldProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  const orders = useMemo(() => groupSoldProductsByOrder(soldProducts), [soldProducts]);

  const handleConfirmOrder = async (orderId) => {
    if (!orderId) return;
    const ok = window.confirm('Xác nhận đơn hàng này sẽ chuyển trạng thái sang "Đang vận chuyển". Bạn có chắc muốn xác nhận?');
    if (!ok) return;
    try {
      setConfirmingOrderId(orderId);
      await updateOrderStatus(orderId, 'SHIPPING');
      setSoldProducts((prev) =>
        prev.map((p) =>
          p.orderId === orderId ? { ...p, orderStatus: 'SHIPPING' } : p
        )
      );
    } catch (err) {
      alert(err?.message || 'Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const handleConfirmDelivered = async (orderId) => {
    if (!orderId) return;
    const ok = window.confirm('Xác nhận đơn hàng đã giao thành công? Trạng thái sẽ chuyển sang "Giao hàng thành công".');
    if (!ok) return;
    try {
      setConfirmingOrderId(orderId);
      await updateOrderStatus(orderId, 'COMPLETED');
      setSoldProducts((prev) =>
        prev.map((p) =>
          p.orderId === orderId ? { ...p, orderStatus: 'COMPLETED' } : p
        )
      );
    } catch (err) {
      alert(err?.message || 'Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const formatPrice = (price) => {
    const n = Number(price);
    return new Intl.NumberFormat('vi-VN').format(Number.isNaN(n) ? 0 : n) + ' ₫';
  };

  const formatDate = (dateString) => {
    if (dateString == null || dateString === '') return '—';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusLabel = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'PENDING') return 'Chờ xử lý';
    if (s === 'CONFIRMED') return 'Đã xác nhận';
    if (s === 'SHIPPING') return 'Đang vận chuyển';
    if (s === 'COMPLETED') return 'Giao hàng thành công';
    if (s === 'CANCELLED') return 'Đã hủy';
    return status || '—';
  };

  if (loading) {
    return <div className="product-orders-loading">Đang tải...</div>;
  }

  return (
    <div className="product-orders-page">
      <div className="product-orders-header">
        <h1>Order</h1>
        <p className="product-orders-subtitle">Tất cả đơn hàng có sản phẩm của bạn</p>
      </div>
      <div className="revenue-orders-list">
        {orders.length > 0 ? (
          orders.map((order) => {
            const statusUpper = (order.orderStatus || '').toUpperCase();
            const isPending = statusUpper === 'PENDING';
            const isShipping = statusUpper === 'SHIPPING';
            return (
              <div key={order.orderId} className="revenue-order-card">
                <div className="revenue-order-header">
                  <span className="revenue-order-id">Đơn #{order.orderId}</span>
                  <span className="revenue-order-date">{formatDate(order.soldDate)}</span>
                  <span className={`revenue-order-status-badge status-${(order.orderStatus || '').toLowerCase()}`}>
                    {getStatusLabel(order.orderStatus)}
                  </span>
                  <button
                    type="button"
                    className="revenue-view-detail-btn"
                    onClick={() => setExpandedOrderId((id) => (id === order.orderId ? null : order.orderId))}
                    aria-expanded={expandedOrderId === order.orderId}
                  >
                    {expandedOrderId === order.orderId ? (
                      <>Thu gọn <ChevronUp size={16} /></>
                    ) : (
                      <>Xem chi tiết <ChevronDown size={16} /></>
                    )}
                  </button>
                </div>
                <div className="revenue-order-products">
                  <div className="revenue-order-table-header">
                    <div className="revenue-order-th img-col">Hình ảnh</div>
                    <div className="revenue-order-th name-col">Tên sản phẩm</div>
                    <div className="revenue-order-th qty-col">Số lượng</div>
                    <div className="revenue-order-th amount-col">Thành tiền</div>
                  </div>
                  {order.items.map((item, idx) => {
                    const imgSrc = buildProductImageSrc(item.imageUrl) || PLACEHOLDER_IMG;
                    return (
                      <div key={`${order.orderId}-${item.id}-${idx}`} className="revenue-order-row">
                        <div className="revenue-order-td img-col">
                          <img src={imgSrc} alt={item.name} className="revenue-product-thumb" onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }} />
                        </div>
                        <div className="revenue-order-td name-col">{item.name}</div>
                        <div className="revenue-order-td qty-col">{item.quantity}</div>
                        <div className="revenue-order-td amount-col">{formatPrice(item.totalAmount)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="revenue-order-footer">
                  <div className="revenue-order-total">
                    <span className="revenue-order-total-label">Tổng thu nhập đơn:</span>
                    <span className="revenue-order-total-value">{formatPrice(order.orderTotal)}</span>
                  </div>
                  <div className="revenue-order-action">
                    {isPending && (
                      <button
                        type="button"
                        className="revenue-confirm-order-btn"
                        onClick={() => handleConfirmOrder(order.orderId)}
                        disabled={confirmingOrderId === order.orderId}
                      >
                        <PackageCheck size={16} />
                        <span>Xác nhận đơn hàng</span>
                      </button>
                    )}
                    {isShipping && (
                      <button
                        type="button"
                        className="revenue-confirm-delivered-btn"
                        onClick={() => handleConfirmDelivered(order.orderId)}
                        disabled={confirmingOrderId === order.orderId}
                      >
                        <Truck size={16} />
                        <span>Xác nhận đơn hàng đã giao thành công</span>
                      </button>
                    )}
                    {!isPending && !isShipping && (
                      <span className="revenue-order-status-text">{getStatusLabel(order.orderStatus)}</span>
                    )}
                  </div>
                </div>
                {expandedOrderId === order.orderId && (
                  <div className="revenue-order-customer">
                    <h4 className="revenue-order-customer-title">
                      <User size={18} />
                      Thông tin khách hàng
                    </h4>
                    <dl className="revenue-order-customer-list">
                      <div className="revenue-order-customer-row">
                        <dt>Họ tên</dt>
                        <dd>{order.shippingName || '—'}</dd>
                      </div>
                      <div className="revenue-order-customer-row">
                        <dt>Số điện thoại</dt>
                        <dd>{order.shippingPhone || '—'}</dd>
                      </div>
                      <div className="revenue-order-customer-row">
                        <dt>Địa chỉ giao hàng</dt>
                        <dd>{order.shippingAddress || '—'}</dd>
                      </div>
                      {(order.note != null && order.note !== '') && (
                        <div className="revenue-order-customer-row">
                          <dt>Ghi chú</dt>
                          <dd>{order.note}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">Chưa có đơn hàng nào</div>
            <div className="empty-subtitle">
              Khi có đơn hàng chứa sản phẩm của bạn, chúng sẽ hiển thị ở đây.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductOrdersPage;
