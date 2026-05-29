import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../api/auth';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiEdit2, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';



const Profile = () => {
  const { user } = useAuth();


  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });



  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await updateUserProfile(form);
      Object.assign(user, data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', email: user?.email || '' });
    setEditing(false);
  };

  const initial = (user?.name?.[0] || 'U').toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl font-bold mb-3">
            {initial}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
          <span className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
            <FiShield size={11} />
            {user?.role === 'admin' ? 'Admin' : 'Customer'}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Account Details</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs text-red-600 font-medium hover:text-red-700 transition-colors">
                <FiEdit2 size={13} /> Edit
              </button>
            )}
          </div>

          {!editing ? (
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0"><FiUser size={15} className="text-gray-400" /></div>
                <div><p className="text-xs text-gray-400">Full name</p><p className="text-sm font-medium text-gray-800">{user?.name}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0"><FiMail size={15} className="text-gray-400" /></div>
                <div><p className="text-xs text-gray-400">Email address</p><p className="text-sm font-medium text-gray-800">{user?.email}</p></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={handleCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {user?.createdAt && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;