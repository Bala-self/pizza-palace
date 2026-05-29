import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import {
  FiShoppingCart, FiList, FiLogOut,
  FiSettings, FiUser, FiMenu, FiX,
  FiHome
} from 'react-icons/fi';
import { MdRestaurantMenu } from "react-icons/md";
import logo from '../assets/8fc7ffe5-8fe7-477b-be1e-cee639f35e7e.png';

const Navbar = () => {
  const { user, logout }  = useAuth();
  const { cartCount }     = useCart();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP NAVBAR — visible on all screen sizes */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 text-red-600 font-bold text-lg flex-shrink-0">
            <img src={logo} alt="Pizza Palace" className="h-9 w-auto" />
            <span className="text-red-600">Pizza Palace</span>
          </Link>

          {/* ── DESKTOP right side (hidden on mobile) ── */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/menu" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Menu
            </Link>

            {user && (
              <>
                <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
                  <FiShoppingCart size={19} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders"  className="text-gray-600 hover:text-gray-900"><FiList size={19} /></Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900"><FiUser size={19} /></Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-purple-600 hover:text-purple-700"><FiSettings size={19} /></Link>
                )}
              </>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-600" title="Logout">
                  <FiLogOut size={17} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                Sign In
              </Link>
            )}
          </div>

          {/* ── MOBILE right side: hamburger only ── */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cart badge visible on mobile top bar */}
            {user && (
              <Link to="/cart" className="relative text-gray-600">
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-gray-900 p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE dropdown menu (when hamburger is open) ── */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
            <Link to="/menu" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              Menu
            </Link>

            {user ? (
              <>
                <Link to="/" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <FiHome size={17} /> Home
                </Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <FiShoppingCart size={17} />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
                  )}
                </Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <FiList size={17} /> My Orders
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <FiUser size={17} /> Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50">
                    <FiSettings size={17} /> Admin Panel
                  </Link>
                )}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left mt-1">
                    <FiLogOut size={17} /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl mt-2">
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>

  
      {/*BOTTOM NAV BAR — mobile only*/}


      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
          <div className="flex items-stretch">

            {/* Home */}
            <Link to="/"
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
                isActive('/') ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiHome size={20} />
              <span>Home</span>
            </Link>

            {/* Menu */}
            <Link to="/menu"
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
                isActive('/menu') ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <MdRestaurantMenu size={20} />
              <span>Menu</span>
            </Link>

            {/* Orders */}
            <Link to="/orders"
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
                isActive('/orders') ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiList size={20} />
              <span>Orders</span>
            </Link>

            {/* Profile */}
            <Link to="/profile"
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
                isActive('/profile') ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiUser size={20} />
              <span>Profile</span>
            </Link>

          </div>
          <div style={{ height: 'env(safe-area-inset-bottom)' }} />
        </div>
      )}

      {user && <div className="md:hidden h-16" />}
    </>
  );
};

export default Navbar;