import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage, FiClock, FiCheckCircle,
  FiDollarSign, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import formatCurrency from '../../utils/formatCurrency';
import Navbar from '../../components/Navbar';

const StatCard = ({ icon: Icon, label, value, iconClass }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconClass}`}>
      <Icon size={18} />
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
  </div>
);

const QuickLink = ({ to, icon: Icon, label, description, iconClass }) => (
  <Link
    to={to}
    className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400 truncate">{description}</p>
    </div>
    <FiChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
  </Link>
);

const Dashboard = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      const orders   = data.orders || [];

      const total     = orders.length;
      const pending   = orders.filter(o => o.status === 'Pending').length;
      const delivered = orders.filter(o => o.status === 'Delivered').length;

      const revenue   = orders
        .filter(o => o.status === 'Delivered')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({ total, pending, delivered, revenue });
    } catch {
      toast.error('Failed to load stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Pizza Palace control centre</p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-xl hover:bg-white hover:border-gray-300 transition-all disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3" />
                <div className="h-6 bg-gray-100 rounded w-16 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FiPackage}     label="Total Orders" value={stats?.total ?? 0}                    iconClass="bg-blue-50 text-blue-600" />
            <StatCard icon={FiClock}       label="Pending"      value={stats?.pending ?? 0}                  iconClass="bg-yellow-50 text-yellow-600" />
            <StatCard icon={FiCheckCircle} label="Delivered"    value={stats?.delivered ?? 0}                iconClass="bg-green-50 text-green-600" />
            <StatCard icon={FiDollarSign}  label="Revenue"      value={formatCurrency(stats?.revenue ?? 0)}  iconClass="bg-red-50 text-red-600" />
          </div>
        )}

        <div className="mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Manage</h2>
          <div className="space-y-3">
            <QuickLink to="/admin/orders" icon={FiPackage}      label="All Orders" description="View and update customer order statuses" iconClass="bg-purple-50 text-purple-600" />
            <QuickLink to="/admin/pizzas" icon={FiCheckCircle}  label="Pizza Menu"  description="Add, edit, or remove pizzas from the menu"   iconClass="bg-orange-50 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
