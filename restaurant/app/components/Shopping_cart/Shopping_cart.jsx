"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Shopping_cart.module.css";

export const Shopping_cart = () => {
  const [userProduct, setUserProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProduct(user.uid);
      } else {
        setUserProduct([]);
        setTotalPrice(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProduct = async (uid) => {
    const productRef = ref(db, "product");
    const userProductQuery = query(
      productRef,
      orderByChild("userId"),
      equalTo(uid)
    );

    try {
      await new Promise((resolve) => {
        onValue(userProductQuery, (snapshot) => {
          if (snapshot.exists()) {
            const product = [];
            snapshot.forEach((childSnapshot) => {
              product.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
                quantity: childSnapshot.val().quantity || 1,
              });
            });
            setUserProduct(product);
            calculateTotalPrice(product);
            resolve();
          } else {
            console.log("Данные не найдены");
            setTotalPrice(0);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Ошибка при получении данных: ", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      // Удаляем товар из базы данных
      await remove(ref(db, `product/${id}`));

      // Обновляем состояние userProduct, удаляя товар с заданным id
      const updatedProducts = userProduct.filter(
        (product) => product.id !== id
      );
      setUserProduct(updatedProducts);
      calculateTotalPrice(updatedProducts);
    } catch (error) {
      console.error("Ошибка при удалении товара: ", error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      // Обновляем количество товара в базе данных
      await update(ref(db, `product/${id}`), { quantity });

      // Обновляем состояние userProduct
      const updatedProducts = userProduct.map((product) =>
        product.id === id ? { ...product, quantity } : product
      );
      setUserProduct(updatedProducts);
      calculateTotalPrice(updatedProducts);
    } catch (error) {
      console.error("Ошибка при обновлении количества товара: ", error);
    }
  };

  const calculateTotalPrice = (products) => {
    const total = products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
    setTotalPrice(total);
  };

  return (
    <div className={Styles.shopping_cart}>
      {userProduct.length > 0 ? (
        <div className={Styles.ul_product}>
          {userProduct.map((product) => (
            <div key={product.id} className={Styles.product}>
              <div className={Styles.product_content}>
                <p className={Styles.product_description}>
                  {product.name} x {product.quantity}
                </p>
                <div className={Styles.quantity_controls}>
                  <p className={Styles.product_description}>
                    {parseInt(product.price) * product.quantity
                      ? (parseInt(product.price) * product.quantity).toFixed(
                          0
                        ) + "₽"
                      : ""}
                  </p>
                  <div className={Styles.quantity_buttons}>
                    <button
                      className={Styles.button_quantity}
                      onClick={() =>
                        updateQuantity(product.id, product.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className={Styles.button_quantity}
                      onClick={() =>
                        updateQuantity(product.id, product.quantity - 1)
                      }
                      disabled={product.quantity <= 1}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteItem(product.id)}
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
