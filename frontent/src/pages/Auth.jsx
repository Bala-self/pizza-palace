import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi';
import bgimage from "../assets/Gemini_Generated_Image_qc4jq9qc4jq9qc4j.png";
import logo from "../assets/icons8-pizza-100.png";

const Auth = () => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//------------------SWITCH TAB LOGIN - REGISTER

  const switchTab = (newTab) => {
    setTab(newTab);
    setForm({ name: '', email: '', password: '' });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user;
      if (tab === 'login') {
        user = await login(form.email, form.password);
      } else {
        user = await register(form.name, form.email, form.password);
      }
      toast.success(tab === 'login' ? 'Welcome back!' : 'Account created!');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255,0)), url(${bgimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-blur-sm rounded-2xl shadow-xl border border-yellow-50 shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="Pizza Palace Logo" 
            className="mx-auto w-16 h-16 object-contain" 
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-red-700">Pizza Palace</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>
        <div className="flex bg-yellow-100 rounded-xl p-1 mb-7">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                tab === t
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full border border-yellow-300 rounded-lg pl-10 pr-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={18} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full border border-yellow-300 rounded-lg pl-10 pr-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={tab === 'register' ? 'Minimum 8 characters' : 'Your password'}
                required
                minLength={8}
                className="w-full border border-yellow-300 rounded-lg pl-10 pr-10 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm sm:text-base mt-2"
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm sm:text-base text-gray-500 mt-6">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            {tab === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
