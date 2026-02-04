import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList } from 'lucide-react';
import Layout from './Layout';
import '../../styles/ProductManagementLayout.css';

export default function ProductManagementLayout() {
  return (
    <Layout>
    <div className="product-management-layout">
      <aside className="product-management-sidebar">
        <nav className="product-management-sidebar-nav">
          <NavLink
            to="/products"
            end
            className={({ isActive }) =>
              `product-management-sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <LayoutDashboard className="sidebar-icon" size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/products/list"
            className={({ isActive }) =>
              `product-management-sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Package className="sidebar-icon" size={20} />
            <span>Quản lý sản phẩm</span>
          </NavLink>
          <NavLink
            to="/products/orders"
            className={({ isActive }) =>
              `product-management-sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <ClipboardList className="sidebar-icon" size={20} />
            <span>Order</span>
          </NavLink>
        </nav>
      </aside>
      <div className="product-management-outlet">
        <Outlet />
      </div>
    </div>
    </Layout>
  );
}
