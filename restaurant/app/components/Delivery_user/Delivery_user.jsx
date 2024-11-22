"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Delivery_user.module.css";

export const Delivery_user = () => {
  const [userDelivery, setUserDelivery] = useState([]);
  const [userProduct, setUserProduct] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState({});

  return (
    <div className={Styles.Delivery}>
      <h2 className={Styles.title_delivery}>Ваши текущие заказы</h2>
      {userDelivery.length > 0 ? (
        <ul className={Styles.ul_delivery}>
          {userDelivery.map((delivery) => (
            <li key={delivery.id} className={Styles.li_delivery}>
              <p className={Styles.delivery_description}>
                Адрес: {delivery.address}
              </p>
              <p className={Styles.delivery_description}>
                Оплата: {delivery.payment}
              </p>
              <p className={Styles.delivery_description}>
                Стоимость заказа: {delivery.price}₽
              </p>
              <p className={Styles.delivery_description}>
                Статус заказа: {deliveryStatus[delivery.id] || "Готовится"}
              </p>
              <input className={Styles.delivery_box} type="checkbox"></input>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={Styles.ul_delivery}>
          <li className={Styles.li_delivery}>
            <p className={Styles.delivery_empty}>Сейчас у вас нет заказов</p>
          </li>
        </ul>
      )}
    </div>
  );
};
