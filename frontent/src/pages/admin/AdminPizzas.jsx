

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getAllPizzas, createPizza, updatePizza, deletePizza } from '../../api/pizzas';
import formatCurrency from '../../utils/formatCurrency';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi';

const EMPTY_FORM = {
  name: '', description: '', price: '', category: 'Veg', imageUrl: '', isAvailable: true
};

const extractError = (error) => {
  const data = error.response?.data;
  if (!data) return 'Something went wrong.';
  if (data.errors && data.errors.length > 0) {
    return data.errors.map(e => `${e.path}: ${e.msg}`).join(' · ');
  }
  return data.message || 'Something went wrong.';
};

const AdminPizzas = () => {
  const [pizzas, setPizzas]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  const fetchPizzas = async () => {
    setLoading(true);
    try {
      const { data } = await getAllPizzas();
      setPizzas(data.pizzas);
    } catch {
      toast.error('Failed to load pizzas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPizzas(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openCreate = () => {
    setEditId(null); setForm(EMPTY_FORM); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (pizza) => {
    setEditId(pizza._id);
    setForm({ name: pizza.name, description: pizza.description, price: pizza.price,
              category: pizza.category, imageUrl: pizza.imageUrl, isAvailable: pizza.isAvailable });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updatePizza(editId, { ...form, price: Number(form.price) });
        toast.success('Pizza updated!');
      } else {
        await createPizza({ ...form, price: Number(form.price) });
        toast.success('Pizza created!');
      }
      setShowForm(false); setEditId(null); setForm(EMPTY_FORM);
      fetchPizzas();
    } catch (error) {
      toast.error(extractError(error));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (pizza) => {
    try {
      await updatePizza(pizza._id, { isAvailable: !pizza.isAvailable });
      toast.success(`${pizza.name} ${!pizza.isAvailable ? 'now visible' : 'now hidden'}`);
      fetchPizzas();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (pizza) => {
    if (!window.confirm(`Delete "${pizza.name}"? This cannot be undone.`)) return;
    try {
      await deletePizza(pizza._id);
      toast.success('Pizza deleted');
      fetchPizzas();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pizza Catalogue</h1>
            <p className="text-gray-500 text-sm mt-1">{pizzas.length} pizzas total</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link to="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap">
              <FiArrowLeft size={14} />
              <span className="hidden xs:inline sm:inline">Dashboard</span>
            </Link>
            <button onClick={openCreate} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              <FiPlus size={15} /> Add Pizza
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-base sm:text-lg">{editId ? 'Edit Pizza' : 'Add New Pizza'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-1"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Margherita Classic"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                    <option>Veg</option><option>Non-Veg</option><option>Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} required min="1" placeholder="299"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL <span className="text-gray-400 font-normal">(https://...)</span>
                  </label>
                  <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} required placeholder="https://example.com/pizza.jpg"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe the pizza..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="isAvailable" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="rounded w-4 h-4 accent-red-600" />
                  <label htmlFor="isAvailable" className="text-sm text-gray-700">Visible on menu — customers can see and order this</label>
                </div>
                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
                    {saving ? 'Saving...' : editId ? 'Update Pizza' : 'Create Pizza'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="w-full sm:w-auto border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/2" /><div className="h-3 bg-gray-200 rounded w-3/4" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : pizzas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 px-4">
            <div className="text-5xl mb-4"></div>
            <p className="text-gray-500 text-sm mb-4">No pizzas yet</p>
            <button onClick={openCreate} className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">Add your first pizza</button>
          </div>
        ) : (
          <>
            <div className="block md:hidden space-y-3">
              {pizzas.map((pizza) => (
                <div key={pizza._id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={pizza.imageUrl} alt={pizza.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{pizza.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{pizza.description}</p>
                      <span className="inline-block mt-1.5 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{pizza.category}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">{formatCurrency(pizza.price)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <button onClick={() => handleToggle(pizza)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${pizza.isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {pizza.isAvailable ? '✓ Visible' : '✗ Hidden'}
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(pizza)} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"><FiEdit2 size={13} />Edit</button>
                      <button onClick={() => handleDelete(pizza)} className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"><FiTrash2 size={13} />Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['Pizza','Category','Price','Status','Actions'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pizzas.map((pizza) => (
                      <tr key={pizza._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={pizza.imageUrl} alt={pizza.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{pizza.name}</p>
                              <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{pizza.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4"><span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{pizza.category}</span></td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(pizza.price)}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => handleToggle(pizza)} className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${pizza.isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            {pizza.isAvailable ? 'Visible' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => openEdit(pizza)} className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit"><FiEdit2 size={15} /></button>
                            <button onClick={() => handleDelete(pizza)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete"><FiTrash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!loading && pizzas.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">Showing {pizzas.length} pizza{pizzas.length !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
};

export default AdminPizzas;