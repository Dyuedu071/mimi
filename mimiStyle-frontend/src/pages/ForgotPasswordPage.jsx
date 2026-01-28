import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import '../styles/ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement forgot password logic
    console.log('Forgot password for:', email);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    // TODO: Navigate to login page
    console.log('Navigate back to login');
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    setEmail('');
  };

  if (isEmailSent) {
    return (
      <div className="email-sent-container">
        <div className="email-sent-card">
          <div className="email-sent-content">
            <div className="email-sent-emoji">📧</div>
            <h1 className="email-sent-title">
              Email đã được gửi!
            </h1>
            <p className="email-sent-description">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{email}</strong>. 
              Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
            </p>
            <div className="email-sent-actions">
              <button
                onClick={handleBackToLogin}
                className="email-sent-primary-button"
              >
                Quay lại đăng nhập
              </button>
              <button
                onClick={handleResendEmail}
                className="email-sent-secondary-button"
              >
                Gửi lại email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-main">
      {/* Left Side - Form */}
      <div className="forgot-password-form-section">
        <div className="forgot-password-card">
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            className="back-button"
          >
            <ArrowLeft size={16} />
            <span>Quay lại đăng nhập</span>
          </button>

          {/* Brand Section */}
          <div className="forgot-password-brand">
            <h1 className="forgot-password-title">MiMi</h1>
            <div className="forgot-password-subtitle">
              <h2>Quên mật khẩu?</h2>
              <p className="forgot-password-description">
                Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi 
                hướng dẫn đặt lại mật khẩu.
              </p>
            </div>
          </div>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="forgot-password-input-group">
              <Mail className="forgot-password-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="forgot-password-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="forgot-password-submit"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi hướng dẫn đặt lại'}
            </button>
          </form>

          <div className="forgot-password-login-link">
            <p>
              Nhớ mật khẩu rồi?{' '}
              <button 
                onClick={handleBackToLogin}
                className="forgot-password-login-button"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="forgot-password-illustration-section">
        <div className="forgot-password-illustration-content">
          <div className="forgot-password-illustration-card">
            <div className="forgot-password-illustration-main">
              <div className="forgot-password-illustration-emoji">🔐</div>
              <h3 className="forgot-password-illustration-title">Đặt lại mật khẩu</h3>
              <p className="forgot-password-illustration-description">
                Chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản một cách an toàn
              </p>
              <div className="forgot-password-security-emojis">
                <div className="forgot-password-security-emoji">🛡️</div>
                <div className="forgot-password-security-emoji">✉️</div>
                <div className="forgot-password-security-emoji">🔑</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}