"use client";

import React, { useState, useEffect } from "react";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
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

  return (
    <div className={Styles.shopping_cart}>
      {userProduct.length > 0 ? (
        <ul className={Styles.ul_product}>
          {userProduct.map((product) => (
            <li key={product.id} className={Styles.product}>
              <p className={Styles.product_description}>{product.name}</p>
              <p className={Styles.product_description}>{product.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={Styles.empty_product}>
          <p className={Styles.empty_description}>В корзине нет товаров</p>
        </ul>
      )}
    </div>
  );
};
