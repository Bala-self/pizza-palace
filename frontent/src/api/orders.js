import API from './axios';

//-------------api endpoint for orders

export const placeOrder       = (data)      => API.post('/orders', data);
export const getMyOrders      = ()          => API.get('/orders/my');
export const getAllOrders      = ()          => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const cancelOrder       = (id)        => API.delete(`/orders/${id}`);


