import { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import Navbar from '../../components/Navbar';
import formatCurrency from '../../utils/formatCurrency';
import formatData from '../../utils/formatData';

const VALID_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
const FILTER_OPTIONS = ['all', ...VALID_STATUSES];

const STATUS_LABELS = {
  'Pending':          'Pending',
  'Confirmed':        'Confirmed',
  'Preparing':        'Preparing',
  'Out for Delivery': 'Out for Delivery',
  'Delivered':        'Delivered',
};



const OrderItems = ({ items, totalAmount }) => (
  <tr className="bg-gray-50">
    <td colSpan={6} className="px-4 pt-0 pb-4">
      <div className="bg-white border border-gray-100 rounded-xl p-4 mx-2 mt-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Items</p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-red-50 text-red-600 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {item.qty}
                </span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="text-gray-500 font-medium">
                {formatCurrency(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm font-semibold text-gray-800 mt-3 pt-3 border-t border-dashed border-gray-200">
          <span>Total</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </td>
  </tr>
);



const OrderRow = ({ order, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isLocked = order.status === 'Delivered';

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === order.status) return;
    setUpdating(true);
    try {
      await API.put(`/orders/${order._id}/status`, { status: newStatus });
      toast.success(`Status → ${newStatus}`);
      onStatusChange(order._id, newStatus);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const customer = order.customerId;

  return (
    <>
      <tr
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setExpanded(p => !p)}
      >
        <td className="px-4 py-3">
          <span className="font-mono text-xs text-gray-400">
            #{order._id.slice(-8).toUpperCase()}
          </span>
        </td>
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-gray-800">{customer?.name || '—'}</p>
          <p className="text-xs text-gray-400">{customer?.email}</p>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </td>
        <td className="px-4 py-3 text-sm font-semibold text-gray-800">
          {formatCurrency(order.totalAmount)}
        </td>
        <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
          {formatData(order.createdAt)}
        </td>
        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            {isLocked ? (
              <StatusBadge status={order.status} />
            ) : (
              <select
                value={order.status}
                onChange={handleChange}
                disabled={updating}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 bg-white cursor-pointer"
              >
                {VALID_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
            <button
              onClick={e => { e.stopPropagation(); setExpanded(p => !p); }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </button>
          </div>
        </td>
      </tr>
      {expanded && <OrderItems items={order.items} totalAmount={order.totalAmount} />}
    </>
  );
};

const AdminOrders = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data.orders || []);
    } catch {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
  };

  const filtered = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <p className="text-gray-500 text-sm mt-1">
              {orders.length} total · {orders.filter(o => o.status === 'Pending').length} pending
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-xl hover:bg-white transition-all disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {FILTER_OPTIONS.map(f => {
            const count = f === 'all'
              ? orders.length
              : orders.filter(o => o.status === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === f
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {f === 'all' ? 'All' : f} ({count})
              </button>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <div className="text-3xl animate-bounce mb-3">🍕</div>
              <p className="text-gray-400 text-sm">Loading orders...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 font-medium">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    {['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;