"use client";

import React, { createContext, useState, useContext } from "react";

// Создаем контекст
const CartContext = createContext();

// Хук для использования контекста
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [totalPrice, setTotalPrice] = useState(0); 
  const [hasItems, setHasItems] = useState(false); 

  const updateCart = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bucket/total-price",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setHasItems(result.hasItems);
          setTotalPrice(result.totalPrice);
        } else {
          console.error("Ошибка при проверке корзины:", result.message);
        }
      } else {
        console.error("Ошибка при запросе данных корзины:", response.status);
      }
    } catch (err) {
      console.error("Ошибка при получении данных корзины:", err);
    }
  };

  return (
    <CartContext.Provider value={{ totalPrice, hasItems, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};
