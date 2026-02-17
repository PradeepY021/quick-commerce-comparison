import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem('quickCommerceCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quickCommerceCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedPlatform) => {
    const cartItem = {
      id: `${product.id}-${selectedPlatform.platform}`,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      category: product.category,
      platform: selectedPlatform.platform,
      price: selectedPlatform.price,
      deliveryTime: selectedPlatform.deliveryTime,
      deliveryFee: selectedPlatform.deliveryFee || 0,
      availability: selectedPlatform.availability,
      quantity: 1,
      addedAt: new Date().toISOString()
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === cartItem.id
      );

      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity) + (item.deliveryFee || 0);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

