"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Delivery_user.module.css";

export const Delivery_user = () => {
  const [userDelivery, setUserDelivery] = useState([]);
  const [userProduct, setUserProduct] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState({});

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
            const initialStatus = {};
            snapshot.forEach((childSnapshot) => {
              const deliveryItem = {
                id: childSnapshot.key,
                ...childSnapshot.val(),
              };
              delivery.push(deliveryItem);
              initialStatus[deliveryItem.id] = "Готовится";
            });
            setUserDelivery(delivery);
            setDeliveryStatus(initialStatus);
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

  useEffect(() => {
    const intervalIds = {};

    const changeDeliveryStatus = () => {
      Object.keys(deliveryStatus).forEach((key) => {
        if (deliveryStatus[key] === "Готовится") {
          intervalIds[key] = setTimeout(() => {
            setDeliveryStatus((prevState) => ({
              ...prevState,
              [key]: "В пути",
            }));
            setTimeout(() => {
              setDeliveryStatus((prevState) => ({
                ...prevState,
                [key]: "Доставлен",
              }));
            }, 3600000);
          }, 900000);
        }
      });
    };

    changeDeliveryStatus();

    return () => {
      Object.values(intervalIds).forEach((id) => clearTimeout(id));
    };
  }, [deliveryStatus]);

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
