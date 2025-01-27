"use client";

import React, { useState, useEffect } from "react";
import Styles from "./ReadyOrder.module.css";

export const ReadyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Функция для загрузки новых заказов
  const fetchReadyOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cour/readyOrdersGet",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setOrders(result.orders || []);
      } else {
        console.error("Ошибка от сервера:", result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error("Ошибка при получении заказов:", err);
      setError("Ошибка при загрузке заказов");
    }
  };

  useEffect(() => {
    fetchReadyOrders();
  }, []);

  // Функция для принятия заказа
  const acceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("authTokenAdmin");

      const response = await fetch(
        "http://localhost:5000/api/cour/acceptOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Ошибка при измене статуса заказа:", err);
    }
  };

  return (
    <div className={Styles.NewOrder}>
      {error && <p className={Styles.error}>{error}</p>}
      {orders.length > 0 ? (
        <ul className={Styles.ul_new_order}>
          {orders.map((order) => {
            return (
              <li key={order.orderId} className={Styles.li_new_order}>
                <div className={Styles.li_content_order}>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Номер заказа:{" "}
                    </strong>
                    <br />
                    {order.orderId}
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Пользователь:
                    </strong>
                    <br />
                    {order.userName} {order.userSurname} ({order.userEmail},{" "}
                    {order.userPhone})
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Дата заказа:
                    </strong>
                    <br />
                    {new Date(order.orderDate).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Время заказа:
                    </strong>
                    <br />
                    {order.orderTime.split(":").slice(0, 2).join(":")}
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Время доставки:
                    </strong>
                    <br />
                    {order.deliveryTime.split(":").slice(0, 2).join(":")}
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Адрес:
                    </strong>
                    <br />
                    {order.address}
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Способ оплаты:
                    </strong>
                    <br />
                    {order.paymentMethod}
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Стоимость заказа:
                    </strong>
                    <br />
                    {order.totalPrice} ₽
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Статус заказа:
                    </strong>
                    <br />
                    {order.status}
                  </p>
                  <p className={Styles.new_order_description}>
                    <strong className={Styles.new_order_description_h}>
                      Примечания к заказу:
                    </strong>
                    <br />
                    {order.comment}
                  </p>
                </div>
                <div className={Styles.new_order_foods}>
                  <p className={Styles.new_order_description_h}>Список блюд:</p>
                  <ul className={Styles.food_list}>
                    {order.foods.map((food, index) => {
                      return (
                        <li key={index} className={Styles.food_item}>
                          {food.foodName} — {food.quantity} шт.
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className={Styles.buttons}>
                  <button
                    className={Styles.button_accept}
                    onClick={() => acceptOrder(order.orderId)}
                  >
                    <p className={Styles.accept_text}>Принять</p>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className={Styles.ul_new_order}>
          <li className={Styles.li_new_order}>
            <p className={Styles.new_order_empty}>Сейчас нет готовых заказов</p>
          </li>
        </ul>
      )}
    </div>
  );
};
