"use client";

import React, { useState, useEffect } from "react";
import { ref, query, orderByChild, equalTo, onValue } from "firebase/database";
import Styles from "./Shopping_cart_button.module.css";
import { db, auth } from "@/app/firebase";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { DeliveryForm } from "../DeliveryForm/DeliveryForm";

export const Shopping_cart_button = () => {
  const [userProduct, setUserProduct] = useState([]);
  const [total, setTotal] = useState(0);
  const [popupIsOpened, setPopupIsOpened] = useState(false);

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
          onValue(userProductQuery, (snapshot) => {
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
          });
        } catch (error) {
          console.error("Ошибка при получении данных: ", error);
        }
      }
    };

    fetchUserProduct();
  }, []);

  // Обновляем значение total при изменении userProduct
  useEffect(() => {
    const totalPrice = userProduct.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );
    setTotal(totalPrice); // Обновляем состояние суммы
  }, [userProduct]);

  const openPopup = () => {
    setPopupIsOpened(true);
  };

  const closePopup = () => {
    setPopupIsOpened(false);
  };

  return (
    <div className={Styles.shopping_cart_button}>
      {userProduct.length > 0 ? (
        <button className={Styles.order_button} onClick={openPopup}>
          <p className={Styles.order_content}>Заказать</p>
          <p className={Styles.order_content}>{total}₽</p>
        </button>
      ) : (
        ""
      )}
      <Overlay isOpened={popupIsOpened} close={closePopup} />
      <Popup isOpened={popupIsOpened} close={closePopup}>
        <DeliveryForm close={closePopup} />
      </Popup>
    </div>
  );
};
