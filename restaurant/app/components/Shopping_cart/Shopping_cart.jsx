"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Shopping_cart.module.css";
import axios from "axios"; // Используем axios для HTTP-запросов

export const Shopping_cart = () => {
  const [userProduct, setUserProduct] = useState([]);

  // Получение данных о корзине с сервера
  const fetchUserProduct = async () => {
    const token = localStorage.getItem("authToken"); // Получаем токен пользователя (например, из localStorage)

    if (!token) {
      console.log("Токен не найден");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/bucket/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const products = response.data.data;
        setUserProduct(products);
      } else {
        console.log("Ошибка при получении корзины");
      }
    } catch (error) {
      console.error("Ошибка при получении данных о корзине:", error);
    }
  };

  // Удаление товара из корзины
  const deleteItem = async (ID) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("Токен не найден");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/bucket/user/${ID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Обновляем корзину после удаления
      const updatedProducts = userProduct.filter(
        (product) => product.ID !== ID
      );
      setUserProduct(updatedProducts);
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
    }
  };

  // Обновление количества товара в корзине
  const updateQuantity = async (ID, Количество) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("Токен не найден");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/bucket/user/${ID}`,
        { Количество },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Обновляем список продуктов после изменения количества
      const updatedProducts = userProduct.map((product) =>
        product.ID === ID ? { ...product, Количество } : product
      );
      setUserProduct(updatedProducts);
    } catch (error) {
      console.error("Ошибка при обновлении количества товара:", error);
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
                    {parseInt(product.Цена) * product.Количество
                      ? (parseInt(product.Цена) * product.Количество).toFixed(
                          0
                        ) + "₽"
                      : ""}
                  </p>
                  <div className={Styles.quantity_buttons}>
                    <button
                      className={Styles.button_quantity}
                      onClick={() =>
                        updateQuantity(product.ID, product.Количество + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className={Styles.button_quantity}
                      onClick={() =>
                        updateQuantity(product.ID, product.Количество - 1)
                      }
                      disabled={product.Количество <= 1}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteItem(product.ID)}
                className={Styles.button_remove}
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
