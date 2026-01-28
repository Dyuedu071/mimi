import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import loginIllustration from '../assets/login-illustration.svg';
import '../styles/LoginPage.css';

export default function LoginPage({ onRegisterClick }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement login logic
    console.log('Login:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password page
    console.log('Navigate to forgot password');
  };

  const handleRegister = () => {
    if (typeof onRegisterClick === 'function') {
      onRegisterClick();
    } else {
      console.log('Navigate to register');
    }
  };

  const handleNavigation = (path) => {
    // TODO: Implement navigation
    console.log('Navigate to:', path);
  };

  return (
    <div className="login-container">
      {/* Header Navigation */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">MiMi</span>
          </div>
          <nav className="nav-menu">
            <button className="nav-link">Trang chủ</button>
            <button className="nav-link">Cửa hàng</button>
            <button className="nav-link">Về chúng tôi</button>
            <button className="nav-link">Liên hệ</button>
            <button
              className="nav-button register-btn"
              type="button"
              onClick={handleRegister}
            >
              Đăng ký
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="login-main">
        {/* Left Side - Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            {/* Brand Section */}
            <div className="brand-section">
              <h1 className="brand-title">MiMi</h1>
              <div className="brand-subtitle">
                <h2>Khám phá những</h2>
                <h2>Khoảnh khắc Hạnh phúc</h2>
              </div>
              <p className="brand-description">
                Đăng nhập để khám phá những món đồ thiết yếu cho bé 
                đáng yêu, an toàn và vui nhộn, được chế tác bằng tình yêu.
              </p>
            </div>

            {/* Login Form */}
            <div className="form-section">
              <div className="form-header">
                <h3 className="form-title">Chào mừng trở lại, Bé yêu!</h3>
                <p className="form-subtitle">
                  Đăng nhập để khám phá những món đồ thiết yếu cho bé 
                  an toàn và vui nhộn của chúng tôi.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <span className="input-icon" aria-hidden="true">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <span className="input-icon" aria-hidden="true">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="forgot-password"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button"
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              <div className="register-link">
                <p>
                  Chưa có tài khoản?{' '}
                  <button 
                    onClick={handleRegister}
                    className="register-button"
                  >
                    Đăng ký tại đây!
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="illustration-section">
          <div className="illustration-content">
            <div className="illustration-card">
              <img
                src={loginIllustration}
                alt="Minh hoạ em bé và đồ chơi"
                className="login-illustration-img"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <button onClick={() => handleNavigation('/shop')} className="footer-link">Cửa hàng</button>
          <button onClick={() => handleNavigation('/help')} className="footer-link">Hỗ trợ</button>
          <button onClick={() => handleNavigation('/company')} className="footer-link">Công ty</button>
        </div>
        <div className="social-links">
          <div className="social-icon">f</div>
          <div className="social-icon">📷</div>
        </div>
      </footer>
    </div>
  );
}