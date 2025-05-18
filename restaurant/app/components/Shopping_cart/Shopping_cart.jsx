"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Shopping_cart.module.css";
import { useCart } from "@/CartContext"; // Импорт контекста корзины

export const Shopping_cart = () => {
  const [userProduct, setUserProduct] = useState([]);
  const { updateCart } = useCart();

  // Получение данных о корзине с сервера
  const fetchUserProduct = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Токен не найден");
      return;
    }

    try {
      const response = await fetch("/api/bucket/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setUserProduct(result.data); // Обновляем состояние с данными корзины
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Ошибка при получении данных корзины:", err);
    }
  };

  // Увеличение количества
  const incrementProductQuantity = async (foodName) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Токен не найден");
      return;
    }

    try {
      const response = await fetch(
        "/api/bucket/increment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ foodName }),
        }
      );

      const result = await response.json();
      if (result.success) {
        await fetchUserProduct();
        updateCart();
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Ошибка при увеличении количества:", err);
    }
  };

  // Уменьшение количества
  const decrementProductQuantity = async (foodName) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Токен не найден");
      return;
    }

    try {
      const response = await fetch(
        "/api/bucket/decrement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ foodName }),
        }
      );

      const result = await response.json();
      if (result.success) {
        await fetchUserProduct();
        updateCart();
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Ошибка при уменьшении количества:", err);
    }
  };

  // Удаление товара из корзины
  const removeProduct = async (foodName) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Токен не найден");
      return;
    }

    const confirmDelete = window.confirm(
      "Вы уверены, что хотите Удалить товар?"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
      const response = await fetch("/api/bucket/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodName }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchUserProduct();
        updateCart();
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Ошибка при удалении блюда:", err);
    }
  };

  // Используем useEffect для получения данных о корзине при монтировании компонента
  useEffect(() => {
    fetchUserProduct();
  }, []);

  return (
    <div className={Styles.shopping_cart}>
      {userProduct.length > 0 ? (
        <div className={Styles.ul_product}>
          {userProduct.map((product) => (
            <div key={product.ID} className={Styles.product}>
              <div className={Styles.product_content}>
                <p className={Styles.product_description}>
                  {product.Название} x {product.Количество}
                </p>
                <div className={Styles.quantity_controls}>
                  <p className={Styles.product_description}>
                    {(parseInt(product.Цена) * product.Количество).toFixed(0)}₽
                  </p>
                  <div className={Styles.quantity_buttons}>
                    <button
                      className={Styles.button_quantity}
                      onClick={() => incrementProductQuantity(product.Название)}
                    >
                      +
                    </button>
                    <button
                      className={Styles.button_quantity}
                      onClick={() => decrementProductQuantity(product.Название)}
                      disabled={product.Количество <= 1}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
              <button
                className={Styles.button_remove}
                onClick={() => removeProduct(product.Название)}
              >
                <p className={Styles.remove_text}>Удалить</p>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <ul className={Styles.empty_product}>
          <p className={Styles.empty_description}>В корзине нет товаров</p>
        </ul>
      )}
    </div>
  );
};
