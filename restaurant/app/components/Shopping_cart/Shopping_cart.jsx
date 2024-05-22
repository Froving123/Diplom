"use client";

import React, { useState, useEffect } from "react";
import {
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  remove,
} from "firebase/database";
import { db, auth } from "@/app/firebase";
import Styles from "./Shopping_cart.module.css";

export const Shopping_cart = () => {
  const [userProduct, setUserProduct] = useState([]);

  useEffect(() => {
    const fetchUserProduct = async () => {
      const user = auth.currentUser;
      if (user) {
        const productRef = ref(db, "product");
        const userProductQuery = query(
          productRef,
          orderByChild("userId"),
          equalTo(user.uid)
        );

        try {
          const snapshot = await get(userProductQuery);
          if (snapshot.exists()) {
            const product = [];
            snapshot.forEach((childSnapshot) => {
              product.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });
            setUserProduct(product);
          } else {
            console.log("Данные не найдены");
          }
        } catch (error) {
          console.error("Ошибка при получении данных: ", error);
        }
      }
    };

    fetchUserProduct();
  }, []);

  const deleteItem = async (id) => {
    try {
      // Удаляем товар из базы данных
      await remove(ref(db, `product/${id}`));

      // Обновляем состояние userProduct, удаляя товар с заданным id
      const updatedProducts = userProduct.filter(
        (product) => product.id !== id
      );
      setUserProduct(updatedProducts);
    } catch (error) {
      console.error("Ошибка при удалении товара: ", error);
    }
  };

  return (
    <div className={Styles.shopping_cart}>
      {userProduct.length > 0 ? (
        <div className={Styles.ul_product}>
          {userProduct.map((product) => (
            <div key={product.id} className={Styles.product}>
              <div className={Styles.product_content}>
                <p className={Styles.product_description}>{product.name}</p>
                <p className={Styles.product_description}>{product.price}</p>
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
