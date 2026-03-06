import { useEffect } from 'react';
import { sendHeartbeat } from '../api/user';

/**
 * Hook to send heartbeat every 30 seconds to track online users
 * @param {number} userId - The user ID to send heartbeat for
 */
export function useHeartbeat(userId) {
  useEffect(() => {
    if (!userId) return;

    // Send initial heartbeat
    sendHeartbeat(userId);

    // Send heartbeat every 30 seconds
    const interval = setInterval(() => {
      sendHeartbeat(userId);
    }, 30000); // 30 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [userId]);
}
