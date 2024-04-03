"use client";

import React, { useState, useEffect } from "react";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import Styles from "../Shopping_cart/Shopping_cart.module.css";
import { db, auth } from "@/app/firebase";

export const Shopping_cart_button = () => {
  const [userProduct, setUserProduct] = useState([]);
  const [total, setTotal] = useState(0);

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

  const calculateTotal = () => {
    const totalPrice = userProduct.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );
    setTotal(totalPrice); // Обновляем состояние суммы
  };

  // Вызываем функцию подсчета суммы при изменении userProduct
  useEffect(() => {
    calculateTotal();
  }, [userProduct]);

  return (
    <div className={Styles.shopping_cart}>
      {userProduct.length > 0 ? (
        <div>
          <p>Заказать</p>
          <p>{total}₽</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
