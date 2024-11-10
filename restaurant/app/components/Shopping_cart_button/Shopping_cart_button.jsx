"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Shopping_cart_button.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { DeliveryForm } from "../DeliveryForm/DeliveryForm";

export const Shopping_cart_button = () => {
  const [userProduct, setUserProduct] = useState([]);
  const [total, setTotal] = useState(0);
  const [popupIsOpened, setPopupIsOpened] = useState(false);

  /*useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProduct(user.uid);
      } else {
        setUserProduct([]);
        setTotal(0);
      }
    });

    return () => unsubscribe();
  }, []);*/

  const fetchUserProduct = async (uid) => {
    const productRef = ref(db, "product");
    const userProductQuery = query(
      productRef,
      orderByChild("userId"),
      equalTo(uid)
    );

    try {
      onValue(userProductQuery, (snapshot) => {
        if (snapshot.exists()) {
          const product = [];
          snapshot.forEach((childSnapshot) => {
            const price = parseInt(childSnapshot.val().price) || 0;
            const quantity = parseInt(childSnapshot.val().quantity) || 1;
            product.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
              price: price,
              quantity: quantity,
            });
          });
          setUserProduct(product);
          calculateTotal(product);
        } else {
          setUserProduct([]);
          setTotal(0);
        }
      });
    } catch (error) {
      console.error("Ошибка при получении данных: ", error);
    }
  };

  const calculateTotal = (products) => {
    const totalPrice = products.reduce((sum, item) => {
      const price = parseInt(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);
    setTotal(totalPrice);
  };

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
          <p className={Styles.order_content}>{total.toFixed(0)}₽</p>
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
