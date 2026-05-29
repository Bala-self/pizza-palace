import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import formatCurrency from '../utils/formatCurrency';
import { FiPlus, FiMinus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { FiShoppingCart } from 'react-icons/fi';


const Cart = () => {
  const { items, updateQty, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <EmptyState
          icon= <FiShoppingCart/>
          title="Your cart is empty"
          message="Looks like you haven't added any pizzas yet. Go explore the menu!"
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

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

        <div className="space-y-3 mb-6">
          {items.map(({ pizza, qty }) => (
            <div
              key={pizza._id}
              className="bg-white rounded-2xl border border-gray-100
                         p-4 flex gap-4 items-start"
            >
              <img
                src={pizza.imageUrl}
                alt={pizza.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl
                           object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {pizza.name}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {formatCurrency(pizza.price)} each
                </p>

                <div className="flex items-center justify-between mt-3">

                  <div className="flex items-center border border-gray-200
                                  rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(pizza._id, qty - 1)}
                      className="px-2.5 py-1.5 text-gray-600
                                 hover:bg-gray-50 transition-colors"
                    >
                      <FiMinus size={13} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium
                                     border-x border-gray-200 min-w-[2rem] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQty(pizza._id, qty + 1)}
                      className="px-2.5 py-1.5 text-gray-600
                                 hover:bg-gray-50 transition-colors"
                    >
                      <FiPlus size={13} />
                    </button>
                  </div>

                  <span className="font-semibold text-gray-900 text-sm">
                    {formatCurrency(pizza.price * qty)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => removeItem(pizza._id)}
                className="text-gray-300 hover:text-red-500
                           transition-colors flex-shrink-0 mt-0.5"
                title="Remove item"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            {items.map(({ pizza, qty }) => (
              <div key={pizza._id} className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {pizza.name} × {qty}
                </span>
                <span className="text-gray-700 font-medium">
                  {formatCurrency(pizza.price * qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 my-4" />

          <div className="flex justify-between items-center mb-5">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(cartTotal)}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2
                       bg-red-600 hover:bg-red-700 text-white font-semibold
                       py-3 rounded-xl transition-colors"
          >
            Proceed to Checkout
            <FiArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;