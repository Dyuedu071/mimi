import { useState, useEffect } from 'react';
import { getDailyRevenue, getWeeklyRevenue } from '../api/revenue';

export default function TestRevenuePage() {
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');

  const testAPI = async () => {
    if (!userId) {
      alert('Vui lòng nhập User ID');
      return;
    }

    try {
      setError(null);
      console.log('Testing with userId:', userId);
      
      const daily = await getDailyRevenue(userId, null, null);
      console.log('Daily data:', daily);
      setDailyData(daily);
      
      const weekly = await getWeeklyRevenue(userId, null, null);
      console.log('Weekly data:', weekly);
      setWeeklyData(weekly);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setUserId(user.id || user.userId || '');
      } catch (e) {
        console.error('Parse error:', e);
      }
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Test Revenue API</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          User ID: 
          <input 
            type="text" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
        <button onClick={testAPI} style={{ marginLeft: '10px', padding: '5px 15px' }}>
          Test API
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2>Daily Revenue</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(dailyData, null, 2)}
          </pre>
        </div>

        <div>
          <h2>Weekly Revenue</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(weeklyData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
