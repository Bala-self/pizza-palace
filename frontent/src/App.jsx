

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster }       from 'react-hot-toast';
import { AuthProvider }  from './context/AuthContext';
import { CartProvider }  from './context/CartContext';
import ProtectedRoute    from './components/ProtectedRoute';

import Auth         from './pages/Auth';
import Home         from './pages/Home';
import Menu         from './pages/Menu';
import PizzaDetail  from './pages/PizzaDetail';
import Cart         from './pages/Cart';
import Checkout     from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Profile      from './pages/Profile';
import Dashboard    from './pages/admin/Dashboard';
import AdminPizzas  from './pages/admin/AdminPizzas';
import AdminOrders  from './pages/admin/Adminorders';  

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: '14px' } }} />
          <Routes>
            <Route path="/auth"      element={<Auth />} />
            <Route path="/menu"      element={<Menu />} />
            <Route path="/pizza/:id" element={<PizzaDetail />} />

            <Route path="/"         element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders"   element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/admin"         element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/pizzas"  element={<ProtectedRoute adminOnly={true}><AdminPizzas /></ProtectedRoute>} />
            <Route path="/admin/orders"  element={<ProtectedRoute adminOnly={true}><AdminOrders /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;