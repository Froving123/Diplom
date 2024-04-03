"use client";

import React, { useState, useEffect } from "react";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { db, auth } from "@/app/firebase";
import Styles from "./Delivery_user.module.css";

export const Delivery_user = () => {
  const [userDelivery, setUserDelivery] = useState([]);

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

  return (
    <div className={Styles.reservation}>
    <h2 className={Styles.title_reserv}>Ваши заказа</h2>
    {userReservations.length > 0 ? (
      <ul className={Styles.ul_reserv}>
        {userDelivery.map((delivery) => (
          <li key={delivery.id}>
            <p className={Styles.reserv_description}>
              Дата: {delivery.date}
            </p>
            <p className={Styles.reserv_description}>
              Время: {delivery.time}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <ul className={Styles.empty_delivery}>
        <p className={Styles.empty_description}>Сейчас у вас нет заказов</p>
      </ul>
    )}
  </div>
  );
};