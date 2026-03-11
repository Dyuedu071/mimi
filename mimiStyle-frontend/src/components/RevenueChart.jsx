import React from 'react';
import '../styles/RevenueChart.css';

const RevenueChart = ({ data, type }) => {
  console.log('RevenueChart data:', data, 'type:', type);
  
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Chưa có dữ liệu thống kê cho khoảng thời gian này</p>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          Hãy thử chọn khoảng thời gian khác hoặc tạo đơn hàng mới
        </p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => Number(d.revenue) || 0), 1);
  const maxHeight = 200;

  const formatPrice = (price) => {
    const n = Number(price);
    if (n >= 1000000) {
      return (n / 1000000).toFixed(1) + 'M';
    }
    if (n >= 1000) {
      return (n / 1000).toFixed(0) + 'K';
    }
    return n.toFixed(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (type === 'weekly') {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 6);
      return `${date.getDate()}/${date.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`;
    }
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const formatFullPrice = (price) => {
    const n = Number(price);
    return new Intl.NumberFormat('vi-VN').format(Number.isNaN(n) ? 0 : n) + ' ₫';
  };

  return (
    <div className="revenue-chart">
      <div className="chart-bars">
        {data.map((item, index) => {
          const height = maxRevenue > 0 ? (Number(item.revenue) / maxRevenue) * maxHeight : 0;
          return (
            <div key={index} className="chart-bar-wrapper">
              <div className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ height: `${height}px` }}
                  title={`${formatDate(item.date)}: ${formatFullPrice(item.revenue)}`}
                >
                  <span className="chart-bar-value">{formatPrice(item.revenue)}</span>
                </div>
              </div>
              <div className="chart-label">{formatDate(item.date)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;
