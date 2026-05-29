import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api/orders';
import formatCurrency from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import { FiMapPin, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

//------------------SAVE ADDERSS 

  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);



  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }

    setPlacing(true);

    try {

      const orderItems = items.map(({ pizza, qty }) => ({
        pizzaId: pizza._id,
        qty
      }));

      await placeOrder({
        items:           orderItems,
        deliveryAddress: address.trim()
      });

//--------------------------------CLEAR CART

      clearCart();

      toast.success('Order placed! We\'ll start preparing it soon.');

      navigate('/orders');

    } catch (error) {
      const message = error.response?.data?.message
        || 'Failed to place order. Please try again.';
      toast.error(message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-10">

        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700
                     text-sm mb-6 transition-colors"
        >
          <FiArrowLeft size={15} /> Back to Cart
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="space-y-4">

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin size={16} className="text-red-600" />
              Delivery Address
            </h2>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address including house number, street, area, and city..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                         text-sm text-gray-700 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-red-500
                         focus:border-transparent resize-none"
            />

            <p className="text-xs text-gray-400 mt-2">
              Delivering to <span className="font-medium">{user?.name}</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

                       {/*ADD TO CART PIZZA DATA LIST*/}

            <div className="space-y-3">
              {items.map(({ pizza, qty }) => (
                <div key={pizza._id}
                  className="flex items-center gap-3">

                  <img
                    src={pizza.imageUrl}
                    alt={pizza.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {pizza.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatCurrency(pizza.price)} × {qty}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    {formatCurrency(pizza.price * qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4
                            flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total to pay</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(cartTotal)}
              </span>
            </div>
          </div>



          <button
            onClick={handlePlaceOrder}
            disabled={placing || !address.trim()}
            className="w-full flex items-center justify-center gap-2
                       bg-red-600 hover:bg-red-700 disabled:opacity-50
                       disabled:cursor-not-allowed text-white font-semibold
                       py-3.5 rounded-xl transition-colors text-base"
          >
            <FiCheckCircle size={18} />
            {placing ? 'Placing Order...' : 'Confirm Order'}
          </button>

          <p className="text-center text-xs text-gray-400">
            Payment will be collected on delivery
          </p>
        </div>

      </div>
    </div>
  );
};

export default Checkout;