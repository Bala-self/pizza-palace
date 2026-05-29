import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { getMyOrders, cancelOrder } from '../api/orders';
import formatCurrency from '../utils/formatCurrency';
import formatDate from '../utils/formatData';
import toast from 'react-hot-toast';
import { FiX, FiRefreshCw } from 'react-icons/fi';


const OrderHistory = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Could not load your orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;

    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      const message = error.response?.data?.message
        || 'Could not cancel order';
      toast.error(message);
    }
  };

  //-----------------------------------------------------Loading skeleton 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-40 mb-6 animate-pulse" />
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i}
                className="bg-white rounded-2xl border border-gray-100
                           p-5 animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-5 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ──--------------------------------------Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <EmptyState
          icon="📦"
          title="No orders yet"
          message="You haven't placed any orders. Go pick some pizzas!"
          actionLabel="Browse Menu"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-10">

        {/* Header + refresh button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 text-sm text-gray-500
                       hover:text-gray-700 transition-colors"
            title="Refresh orders"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>




        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center
                              sm:justify-between gap-2 px-5 py-4
                              border-b border-gray-50">
                <div>


                  <p className="text-xs text-gray-400 font-mono">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>


                <StatusBadge status={order.status} />
              </div>

              <div className="px-5 py-4">
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index}
                      className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name}
                        <span className="text-gray-400 ml-1">× {item.qty}</span>
                      </span>
                      <span className="text-gray-700 font-medium">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>


                <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-xs
                                text-gray-500 mb-4">
                   {order.deliveryAddress}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400">Total paid</span>
                    <p className="font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  {order.status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="flex items-center gap-1.5 text-xs text-red-500
                                 hover:text-red-700 border border-red-200
                                 hover:bg-red-50 px-3 py-1.5 rounded-lg
                                 transition-colors"
                    >
                      <FiX size={12} />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OrderHistory;