import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PizzaCard from '../components/PizzaCard';
import Loader from '../components/Loader';
import { getAllPizzas } from '../api/pizzas';
import { FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

//------------------------fetch all pizza from backend

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getAllPizzas();
        setFeaturedPizzas(data.pizzas.slice(0, 3));
      } catch (error) {
        console.error('Failed to load pizzas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);



  const handleAddToCart = (pizza) => {
    console.log('Add to cart:', pizza.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fresh Pizza, <span className="text-red-600">Delivered Fast</span>
          </h1>

          <p className="text-gray-500 text-lg mb-8 max-w-md">
            Hand-crafted pizzas made with the freshest ingredients,
            delivered hot to your door.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to="/menu"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold
                         px-8 py-3 rounded-xl transition-colors text-base"
            >
              Order Now
            </Link>

            <Link
              to="/menu"
              className="border border-gray-200 hover:border-gray-300 text-gray-700
                         font-semibold px-8 py-3 rounded-xl transition-colors text-base"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Pizzas</h2>
          <Link to="/menu" className="text-red-600 hover:text-red-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <Loader count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPizzas.map((pizza) => (
              <PizzaCard
                key={pizza._id}
                pizza={pizza}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Why Pizza Palace?
          </h2>
{/*------------------------------------     HOME FOOTER     ---------------------------------  */}

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

export default Home;
