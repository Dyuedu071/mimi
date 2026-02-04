import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { getAllUsers } from '../api/user';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    getAllUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => {
        setError(err?.message || 'Không thể tải danh sách user');
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <Layout>
      <div className="user-management-page">
        <div className="user-management-header">
          <h1>Quản lý user</h1>
          <p className="user-management-subtitle">Tất cả user đang sử dụng hệ thống</p>
        </div>

        {loading ? (
          <div className="user-management-loading">Đang tải...</div>
        ) : error ? (
          <div className="user-management-error">{error}</div>
        ) : (
          <div className="user-management-table-wrap">
            <table className="user-management-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Avatar</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Họ tên</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="user-management-empty">Chưa có user nào.</div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagementPage;
