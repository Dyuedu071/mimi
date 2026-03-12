const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Xác nhận trả hàng cho đơn thuê
 * @param {number} orderId
 */
export async function returnRentalOrder(orderId) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể xác nhận trả hàng');
  }
  return res.json();
}

/**
 * Hoàn trả tiền cọc cho đơn thuê
 * @param {number} orderId
 */
export async function refundDeposit(orderId) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/refund-deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể hoàn trả tiền cọc');
  }
  return res.json();
}
