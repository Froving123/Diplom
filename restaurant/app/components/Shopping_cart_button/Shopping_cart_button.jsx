"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Shopping_cart_button.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { DeliveryForm } from "../DeliveryForm/DeliveryForm";

export const Shopping_cart_button = () => {
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasItems, setHasItems] = useState(false);

  // Проверка наличия записей в корзине
  const fetchCartData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bucket/check-items",
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
          setTotal(result.totalPrice);
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

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleOrderClick = () => {
    if (hasItems) {
      setPopupIsOpen(true);
    }
  };

  return (
    <div className={Styles.shopping_cart_button}>
      {hasItems ? (
        <button className={Styles.order_button} onClick={handleOrderClick}>
          <p className={Styles.order_content}>Заказать</p>
          <p className={Styles.order_content}>{total.toFixed(0)}₽</p>
        </button>
      ) : (
        ""
      )}
      {popupIsOpen && (
        <>
          <Overlay isOpened={popupIsOpen} close={() => setPopupIsOpen(false)} />
          <Popup isOpened={popupIsOpen} close={() => setPopupIsOpen(false)}>
            <DeliveryForm close={() => setPopupIsOpen(false)} />
          </Popup>
        </>
      )}
    </div>
  );
};
