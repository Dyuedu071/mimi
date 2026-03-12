import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getAllProducts } from '../api/product';
import { API_ORIGIN } from '../api/config';
import '../styles/AllProductsPage.css';

export default function AllProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const removeVietnameseTones = (str) => {
    if (!str) return '';
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
  };

  const categories = [...new Set(products.map(p => p.categoryName || p.category?.name).filter(Boolean))];

  const getProductPrice = (product) => {
    if (product.buyPrice) return product.buyPrice;
    if (product.rentPrice) return product.rentPrice + (product.deposit || 0);
    return 0;
  };

  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery.trim()) {
      const searchLower = removeVietnameseTones(searchQuery.trim());
      const nameMatch = product.name && removeVietnameseTones(product.name).includes(searchLower);
      const descMatch = product.description && removeVietnameseTones(product.description).includes(searchLower);
      const categoryMatch = (product.categoryName || product.category?.name) && 
        removeVietnameseTones(product.categoryName || product.category?.name || '').includes(searchLower);
      
      if (!nameMatch && !descMatch && !categoryMatch) return false;
    }

    // Type filter
    const isSale = product.tradeType === 'BUY_ONLY' || product.tradeType === 'BOTH';
    const isRent = product.tradeType === 'RENT_ONLY' || product.tradeType === 'BOTH';
    if (filterType === 'sale' && !isSale) return false;
    if (filterType === 'rent' && !isRent) return false;

    // Category filter
    const productCategory = product.categoryName || product.category?.name;
    if (selectedCategory !== 'all' && productCategory !== selectedCategory) return false;

    // Price range filter
    const price = getProductPrice(product);
    if (priceRange.min && price < Number(priceRange.min)) return false;
    if (priceRange.max && price > Number(priceRange.max)) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'oldest':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'price-asc':
        return getProductPrice(a) - getProductPrice(b);
      case 'price-desc':
        return getProductPrice(b) - getProductPrice(a);
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '');
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getProductImageSrc = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      const imageUrl = product.images[0];
      if (typeof imageUrl === 'string' && !imageUrl.includes('src/assets')) {
        return `${API_ORIGIN}/api/products/images/${imageUrl}`;
      }
      if (imageUrl?.imageUrl && !imageUrl.imageUrl.includes('src/assets')) {
        return `${API_ORIGIN}/api/products/images/${imageUrl.imageUrl}`;
      }
    }
    return 'https://via.placeholder.com/300x300/f0f0f0/666?text=Product';
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="all-products-page">
        {/* Header */}
        <div className="all-products-header">
          <h1>Tất cả sản phẩm</h1>
          <p>Khám phá {products.length} sản phẩm chất lượng cho bé yêu</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="products-toolbar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} />
            Bộ lọc
          </button>

          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Loại sản phẩm</label>
              <div className="filter-buttons">
                <button 
                  className={filterType === 'all' ? 'active' : ''}
                  onClick={() => setFilterType('all')}
                >
                  Tất cả
                </button>
                <button 
                  className={filterType === 'sale' ? 'active' : ''}
                  onClick={() => setFilterType('sale')}
                >
                  Bán
                </button>
                <button 
                  className={filterType === 'rent' ? 'active' : ''}
                  onClick={() => setFilterType('rent')}
                >
                  Thuê
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>Danh mục</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Khoảng giá</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Từ"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className="results-info">
          Hiển thị {paginatedProducts.length} / {sortedProducts.length} sản phẩm
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-state">Đang tải sản phẩm...</div>
        ) : sortedProducts.length === 0 ? (
          <div className="empty-state">
            <p>Không tìm thấy sản phẩm phù hợp</p>
            <button onClick={clearFilters}>Xóa bộ lọc</button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {paginatedProducts.map(product => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-image">
                    <img src={getProductImageSrc(product)} alt={product.name} />
                    {product.status === 'SOLD_OUT' && (
                      <div className="sold-out-badge">Hết hàng</div>
                    )}
                  </div>
                  <div className="product-content">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">
                      {product.buyPrice ? (
                        <span className="price-main">{formatPrice(product.buyPrice)}</span>
                      ) : (
                        <div className="price-rent">
                          <span>{formatPrice(product.rentPrice || 0)}</span>
                          <span className="rent-unit">
                            /{product.rentUnit === 'MONTH' ? 'tháng' : product.rentUnit === 'WEEK' ? 'tuần' : 'ngày'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="product-tags">
                      {(product.tradeType === 'BUY_ONLY' || product.tradeType === 'BOTH') && (
                        <span className="tag-sale">Bán</span>
                      )}
                      {(product.tradeType === 'RENT_ONLY' || product.tradeType === 'BOTH') && (
                        <span className="tag-rent">Thuê</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
                
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={currentPage === i + 1 ? 'active' : ''}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
