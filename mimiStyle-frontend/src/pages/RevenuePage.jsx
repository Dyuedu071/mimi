import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCheck, Truck, User, ChevronDown, ChevronUp, Calendar, BarChart3, Trash2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import RevenueChart from '../components/RevenueChart';
import { getRevenueSummary, getSoldProducts, getDailyRevenue, getWeeklyRevenue } from '../api/revenue';
import { updateOrderStatus, deleteOrder } from '../api/order';
import { API_BASE_URL } from '../api/config';
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

const RevenuePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [soldProducts, setSoldProducts] = useState([]);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Chart states
  const [chartType, setChartType] = useState('daily'); // 'daily' or 'weekly'
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(true);
  
  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  const loadData = async () => {
    if (userId == null) {
      setLoading(false);
      setRevenueSummary({ totalRevenue: 0, totalProductsSold: 0, period: '' });
      setSoldProducts([]);
      setChartData([]);
      return;
    }
    
    setLoading(true);
    try {
      const start = startDate || null;
      const end = endDate || null;
      
      const [summaryData, productsData, chartDataResult] = await Promise.all([
        getRevenueSummary(userId, start, end, null),
        getSoldProducts(userId, start, end, null),
        chartType === 'daily' 
          ? getDailyRevenue(userId, start, end)
          : getWeeklyRevenue(userId, start, end)
      ]);
      
      setRevenueSummary(summaryData);
      setSoldProducts(Array.isArray(productsData) ? productsData : []);
      setChartData(Array.isArray(chartDataResult) ? chartDataResult : []);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      setRevenueSummary({ totalRevenue: 0, totalProductsSold: 0, period: '' });
      setSoldProducts([]);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId, startDate, endDate, chartType]);

  const ordersBySeller = useMemo(() => groupSoldProductsByOrder(soldProducts), [soldProducts]);

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

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
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

  const handleDeleteOrder = async (orderId) => {
    if (!orderId) return;
    const ok = window.confirm('⚠️ Bạn có chắc muốn xóa đơn hàng này? Hành động này không thể hoàn tác.');
    if (!ok) return;
    try {
      setConfirmingOrderId(orderId);
      await deleteOrder(orderId);
      await loadData();
      alert('✅ Đã xóa đơn hàng thành công');
    } catch (err) {
      alert(err?.message || 'Không thể xóa đơn hàng');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const summary = revenueSummary ?? { totalRevenue: 0, totalProductsSold: 0, period: '' };

  const content = loading ? (
    <div className="revenue-loading">Đang tải...</div>
  ) : (
    <>
      <main className="main-content">
        <div className="revenue-container">
          <div className="left-panel">
            <div className="summary-section">
              <h3 className="summary-title">Tổng quan doanh thu</h3>
              <div className="summary-card">
                <div className="summary-item">
                  <div className="summary-label">Tổng doanh thu:</div>
                  <div className="summary-value revenue-value">{formatPrice(summary.totalRevenue ?? 0)}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Số đơn hàng:</div>
                  <div className="summary-value products-value">{ordersBySeller.length} đơn</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Số lượng đã bán:</div>
                  <div className="summary-value products-value">{summary.totalProductsSold ?? 0} sản phẩm</div>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
              <button 
                className="filters-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Calendar size={16} />
                <span>Lọc theo thời gian</span>
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showFilters && (
                <div className="filters-content">
                  <div className="quick-filters">
                    <button onClick={() => handleQuickFilter(7)}>7 ngày</button>
                    <button onClick={() => handleQuickFilter(30)}>30 ngày</button>
                    <button onClick={() => handleQuickFilter(90)}>90 ngày</button>
                  </div>
                  
                  <div className="date-filters">
                    <div className="date-input-group">
                      <label>Từ ngày:</label>
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label>Đến ngày:</label>
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {(startDate || endDate) && (
                    <button className="clear-filters-btn" onClick={handleClearFilters}>
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Chart Section */}
            <div className="chart-section">
              <div className="chart-header">
                <button 
                  className="chart-toggle-btn"
                  onClick={() => setShowChart(!showChart)}
                >
                  <BarChart3 size={16} />
                  <span>Biểu đồ doanh thu</span>
                  {showChart ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {showChart && (
                  <div className="chart-type-selector">
                    <button 
                      className={chartType === 'daily' ? 'active' : ''}
                      onClick={() => setChartType('daily')}
                    >
                      Theo ngày
                    </button>
                    <button 
                      className={chartType === 'weekly' ? 'active' : ''}
                      onClick={() => setChartType('weekly')}
                    >
                      Theo tuần
                    </button>
                  </div>
                )}
              </div>
              
              {showChart && (
                <RevenueChart data={chartData} type={chartType} />
              )}
            </div>
          </div>

          <div className="right-panel">
            <div className="products-section">
              <div className="products-header">
                <h2 className="section-title">Đơn hàng của tôi</h2>
                <p className="section-subtitle">
                  Các đơn hàng có sản phẩm của bạn, theo từng đơn với danh sách sản phẩm và tổng thu nhập.
                </p>
              </div>

              <div className="revenue-orders-list">
                {ordersBySeller.length > 0 ? (
                  ordersBySeller.map((order) => {
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
                          <button
                            type="button"
                            className="revenue-delete-order-btn"
                            onClick={() => handleDeleteOrder(order.orderId)}
                            disabled={confirmingOrderId === order.orderId}
                            title="Xóa đơn hàng"
                          >
                            <Trash2 size={16} />
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
                      Khi có đơn hàng chứa sản phẩm của bạn, chúng sẽ hiển thị ở đây theo từng đơn.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <nav className="bottom-nav">
        <a href="/revenue" className="nav-item active">
          <span className="nav-icon">💰</span>
          <span className="nav-text">Doanh thu</span>
        </a>
        <a href="/products" className="nav-item">
          <span className="nav-icon">🛒</span>
          <span className="nav-text">Đang bán</span>
        </a>
        <a href="/add" className="nav-item">
          <span className="nav-icon">➕</span>
          <span className="nav-text">Thêm mới</span>
        </a>
      </nav>
    </>
  );

  return (
    <Layout>
      <div className="revenue-page">
        {content}
      </div>
    </Layout>
  );
};

export default RevenuePage;
