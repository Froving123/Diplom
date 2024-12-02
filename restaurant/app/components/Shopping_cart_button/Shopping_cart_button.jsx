"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/CartContext";
import Styles from "./Shopping_cart_button.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { DeliveryForm } from "../DeliveryForm/DeliveryForm";

export const Shopping_cart_button = () => {
  const { hasItems, totalPrice, updateCart } = useCart();
  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const handleOrderClick = () => {
    if (hasItems) {
      setPopupIsOpen(true);
    }
  };

  useEffect(() => {
    updateCart(); // Обновление данных корзины при монтировании
  }, [updateCart]);

  return (
    <div className={Styles.shopping_cart_button}>
      {hasItems ? (
        <button className={Styles.order_button} onClick={handleOrderClick}>
          <p className={Styles.order_content}>Заказать</p>
          <p className={Styles.order_content}>{totalPrice.toFixed(0)}₽</p>
        </button>
      ) : null}
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
