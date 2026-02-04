import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { getUserProducts } from '../api/product';
import { getRevenueSummary, getSoldProducts } from '../api/revenue';
import { ShoppingBag, Calendar, TrendingUp, Package } from 'lucide-react';
import '../styles/ProductDashboardPage.css';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price ?? 0);
}

function countOrdersFromSoldProducts(soldProducts) {
  if (!Array.isArray(soldProducts)) return 0;
  const orderIds = new Set(soldProducts.map((p) => p.orderId).filter(Boolean));
  return orderIds.size;
}

/** Tạo dữ liệu doanh thu theo tháng (12 tháng gần nhất) từ soldProducts */
function buildRevenueByMonth(soldProducts) {
  const now = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      key,
      label: `T${d.getMonth() + 1}/${d.getFullYear()}`,
      revenue: 0,
      fullDate: d.getTime(),
    });
  }
  if (!Array.isArray(soldProducts) || soldProducts.length === 0) return months;
  const byMonth = new Map(months.map((m) => [m.key, 0]));
  for (const p of soldProducts) {
    const dateStr = p.soldDate;
    if (!dateStr) continue;
    const d = typeof dateStr === 'string' ? new Date(dateStr) : new Date(dateStr);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const amount = Number(p.totalAmount) || 0;
    byMonth.set(key, (byMonth.get(key) ?? 0) + amount);
  }
  return months.map((m) => ({ ...m, revenue: byMonth.get(m.key) ?? 0 }));
}

const ProductDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [soldProducts, setSoldProducts] = useState([]);

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
    if (userId == null) return;
    setLoading(true);
    Promise.all([
      getUserProducts(userId),
      getRevenueSummary(userId, null, null, null),
      getSoldProducts(userId, null, null, null),
    ])
      .then(([productsData, summaryData, soldData]) => {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setRevenueSummary(summaryData);
        setSoldProducts(Array.isArray(soldData) ? soldData : []);
      })
      .catch((err) => {
        console.error('Dashboard load error:', err);
        setProducts([]);
        setRevenueSummary(null);
        setSoldProducts([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const countSale = products.filter(
    (p) =>
      p.tradeType === 'BUY_ONLY' ||
      (p.tradeType === 'BOTH' && p.buyPrice != null && Number(p.buyPrice) > 0)
  ).length;
  const countRent = products.filter(
    (p) =>
      p.tradeType === 'RENT_ONLY' ||
      (p.tradeType === 'BOTH' && p.rentPrice != null && Number(p.rentPrice) > 0)
  ).length;
  const orderCount = countOrdersFromSoldProducts(soldProducts);
  const totalRevenue = revenueSummary?.totalRevenue ?? 0;
  const revenueByMonth = useMemo(() => buildRevenueByMonth(soldProducts), [soldProducts]);

  if (loading) {
    return <div className="product-dashboard-loading">Đang tải...</div>;
  }

  return (
      <div className="product-dashboard">
        <div className="product-dashboard-header">
          <h1>Dashboard</h1>
          <p className="product-dashboard-subtitle">Thống kê tổng quan</p>
        </div>
        <div className="product-dashboard-cards">
          <div className="product-dashboard-card">
            <div className="product-dashboard-card-icon sale">
              <ShoppingBag size={24} />
            </div>
            <div className="product-dashboard-card-body">
              <span className="product-dashboard-card-label">Sản phẩm đang bán</span>
              <span className="product-dashboard-card-value">{countSale}</span>
            </div>
          </div>
          <div className="product-dashboard-card">
            <div className="product-dashboard-card-icon rent">
              <Calendar size={24} />
            </div>
            <div className="product-dashboard-card-body">
              <span className="product-dashboard-card-label">Sản phẩm đang thuê</span>
              <span className="product-dashboard-card-value">{countRent}</span>
            </div>
          </div>
          <div className="product-dashboard-card">
            <div className="product-dashboard-card-icon revenue">
              <TrendingUp size={24} />
            </div>
            <div className="product-dashboard-card-body">
              <span className="product-dashboard-card-label">Doanh thu</span>
              <span className="product-dashboard-card-value">{formatPrice(totalRevenue)}</span>
            </div>
          </div>
          <div className="product-dashboard-card">
            <div className="product-dashboard-card-icon orders">
              <Package size={24} />
            </div>
            <div className="product-dashboard-card-body">
              <span className="product-dashboard-card-label">Số đơn hàng</span>
              <span className="product-dashboard-card-value">{orderCount}</span>
            </div>
          </div>
        </div>

        <div className="product-dashboard-chart-card">
          <h2 className="product-dashboard-chart-title">Doanh thu theo tháng</h2>
          <p className="product-dashboard-chart-subtitle">12 tháng gần nhất</p>
          <div className="product-dashboard-chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueByMonth} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}M` : v >= 1000 ? `${v / 1000}K` : v)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
                  formatter={(value) => [formatPrice(value), 'Doanh thu']}
                  labelFormatter={(label) => `Tháng: ${label}`}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {revenueByMonth.map((entry, index) => (
                    <Cell key={entry.key} fill={entry.revenue > 0 ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {revenueSummary?.totalProductsSold != null && (
          <div className="product-dashboard-extra">
            <span>Sản phẩm đã bán (tổng): </span>
            <strong>{revenueSummary.totalProductsSold}</strong>
          </div>
        )}
      </div>
  );
};

export default ProductDashboardPage;
