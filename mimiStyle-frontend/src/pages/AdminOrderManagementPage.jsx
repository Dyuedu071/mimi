import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Trash2, ChevronDown, ChevronUp, User } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../api/order';
import { API_BASE_URL } from '../api/config';
import '../styles/AdminOrderManagementPage.css';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/48x48/f0f0f0/666?text=SP';

function buildProductImageSrc(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) return null;
  const raw = imageUrl.trim();
  if (raw.startsWith('http')) return raw;
  const base = API_BASE_URL.replace(/\/$/, '');
  if (raw.startsWith('/')) return base.replace(/\/api\/?$/, '') + raw;
  return `${base}/products/images/${raw}`;
}

const AdminOrderManagementPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('user');
    if (!saved) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      if ((parsed?.role ?? parsed?.roles?.[0]) !== 'ADMIN') {
        navigate('/home', { replace: true });
        return;
      }
    } catch {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!orderId) return;
    const ok = window.confirm('⚠️ Bạn có chắc muốn xóa đơn hàng này? Hành động này không thể hoàn tác.');
    if (!ok) return;
    try {
      setProcessingOrderId(orderId);
      await deleteOrder(orderId);
      await loadOrders();
      alert('✅ Đã xóa đơn hàng thành công');
    } catch (err) {
      alert(err?.message || 'Không thể xóa đơn hàng');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!orderId) return;
    try {
      setProcessingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      alert('✅ Đã cập nhật trạng thái đơn hàng');
    } catch (err) {
      alert(err?.message || 'Không thể cập nhật trạng thái');
    } finally {
      setProcessingOrderId(null);
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
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'PENDING') return 'Chờ xử lý';
    if (s === 'CONFIRMED') return 'Đã xác nhận';
    if (s === 'SHIPPING') return 'Đang vận chuyển';
    if (s === 'COMPLETED') return 'Hoàn thành';
    if (s === 'CANCELLED') return 'Đã hủy';
    if (s === 'RENTING') return 'Đang thuê';
    if (s === 'RETURNED') return 'Đã trả hàng';
    if (s === 'OVERDUE') return 'Quá hạn trả';
    return status || '—';
  };

  if (loading) {
    return (
      <Layout>
        <div className="admin-order-loading">Đang tải...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-order-page">
        <div className="admin-order-header">
          <h1>
            <Package size={28} />
            Quản lý đơn hàng
          </h1>
          <p className="admin-order-subtitle">Tất cả đơn hàng trong hệ thống ({orders.length} đơn)</p>
        </div>

        <div className="admin-order-list">
          {orders.length > 0 ? (
            orders.map((order) => {
              const statusUpper = (order.status || '').toUpperCase();
              const items = order.items || [];
              return (
                <div key={order.id} className="admin-order-card">
                  <div className="admin-order-card-header">
                    <span className="admin-order-id">Đơn #{order.id}</span>
                    <span className="admin-order-date">{formatDate(order.createdAt)}</span>
                    <span className={`admin-order-status-badge status-${(order.status || '').toLowerCase()}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="admin-order-total">{formatPrice(order.totalAmount)}</span>
                    <button
                      type="button"
                      className="admin-order-view-detail-btn"
                      onClick={() => setExpandedOrderId((id) => (id === order.id ? null : order.id))}
                      aria-expanded={expandedOrderId === order.id}
                    >
                      {expandedOrderId === order.id ? (
                        <>Thu gọn <ChevronUp size={16} /></>
                      ) : (
                        <>Chi tiết <ChevronDown size={16} /></>
                      )}
                    </button>
                    <button
                      type="button"
                      className="admin-order-delete-btn"
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={processingOrderId === order.id}
                      title="Xóa đơn hàng"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {expandedOrderId === order.id && (
                    <div className="admin-order-card-body">
                      <div className="admin-order-section">
                        <h3>Sản phẩm</h3>
                        <div className="admin-order-products">
                          {items.map((item, idx) => {
                            const imgSrc = buildProductImageSrc(item.imageUrl) || PLACEHOLDER_IMG;
                            return (
                              <div key={idx} className="admin-order-product-row">
                                <img
                                  src={imgSrc}
                                  alt={item.productName}
                                  className="admin-order-product-img"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = PLACEHOLDER_IMG;
                                  }}
                                />
                                <div className="admin-order-product-info">
                                  <div className="admin-order-product-name">{item.productName}</div>
                                  <div className="admin-order-product-meta">
                                    Số lượng: {item.quantity} · Đơn giá: {formatPrice(item.price)} · Thành tiền: {formatPrice(item.lineTotal)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="admin-order-section">
                        <h3>
                          <User size={18} />
                          Thông tin khách hàng
                        </h3>
                        <dl className="admin-order-customer-list">
                          <div className="admin-order-customer-row">
                            <dt>Họ tên:</dt>
                            <dd>{order.shippingName || '—'}</dd>
                          </div>
                          <div className="admin-order-customer-row">
                            <dt>Email:</dt>
                            <dd>{order.shippingEmail || '—'}</dd>
                          </div>
                          <div className="admin-order-customer-row">
                            <dt>Số điện thoại:</dt>
                            <dd>{order.shippingPhone || '—'}</dd>
                          </div>
                          <div className="admin-order-customer-row">
                            <dt>Địa chỉ:</dt>
                            <dd>{order.shippingAddress || '—'}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="admin-order-section admin-order-summary">
                        <div className="admin-order-summary-row">
                          <span>Tạm tính:</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.shippingFee > 0 && (
                          <div className="admin-order-summary-row">
                            <span>Phí vận chuyển:</span>
                            <span>{formatPrice(order.shippingFee)}</span>
                          </div>
                        )}
                        {order.discountAmount > 0 && (
                          <div className="admin-order-summary-row">
                            <span>Giảm giá:</span>
                            <span>-{formatPrice(order.discountAmount)}</span>
                          </div>
                        )}
                        <div className="admin-order-summary-row admin-order-total-row">
                          <span>Tổng cộng:</span>
                          <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>

                      <div className="admin-order-actions">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          disabled={processingOrderId === order.id}
                          className="admin-order-status-select"
                        >
                          <option value="PENDING">Chờ xử lý</option>
                          <option value="CONFIRMED">Đã xác nhận</option>
                          <option value="SHIPPING">Đang vận chuyển</option>
                          <option value="COMPLETED">Hoàn thành</option>
                          <option value="CANCELLED">Đã hủy</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="admin-order-empty">
              <div className="admin-order-empty-icon">📦</div>
              <div className="admin-order-empty-title">Chưa có đơn hàng nào</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrderManagementPage;
