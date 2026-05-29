import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

//----------------create context for add items 

export const CartProvider = ({ children }) => {


  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  //--------------------------------------Add to cart

  const addToCart = (pizza, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.pizza._id === pizza._id);

      if (existing) {
        return prev.map(item =>
          item.pizza._id === pizza._id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [...prev, { pizza, qty }];
    });
  };


  //-----------------------------------------Update quantity
  const updateQty = (pizzaId, newQty) => {
    if (newQty < 1) {
      removeItem(pizzaId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.pizza._id === pizzaId
          ? { ...item, qty: newQty }
          : item
      )
    );
  };

  //------------------------------------------------- Remove item
  const removeItem = (pizzaId) => {
    setItems(prev => prev.filter(item => item.pizza._id !== pizzaId));
  };

  //--------------------------------Clear cart

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  //---------------------------------------------------Computed values

  const cartCount = items.reduce((total, item) => total + item.qty, 0);


  
  const cartTotal = items.reduce(
    (total, item) => total + item.pizza.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

