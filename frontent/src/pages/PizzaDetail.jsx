import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPizzaById } from '../api/pizzas';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import formatCurrency from '../utils/formatCurrency';
import toast from 'react-hot-toast';

import {
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiShoppingCart
} from 'react-icons/fi';

const CATEGORY_COLORS = {
  'Veg':       'bg-green-100 text-green-700',
  'Non-Veg':   'bg-red-100   text-red-700',
  'Specialty': 'bg-purple-100 text-purple-700'
};

const PizzaDetail = () => {


  const { id }     = useParams();
  const navigate   = useNavigate();

  const { user }       = useAuth();
  const { addToCart }  = useCart(); 

  const [pizza, setPizza]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);


  useEffect(() => {
    const fetchPizza = async () => {
      try {
        const { data } = await getPizzaById(id);
        setPizza(data.pizza);
      } catch (error) {
        console.error('Pizza not found:', error);
        navigate('/menu');

      } finally {
        setLoading(false);
      }
    };

    fetchPizza();
  }, [id, navigate]);

  // ── Add to Cart ────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart <FaPizzaSlice/> ');
      navigate('/auth');
      return;
    }

    addToCart(pizza, qty);

    toast.success(`${qty}x ${pizza.name} added to cart! <FaPizzaSlice/>`);
  };

  // ── Loading skeleton ───────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-10">
          <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 sm:h-72 bg-gray-200" />
              <div className="md:w-1/2 p-6 sm:p-8 space-y-4">
                <div className="h-5  bg-gray-200 rounded w-20" />
                <div className="h-7  bg-gray-200 rounded w-2/3" />
                <div className="h-4  bg-gray-200 rounded w-full" />
                <div className="h-4  bg-gray-200 rounded w-3/4" />
                <div className="h-8  bg-gray-200 rounded w-28 mt-2" />
                <div className="h-12 bg-gray-200 rounded w-full mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pizza) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-10">

        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700
                     text-sm mb-6 transition-colors"
        >
          <FiArrowLeft size={16} />
          Back to Menu
        </button>

        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">

          
          <div className="md:flex">

            <div className="md:w-1/2 h-64 sm:h-80 md:h-auto">
              <img
                src={pizza.imageUrl}
                alt={pizza.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:w-1/2 p-5 sm:p-8 flex flex-col">

              <span
                className={`self-start text-xs font-medium px-3 py-1
                            rounded-full mb-4
                            ${CATEGORY_COLORS[pizza.category]
                              || 'bg-gray-100 text-gray-600'}`}
              >
                {pizza.category}
              </span>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                {pizza.name}
              </h1>

              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {pizza.description}
              </p>

              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                {formatCurrency(pizza.price)}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Quantity
                </span>

                <div className="flex items-center border border-gray-200
                                rounded-lg overflow-hidden">

                  <button
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50
                               transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={14} />
                  </button>

                  <span className="px-4 sm:px-5 py-2 text-sm font-semibold
                                   border-x border-gray-200 min-w-[2.5rem]
                                   text-center">
                    {qty}
                  </span>

                  <button
                    onClick={() => setQty(prev => prev + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50
                               transition-colors"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Total:{' '}
                <span className="font-semibold text-gray-900">
                  {formatCurrency(pizza.price * qty)}
                </span>
              </p>

              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 w-full
                           bg-red-600 hover:bg-red-700 text-white
                           font-semibold py-3 rounded-xl transition-colors
                           text-sm sm:text-base"
              >
                <FiShoppingCart size={18} />
                Add to Cart
              </button>

              {!user && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  You need to{' '}
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-red-600 hover:underline"
                  >
                    sign in
                  </button>
                  {' '}to add items to your cart
                </p>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PizzaDetail;
