import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import formatCurrency from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';

const CATEGORY_COLORS = {
  'Veg':       'bg-green-100 text-green-700',
  'Non-Veg':   'bg-red-100   text-red-700',
  'Specialty': 'bg-purple-100 text-purple-700'
};

const PizzaCard = ({ pizza }) => {



  const { user }       = useAuth();
  const { addToCart }  = useCart();

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(pizza, 1);

    toast.success(`${pizza.name} added to cart! `);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden
                    hover:shadow-md transition-shadow duration-200 flex flex-col">

      <Link to={`/pizza/${pizza._id}`}
        className="block relative h-48 overflow-hidden">
        <img
          src={pizza.imageUrl}
          alt={pizza.name}
          className="w-full h-full object-cover hover:scale-105
                     transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 text-xs font-medium
                          px-2.5 py-1 rounded-full
                          ${CATEGORY_COLORS[pizza.category]
                            || 'bg-gray-100 text-gray-600'}`}>
          {pizza.category}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/pizza/${pizza._id}`}>
          <h3 className="font-semibold text-gray-900 text-base mb-1
                         hover:text-red-600 transition-colors">
            {pizza.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-4">
          {pizza.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(pizza.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700
                       text-white text-sm font-medium px-3 py-2 rounded-lg
                       transition-colors"
          >
            <FiShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;