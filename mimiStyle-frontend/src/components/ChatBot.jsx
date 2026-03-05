import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ShoppingCart, Package, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/ChatBot.css';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price ?? 0);
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { items } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([
        {
          id: Date.now(),
          text: 'Xin chào! Tôi là trợ lý ảo của MiMi Style. Tôi có thể giúp bạn:\n\n• Xem thông tin giỏ hàng\n• Tư vấn sản phẩm\n• Trả lời câu hỏi về đơn hàng\n\nBạn cần hỗ trợ gì?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const getCartInfo = () => {
    if (items.length === 0) {
      return 'Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm để tôi có thể tư vấn cho bạn!';
    }

    const subtotal = items.reduce((s, i) => {
      const itemPrice = i.product?.price ?? 0;
      const itemDeposit = i.product?.deposit ?? 0;
      const totalItemPrice = itemDeposit > 0 ? itemPrice + itemDeposit : itemPrice;
      return s + totalItemPrice * i.quantity;
    }, 0);

    let response = `🛒 Giỏ hàng của bạn có ${items.length} sản phẩm:\n\n`;
    
    items.forEach((item, index) => {
      const itemPrice = item.product?.price ?? 0;
      const itemDeposit = item.product?.deposit ?? 0;
      const totalItemPrice = itemDeposit > 0 ? itemPrice + itemDeposit : itemPrice;
      const lineTotal = totalItemPrice * item.quantity;
      const variantText = [item.colorLabel, item.sizeLabel].filter(Boolean).join(' / ');
      
      response += `${index + 1}. ${item.product?.name}\n`;
      if (variantText) response += `   ${variantText}\n`;
      response += `   Số lượng: ${item.quantity}\n`;
      response += `   Giá: ${formatPrice(lineTotal)}\n\n`;
    });

    response += `💰 Tổng tiền: ${formatPrice(subtotal)}`;
    return response;
  };

  const generateBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Giỏ hàng
    if (msg.includes('giỏ hàng') || msg.includes('gio hang') || msg.includes('cart')) {
      return getCartInfo();
    }

    // Số lượng sản phẩm
    if (msg.includes('bao nhiêu') && (msg.includes('sản phẩm') || msg.includes('san pham'))) {
      return `Hiện tại giỏ hàng của bạn có ${items.length} sản phẩm.`;
    }

    // Tổng tiền
    if (msg.includes('tổng') || msg.includes('tong') || msg.includes('giá') || msg.includes('gia')) {
      if (items.length === 0) {
        return 'Giỏ hàng của bạn đang trống nên tổng tiền là 0đ.';
      }
      const subtotal = items.reduce((s, i) => {
        const itemPrice = i.product?.price ?? 0;
        const itemDeposit = i.product?.deposit ?? 0;
        const totalItemPrice = itemDeposit > 0 ? itemPrice + itemDeposit : itemPrice;
        return s + totalItemPrice * i.quantity;
      }, 0);
      return `Tổng tiền giỏ hàng của bạn là: ${formatPrice(subtotal)}`;
    }

    // Thanh toán
    if (msg.includes('thanh toán') || msg.includes('thanh toan') || msg.includes('mua') || msg.includes('đặt hàng')) {
      if (items.length === 0) {
        return 'Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán!';
      }
      return 'Để thanh toán, bạn hãy nhấn vào biểu tượng giỏ hàng ở góc trên bên phải và chọn "Thanh toán". Tôi sẽ hướng dẫn bạn qua các bước tiếp theo!';
    }

    // Vận chuyển
    if (msg.includes('vận chuyển') || msg.includes('van chuyen') || msg.includes('giao hàng') || msg.includes('ship')) {
      return 'MiMi Style hỗ trợ giao hàng toàn quốc. Phí vận chuyển sẽ được tính dựa trên địa chỉ giao hàng của bạn. Bạn có thể xem chi tiết phí vận chuyển khi thanh toán.';
    }

    // Sản phẩm
    if (msg.includes('sản phẩm') || msg.includes('san pham') || msg.includes('đồ') || msg.includes('quần áo')) {
      return 'MiMi Style chuyên cung cấp quần áo và phụ kiện cho mẹ và bé. Bạn có thể xem các sản phẩm tại trang chủ hoặc tìm kiếm sản phẩm cụ thể. Bạn cần tư vấn về loại sản phẩm nào?';
    }

    // Liên hệ
    if (msg.includes('liên hệ') || msg.includes('lien he') || msg.includes('hotline') || msg.includes('số điện thoại')) {
      return '📞 Liên hệ với chúng tôi:\n\nHotline: 1900-xxxx\nEmail: support@mimistyle.vn\nGiờ làm việc: 8:00 - 22:00 (Thứ 2 - Chủ nhật)';
    }

    // Chào hỏi
    if (msg.includes('xin chào') || msg.includes('chào') || msg.includes('hello') || msg.includes('hi')) {
      return 'Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tôi giúp gì?';
    }

    // Cảm ơn
    if (msg.includes('cảm ơn') || msg.includes('cam on') || msg.includes('thanks') || msg.includes('thank')) {
      return 'Rất vui được giúp đỡ bạn! Nếu có thắc mắc gì khác, đừng ngại hỏi tôi nhé! 😊';
    }

    // Default response
    return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi tôi về:\n\n• Giỏ hàng\n• Thanh toán\n• Vận chuyển\n• Sản phẩm\n• Liên hệ\n\nHoặc gõ "giỏ hàng" để xem chi tiết giỏ hàng của bạn.';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: ShoppingCart, label: 'Xem giỏ hàng', message: 'Giỏ hàng của tôi có gì?' },
    { icon: Package, label: 'Thanh toán', message: 'Làm sao để thanh toán?' },
    { icon: Info, label: 'Liên hệ', message: 'Thông tin liên hệ' },
  ];

  const handleQuickAction = (message) => {
    setInputValue(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Mở chat"
        >
          <MessageCircle size={24} />
          {items.length > 0 && <span className="chatbot-badge">{items.length}</span>}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="chatbot-title">MiMi Assistant</div>
                <div className="chatbot-status">Trực tuyến</div>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
              >
                <div className="chatbot-message-content">
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
                <div className="chatbot-message-time">
                  {msg.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-message bot">
                <div className="chatbot-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="chatbot-quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="chatbot-quick-action"
                  onClick={() => handleQuickAction(action.message)}
                >
                  <action.icon size={16} />
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-container">
            <textarea
              className="chatbot-input"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button
              className="chatbot-send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              aria-label="Gửi tin nhắn"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
