import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getUserProducts, deleteProduct, updateProduct, uploadProductImages, saveProductImageNames, deleteProductImage } from '../api/product';
import { API_ORIGIN } from '../api/config';
import { API_BASE_URL } from '../api/config';
import sterilizerImg from '../assets/img-product/may-tiet-trung-binh-sua-co-say-kho-bang-tia-uv-spectra-1.jpg';
import pumpImg from '../assets/img-product/May-hut-sua-dien-doi-Resonance-3-Fb1160VN-3.jpeg';
import cribImg from '../assets/img-product/top-5-thuong-hieu-noi-cho-be-duoc-ua-chuong-nhat-hien-nay-2020-1595675197.png';
import strollerImg from '../assets/img-product/xe-day-tre-em-joie-versatrax-lagoon.jpg';
import chairImg from '../assets/img-product/ghe-an-dam-umoo-1606186868.jpg';
import toyImg from '../assets/img-product/z6021933351086_28eb8d7e91cc13e47c6e338d1bea00f3.jpg';
import '../styles/ProductManagementPage.css';

const ProductManagementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInsideProductsLayout = location.pathname.startsWith('/products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    specifications: '',
    tradeType: 'BUY_ONLY',
    condition: 'NEW',
    price: '',
    rentPrice: '',
    deposit: '',
    rentUnit: 'MONTH',
    address: '',
    status: 'ACTIVE',
    images: [],
    imageFilenames: []
  });
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editSubmitError, setEditSubmitError] = useState('');
  const [editSuccessMessage, setEditSuccessMessage] = useState('');
  const [user, setUser] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'sale' | 'rent'

  const userId = user?.id ?? user?.userId ?? null;

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

  useEffect(() => {
    if (userId == null) return;
    loadProducts();
  }, [userId]);

  const loadProducts = async () => {
    if (userId == null) return;
    try {
      setLoading(true);
      const data = await getUserProducts(userId);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Không thể xóa sản phẩm');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      specifications: product.specifications || '',
      tradeType: product.tradeType || 'BUY_ONLY',
      condition: getConditionFromPercentage(product.conditionPercentage),
      price: product.buyPrice ? product.buyPrice.toString() : '',
      rentPrice: product.rentPrice ? product.rentPrice.toString() : '',
      deposit: product.deposit ? product.deposit.toString() : '',
      rentUnit: product.rentUnit || 'MONTH',
      address: product.addressContact || '',
      status: product.status || 'ACTIVE',
      images: [],
      imageFilenames: [],
      existingImages: product.images || []
    });
    setIsEditing(true);
    setEditErrors({});
    setEditSubmitError('');
    setEditSuccessMessage('');
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setEditFormData({
      name: '',
      description: '',
      specifications: '',
      tradeType: 'BUY_ONLY',
      condition: 'NEW',
      price: '',
      rentPrice: '',
      deposit: '',
      rentUnit: 'MONTH',
      address: '',
      status: 'ACTIVE',
      images: [],
      imageFilenames: [],
      existingImages: []
    });
    setEditErrors({});
    setEditSubmitError('');
    setEditSuccessMessage('');
  };

  const getConditionFromPercentage = (percentage) => {
    if (percentage === 100) return 'NEW';
    if (percentage >= 90) return 'LIKE_NEW';
    return 'USED';
  };

  const getConditionPercentage = (condition) => {
    switch (condition) {
      case 'NEW': return 100;
      case 'LIKE_NEW': return 90;
      case 'USED': return 70;
      default: return 100;
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditTradeTypeChange = (type) => {
    setEditFormData(prev => ({
      ...prev,
      tradeType: type
    }));
  };

  const handleEditConditionChange = (condition) => {
    setEditFormData(prev => ({
      ...prev,
      condition: condition
    }));
  };

  const handleEditImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    try {
      // Upload ảnh lên server và lưu vào thư mục frontend
      const uploadedFilenames = await uploadProductImages(files);

      setEditFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files],
        imageFilenames: [...(prev.imageFilenames || []), ...uploadedFilenames]
      }));

      console.log('Đã upload thành công:', uploadedFilenames);
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      setEditSubmitError('Lỗi khi upload ảnh: ' + error.message);
    }
  };

  const removeEditImage = (indexToRemove) => {
    setEditFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
      imageFilenames: prev.imageFilenames?.filter((_, index) => index !== indexToRemove) || []
    }));
  };

  const removeExistingImage = async (imageToRemove) => {
    // Xác nhận trước khi xóa
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này? Hành động này không thể hoàn tác.')) {
      return;
    }

    try {
      // Xóa ảnh khỏi server và database
      await deleteProductImage(editingProduct.id, imageToRemove);

      // Cập nhật state để remove ảnh khỏi UI
      setEditFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages?.filter(img =>
          (typeof img === 'string' ? img : img.imageUrl) !== imageToRemove
        ) || []
      }));

      console.log('Đã xóa ảnh thành công:', imageToRemove);
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
      setEditSubmitError('Lỗi khi xóa ảnh: ' + error.message);
    }
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }

    if (!editFormData.description.trim()) {
      newErrors.description = 'Mô tả sản phẩm là bắt buộc';
    }

    if (!editFormData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (editFormData.tradeType === 'BUY_ONLY' || editFormData.tradeType === 'BOTH') {
      if (!editFormData.price || parseFloat(editFormData.price) <= 0) {
        newErrors.price = 'Giá bán phải lớn hơn 0';
      }
    }

    if (editFormData.tradeType === 'RENT_ONLY' || editFormData.tradeType === 'BOTH') {
      if (!editFormData.rentPrice || parseFloat(editFormData.rentPrice) <= 0) {
        newErrors.rentPrice = 'Giá thuê phải lớn hơn 0';
      }
      if (!editFormData.deposit || parseFloat(editFormData.deposit) <= 0) {
        newErrors.deposit = 'Tiền cọc phải lớn hơn 0';
      }
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitError('');
    setEditSuccessMessage('');

    if (!validateEditForm()) {
      setEditSubmitError('Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    setEditLoading(true);

    try {
      const productData = {
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        specifications: editFormData.specifications.trim() || null,
        buyPrice: editFormData.tradeType === 'RENT_ONLY' ? null : parseFloat(editFormData.price) || null,
        rentPrice: editFormData.tradeType === 'BUY_ONLY' ? null : parseFloat(editFormData.rentPrice) || null,
        deposit: editFormData.tradeType === 'BUY_ONLY' ? null : parseFloat(editFormData.deposit) || null,
        rentUnit: editFormData.tradeType === 'BUY_ONLY' ? null : editFormData.rentUnit,
        tradeType: editFormData.tradeType,
        conditionPercentage: getConditionPercentage(editFormData.condition),
        addressContact: editFormData.address.trim(),
        status: editFormData.status
      };

      await updateProduct(editingProduct.id, productData);

      // Lưu ảnh mới nếu có
      if (editFormData.imageFilenames && editFormData.imageFilenames.length > 0) {
        try {
          await saveProductImageNames(editingProduct.id, editFormData.imageFilenames);
        } catch (imageError) {
          console.error('Error saving image filenames:', imageError);
          setEditSubmitError('Sản phẩm đã được cập nhật nhưng có lỗi khi lưu ảnh: ' + imageError.message);
          setEditLoading(false);
          return;
        }
      }

      setEditSuccessMessage('Sản phẩm đã được cập nhật thành công!');

      // Reload products after 1 second
      setTimeout(() => {
        loadProducts();
        handleCloseEdit();
      }, 1000);
    } catch (error) {
      console.error('Error updating product:', error);
      setEditSubmitError(error.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setEditLoading(false);
    }
  };

  const imageMap = {
    'Máy tiệt trùng bình sữa UV': sterilizerImg,
    'Máy hút sữa điện tử thông minh': pumpImg,
    'Nôi em bé thông minh': cribImg,
    'Xe đẩy em bé cao cấp': strollerImg,
    'Ghế ăn dặm cho bé': chairImg,
    'Bộ đồ chơi giáo dục': toyImg,
  };

  const getProductImageSrc = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const imageUrl = product.images[0];

      // Nếu backend trả về filename string
      if (typeof imageUrl === 'string' && !imageUrl.includes('src/assets')) {
        return `${API_BASE_URL}/products/images/${imageUrl}`;
      }

      // Nếu backend trả object { imageUrl: "abc.jpg" }
      if (imageUrl?.imageUrl && !imageUrl.imageUrl.includes('src/assets')) {
        return `${API_BASE_URL}/products/images/${imageUrl.imageUrl}`;
      }
    }

    // fallback local asset mapping
    if (imageMap[product.name]) return imageMap[product.name];
    return '/api/placeholder/300/200';
  };


  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'ACTIVE': { text: 'Đang bán', class: 'status-available' },
      'HIDDEN': { text: 'Ẩn', class: 'status-hidden' },
      'SOLD_OUT': { text: 'Hết hàng', class: 'status-sold' }
    };
    const statusInfo = statusMap[status] || { text: 'Không xác định', class: 'status-unknown' };
    return <span className={`product-status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getRentUnitText = (unit) => {
    const unitMap = {
      'DAY': 'ngày',
      'WEEK': 'tuần',
      'MONTH': 'tháng',
      'YEAR': 'năm'
    };
    return unitMap[unit] || 'tháng';
  };

  if (!user) return null;

  const filteredProducts = (() => {
    if (filterType === 'all') return products;
    if (filterType === 'sale') {
      return products.filter(
        (p) =>
          p.tradeType === 'BUY_ONLY' ||
          (p.tradeType === 'BOTH' && p.buyPrice != null && Number(p.buyPrice) > 0)
      );
    }
    if (filterType === 'rent') {
      return products.filter(
        (p) =>
          p.tradeType === 'RENT_ONLY' ||
          (p.tradeType === 'BOTH' && p.rentPrice != null && Number(p.rentPrice) > 0)
      );
    }
    return products;
  })();

  const content = loading ? (
    <div className="loading">Đang tải...</div>
  ) : (
    <>
      <main className="main-content">
        <div className="page-header page-header-with-action">
          <div>
            <h1>Quản lý sản phẩm</h1>
            <p className="subtitle">Sản phẩm đang bán/cho thuê</p>
          </div>
          <button
            type="button"
            className="btn-add-new-product"
            onClick={() => navigate('/products/add')}
          >
            <Plus size={18} />
            <span>Thêm mới</span>
          </button>
        </div>

        <div className="product-management-filters" style={{ marginLeft: isInsideProductsLayout ? 0 : '78px' }}>
          <button
            type="button"
            className={`product-management-filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={`product-management-filter-btn ${filterType === 'sale' ? 'active' : ''}`}
            onClick={() => setFilterType('sale')}
          >
            Sản phẩm bán
          </button>
          <button
            type="button"
            className={`product-management-filter-btn ${filterType === 'rent' ? 'active' : ''}`}
            onClick={() => setFilterType('rent')}
          >
            Sản phẩm cho thuê
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-card-inner">
                <div className="product-thumb">
                  <img src={getProductImageSrc(product)} alt={product.name} />
                </div>

                <div className="product-info">
                  <div className="product-meta-row">
                    {getStatusBadge(product.status)}
                  </div>

                  <h3 className="product-name">{product.name}</h3>

                  <div className="product-price">
                    {product.tradeType === 'BUY_ONLY' && product.buyPrice && (
                      <span className="sell-price">{formatPrice(product.buyPrice)}</span>
                    )}
                    {product.tradeType === 'RENT_ONLY' && product.rentPrice && (
                      <span className="rent-price">
                        {formatPrice(product.rentPrice)}/{getRentUnitText(product.rentUnit)}
                      </span>
                    )}
                    {product.tradeType === 'BOTH' && (
                      <>
                        {product.buyPrice && <span className="sell-price">{formatPrice(product.buyPrice)}</span>}
                        {product.rentPrice && (
                          <span className="rent-price">
                            {formatPrice(product.rentPrice)}/{getRentUnitText(product.rentUnit)}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="product-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      ✏️ Chỉnh sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {!isInsideProductsLayout && (
        <nav className="bottom-nav">
          <a href="/revenue" className="nav-item">
            <span className="nav-icon">💰</span>
            <span className="nav-text">Doanh thu</span>
          </a>
          <a href="/products" className="nav-item active">
            <span className="nav-icon">🛒</span>
            <span className="nav-text">Đang bán</span>
          </a>
          <a href="/add" className="nav-item">
            <span className="nav-icon">➕</span>
            <span className="nav-text">Thêm mới</span>
          </a>
        </nav>
      )}

      {/* Edit Product Modal */}
      {isEditing && (
        <div className="edit-modal-overlay" onClick={handleCloseEdit}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Chỉnh sửa sản phẩm</h2>
              <button className="close-button" onClick={handleCloseEdit}>×</button>
            </div>

            <form onSubmit={handleEditSubmit} className="edit-product-form">
              {editSubmitError && (
                <div className="error-banner">
                  <span className="error-icon">⚠️</span>
                  <span className="error-text">{editSubmitError}</span>
                </div>
              )}

              {editSuccessMessage && (
                <div className="success-banner">
                  <span className="success-icon">✅</span>
                  <span className="success-text">{editSuccessMessage}</span>
                </div>
              )}

              {/* Thông tin cơ bản */}
              <section className="form-section">
                <h3 className="section-title">Thông tin cơ bản sản phẩm</h3>

                <div className="form-group">
                  <label className="form-label">
                    <span className="required">*</span> Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className={`form-input ${editErrors.name ? 'error' : ''}`}
                    required
                  />
                  {editErrors.name && <div className="field-error">{editErrors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Loại hình</label>
                  <div className="radio-group">
                    <button
                      type="button"
                      className={`radio-option ${editFormData.tradeType === 'BUY_ONLY' ? 'active' : ''}`}
                      onClick={() => handleEditTradeTypeChange('BUY_ONLY')}
                    >
                      <span className="radio-icon">💰</span>
                      <div>
                        <div className="radio-title">Bán</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`radio-option ${editFormData.tradeType === 'RENT_ONLY' ? 'active' : ''}`}
                      onClick={() => handleEditTradeTypeChange('RENT_ONLY')}
                    >
                      <span className="radio-icon">🔄</span>
                      <div>
                        <div className="radio-title">Cho thuê</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`radio-option ${editFormData.tradeType === 'BOTH' ? 'active' : ''}`}
                      onClick={() => handleEditTradeTypeChange('BOTH')}
                    >
                      <span className="radio-icon">💎</span>
                      <div>
                        <div className="radio-title">Cả hai</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Điều kiện</label>
                  <div className="condition-group">
                    <button
                      type="button"
                      className={`condition-option ${editFormData.condition === 'NEW' ? 'active' : ''}`}
                      onClick={() => handleEditConditionChange('NEW')}
                    >
                      <span className="condition-icon">✨</span>
                      <div>
                        <div className="condition-title">Mới</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`condition-option ${editFormData.condition === 'LIKE_NEW' ? 'active' : ''}`}
                      onClick={() => handleEditConditionChange('LIKE_NEW')}
                    >
                      <span className="condition-icon">🌟</span>
                      <div>
                        <div className="condition-title">Như mới</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`condition-option ${editFormData.condition === 'USED' ? 'active' : ''}`}
                      onClick={() => handleEditConditionChange('USED')}
                    >
                      <span className="condition-icon">🔧</span>
                      <div>
                        <div className="condition-title">Đã sử dụng</div>
                      </div>
                    </button>
                  </div>
                </div>
              </section>

              {/* Chi tiết sản phẩm */}
              <section className="form-section">
                <h3 className="section-title">Chi tiết sản phẩm</h3>

                <div className="form-group">
                  <label className="form-label">
                    <span className="required">*</span> Mô tả sản phẩm
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    className={`form-textarea ${editErrors.description ? 'error' : ''}`}
                    rows={4}
                    required
                  />
                  {editErrors.description && <div className="field-error">{editErrors.description}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Thông số kỹ thuật
                  </label>
                  <textarea
                    name="specifications"
                    value={editFormData.specifications}
                    onChange={handleEditInputChange}
                    className="form-textarea"
                    rows={6}
                    placeholder="Ví dụ:&#10;• Kích thước: D89 x R46.5 x C99.5 (cm)&#10;• Trọng lượng: 6.2 kg&#10;• Chất liệu: Nhôm cao cấp"
                  />
                </div>

                <div className="price-group">
                  {(editFormData.tradeType === 'BUY_ONLY' || editFormData.tradeType === 'BOTH') && (
                    <div className="form-group">
                      <label className="form-label">
                        <span className="required">*</span> Giá bán (VNĐ)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditInputChange}
                        className={`form-input ${editErrors.price ? 'error' : ''}`}
                        min="0"
                      />
                      {editErrors.price && <div className="field-error">{editErrors.price}</div>}
                    </div>
                  )}

                  {(editFormData.tradeType === 'RENT_ONLY' || editFormData.tradeType === 'BOTH') && (
                    <div className="rent-price-group">
                      <div className="form-group">
                        <label className="form-label">
                          <span className="required">*</span> Giá thuê (VNĐ)
                        </label>
                        <input
                          type="number"
                          name="rentPrice"
                          value={editFormData.rentPrice}
                          onChange={handleEditInputChange}
                          className={`form-input ${editErrors.rentPrice ? 'error' : ''}`}
                          min="0"
                        />
                        {editErrors.rentPrice && <div className="field-error">{editErrors.rentPrice}</div>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          <span className="required">*</span> Tiền cọc (VNĐ)
                        </label>
                        <input
                          type="number"
                          name="deposit"
                          value={editFormData.deposit}
                          onChange={handleEditInputChange}
                          className={`form-input ${editErrors.deposit ? 'error' : ''}`}
                          min="0"
                        />
                        {editErrors.deposit && <div className="field-error">{editErrors.deposit}</div>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Đơn vị thời gian</label>
                        <select
                          name="rentUnit"
                          value={editFormData.rentUnit}
                          onChange={handleEditInputChange}
                          className="form-select"
                        >
                          <option value="DAY">Ngày</option>
                          <option value="WEEK">Tuần</option>
                          <option value="MONTH">Tháng</option>
                          <option value="YEAR">Năm</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Hình ảnh sản phẩm */}
              <section className="form-section">
                <h3 className="section-title">Hình ảnh sản phẩm</h3>

                {/* Ảnh hiện tại */}
                {editFormData.existingImages && editFormData.existingImages.length > 0 && (
                  <div className="existing-images">
                    <h4 className="subsection-title">Ảnh hiện tại</h4>
                    <div className="image-preview-grid">
                      {editFormData.existingImages.map((img, index) => {
                        const imageUrl = typeof img === 'string' ? img : img.imageUrl;
                        return (
                          <div key={`existing-${index}`} className="image-preview-item">
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeExistingImage(imageUrl)}
                              title="Xóa ảnh vĩnh viễn"
                            >
                              <X size={12} />
                            </button>
                            <img
                              src={getProductImageSrc({ images: [img] })}
                              alt={`Existing ${index + 1}`}
                              className="preview-image"
                            />
                            <div className="image-info">
                              <span className="image-name">{imageUrl}</span>
                              {index === 0 && <span className="thumbnail-badge">Ảnh đại diện</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upload ảnh mới */}
                <div className="new-images">
                  <h4 className="subsection-title">Thêm ảnh mới</h4>
                  <div className="upload-area">
                    <input
                      type="file"
                      id="edit-images"
                      multiple
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      className="upload-input"
                    />
                    <label htmlFor="edit-images" className="upload-label">
                      <Upload size={32} className="upload-icon" />
                      <div className="upload-text">
                        <div>Kéo & thả nhiều ảnh vào đây hoặc bấm để chọn</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          Hỗ trợ JPG, PNG, GIF. Có thể chọn nhiều ảnh cùng lúc.
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Preview ảnh mới */}
                  {editFormData.images.length > 0 && (
                    <div className="uploaded-files">
                      <p>{editFormData.images.length} ảnh mới đã chọn</p>
                      <div className="image-preview-grid">
                        {editFormData.images.map((file, index) => (
                          <div key={`new-${index}`} className="image-preview-item">
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeEditImage(index)}
                              title="Xóa ảnh"
                            >
                              <X size={12} />
                            </button>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New Preview ${index + 1}`}
                              className="preview-image"
                            />
                            <div className="image-info">
                              <span className="image-name">{file.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="upload-hint">
                        ✅ Ảnh sẽ được tự động lưu vào thư mục <code>src/assets/img-product/</code>
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Địa chỉ */}
              <section className="form-section">
                <h3 className="section-title">Địa chỉ</h3>
                <div className="form-group">
                  <label className="form-label">
                    <span className="required">*</span> Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditInputChange}
                    className={`form-input ${editErrors.address ? 'error' : ''}`}
                    required
                  />
                  {editErrors.address && <div className="field-error">{editErrors.address}</div>}
                </div>
              </section>

              {/* Trạng thái */}
              <section className="form-section">
                <h3 className="section-title">Trạng thái</h3>
                <div className="form-group">
                  <label className="form-label">Trạng thái sản phẩm</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditInputChange}
                    className="form-select"
                  >
                    <option value="ACTIVE">Đang bán</option>
                    <option value="HIDDEN">Ẩn</option>
                    <option value="SOLD_OUT">Hết hàng</option>
                  </select>
                </div>
              </section>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseEdit}
                  disabled={editLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={editLoading}
                >
                  {editLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const wrapper = (
    <div className="product-management">
      {content}
    </div>
  );

  if (isInsideProductsLayout) {
    return wrapper;
  }
  return <Layout>{wrapper}</Layout>;
};

export default ProductManagementPage;