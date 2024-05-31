"use client";

import React, { useState, useEffect } from "react";
import {
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import { db, auth } from "@/app/firebase";
import Styles from "./Delivery_user.module.css";

export const Delivery_user = () => {
  const [userDelivery, setUserDelivery] = useState([]);
  const [userProduct, setUserProduct] = useState([]);

  useEffect(() => {
    const fetchUserDelivery = async () => {
      const user = auth.currentUser;
      if (user) {
        const deliveryRef = ref(db, "delivery");
        const userDeliveryQuery = query(
          deliveryRef,
          orderByChild("userId"),
          equalTo(user.uid)
        );

        try {
          const snapshot = await get(userDeliveryQuery);
          if (snapshot.exists()) {
            const delivery = [];
            snapshot.forEach((childSnapshot) => {
              delivery.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });
            setUserDelivery(delivery);
          } else {
            console.log("Данные не найдены");
          }
        } catch (error) {
          console.error("Ошибка при получении данных: ", error);
        }
      }
    };

    fetchUserDelivery();
  }, []);

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
                Оплата: При получении
              </p>
              <p className={Styles.delivery_description}>
                Стоимость заказа: {delivery.price}₽
              </p>
              <input
               className={Styles.delivery_box}
               type="checkbox"
              > 
              </input>
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
