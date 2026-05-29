import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PizzaCard from '../components/PizzaCard';
import Loader from '../components/Loader';
import { getAllPizzas } from '../api/pizzas';
import { CATEGORIES } from '../utils/constants';
import { FiSearch, FiX, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';
import { FaPizzaSlice } from "react-icons/fa";


const Menu = () => {
  const [pizzas, setPizzas]           = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setCategory] = useState('All');
  const [search, setSearch]           = useState('');

  //--------------------fetch all pizza data from backend

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const { data } = await getAllPizzas();
        setPizzas(data.pizzas);
        setFiltered(data.pizzas);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

//--------------------defalt showing all catagury

  useEffect(() => {
    let result = pizzas;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }
    setFiltered(result);
  }, [activeCategory, search, pizzas]);





  const handleAddToCart = (pizza) => {
    console.log('Add to cart:', pizza.name);
  };



  const clearFilters = () => {
    setCategory('All');
    setSearch('');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Our Menu</h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} pizza{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="mb-6">
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search pizzas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>



        {loading ? (
          <Loader count={6} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FaPizzaSlice className="mx-auto text-red-600 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pizzas found</h3>
            <p className="text-gray-500 text-sm mb-5">Try a different category or search term</p>
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 text-sm font-medium border border-red-200 px-4 py-2 rounded-lg"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>




      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Pizza Palace?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FiTrendingUp size={32} className="text-red-600 mx-auto mb-3" />, title: 'Fresh Every Day', desc: 'Dough made fresh every morning, never frozen' },
              { icon: <FiZap size={32} className="text-yellow-500 mx-auto mb-3" />, title: 'Fast Delivery', desc: 'Average 30 minutes from order to your door' },
              { icon: <FiShield size={32} className="text-green-600 mx-auto mb-3" />, title: 'Quality Ingredients', desc: 'Sourced locally, zero preservatives' }
            ].map((item) => (
              <div key={item.title} className="text-center">
                {item.icon}
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;
