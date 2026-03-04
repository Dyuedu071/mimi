import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Eye, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getUsersPaginated, getSystemStats } from '../api/user';
import { API_ORIGIN } from '../api/config';
import '../styles/UserManagementPage.css';

function getRoleLabel(role) {
  if (role === 'ADMIN') return 'Admin';
  if (role === 'USER') return 'User';
  return role || '—';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('vi-VN');
}

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

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
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    Promise.all([
      getUsersPaginated(currentPage, pageSize, sortBy, sortDir),
      getSystemStats().catch(() => null)
    ])
      .then(([paginatedData, statsData]) => {
        setUsers(Array.isArray(paginatedData.users) ? paginatedData.users : []);
        setTotalPages(paginatedData.totalPages || 0);
        setTotalItems(paginatedData.totalItems || 0);
        setStats(statsData);
      })
      .catch((err) => {
        setError(err?.message || 'Không thể tải danh sách user');
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [user, currentPage, pageSize, sortBy, sortDir]);

  if (!user) return null;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num || 0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  return (
    <Layout>
      <div className="user-management-page">
        <div className="user-management-header">
          <h1>Quản lý người dùng</h1>
          <p className="user-management-subtitle">Tổng quan hệ thống và danh sách người dùng</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>
                <Users size={24} color="#2563eb" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Tổng người dùng</div>
                <div className="stat-value">{formatNumber(stats.totalUsers || users.length)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>
                <Eye size={24} color="#f59e0b" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Lượt truy cập</div>
                <div className="stat-value">{formatNumber(stats.totalPageViews || 0)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fce7f3' }}>
                <TrendingUp size={24} color="#be185d" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Người dùng hoạt động</div>
                <div className="stat-value">{formatNumber(stats.activeUsers || 0)}</div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="user-management-loading">Đang tải...</div>
        ) : error ? (
          <div className="user-management-error">{error}</div>
        ) : (
          <div className="user-management-table-wrap">
            <div className="table-header">
              <h2>Danh sách người dùng ({totalItems})</h2>
              <div className="table-controls">
                <label>
                  Hiển thị:
                  <select value={pageSize} onChange={handlePageSizeChange} className="page-size-select">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>
            </div>
            <table className="user-management-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable">
                    ID {sortBy === 'id' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Avatar</th>
                  <th onClick={() => handleSort('username')} className="sortable">
                    Username {sortBy === 'username' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')} className="sortable">
                    Email {sortBy === 'email' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('fullName')} className="sortable">
                    Họ tên {sortBy === 'fullName' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Số điện thoại</th>
                  <th onClick={() => handleSort('role')} className="sortable">
                    Vai trò {sortBy === 'role' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('pageViews')} className="sortable">
                    Lượt truy cập {sortBy === 'pageViews' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="col-id">{u.id}</td>
                    <td className="col-avatar">
                      {u.avatarUrl ? (
                        <img
                          src={`${API_ORIGIN}/uploads/avatars/${u.avatarUrl}`}
                          alt=""
                          className="user-avatar-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling?.classList?.add('visible');
                          }}
                        />
                      ) : null}
                      <span className="user-avatar-initial" style={{ display: u.avatarUrl ? 'none' : 'flex' }}>
                        {(u.fullName || u.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </td>
                    <td>{u.username || '—'}</td>
                    <td>{u.email || '—'}</td>
                    <td>{u.fullName || '—'}</td>
                    <td>{u.phoneNumber || '—'}</td>
                    <td>
                      <span className={`user-role-badge role-${(u.role || '').toLowerCase()}`}>
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td className="col-views">
                      <span className="view-count">{formatNumber(u.pageViews || 0)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="user-management-empty">Chưa có người dùng nào.</div>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 0}
                  className="pagination-btn"
                >
                  <ChevronLeft size={18} />
                  Trước
                </button>
                
                <div className="pagination-info">
                  <span>Trang {currentPage + 1} / {totalPages}</span>
                  <span className="pagination-items">
                    ({currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalItems)} / {totalItems})
                  </span>
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage >= totalPages - 1}
                  className="pagination-btn"
                >
                  Sau
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagementPage;
