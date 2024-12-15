"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Delivery_user.module.css";

export const Delivery_user = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState("");

  // Функция для загрузки заказов
  const fetchUserOrders = async () => {
    const token = localStorage.getItem("authToken"); // Получаем токен из localStorage

    if (!token) {
      setError("Вы не авторизованы. Пожалуйста, войдите в систему.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/order/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setUserOrders(result.orders || []); // Устанавливаем заказы
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
    fetchUserOrders();
  }, []);

  const removeOrder = async (orderId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Токен не найден");
      return;
    }

    const confirmDelete = window.confirm(
      "Вы уверены, что хотите отменить заказ?"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
      const response = await fetch("http://localhost:5000/api/order/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("Заказ успешно удален");
        await fetchUserOrders();
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Ошибка при удалении заказа:", err);
    }
  };

  return (
    <div className={Styles.Delivery}>
      <h2 className={Styles.title_delivery}>Ваши заказы</h2>
      {error && <p className={Styles.error}>{error}</p>}
      {userOrders.length > 0 ? (
        <ul className={Styles.ul_delivery}>
          {userOrders.map((order) => {
            return (
              <li key={order.orderId} className={Styles.li_delivery}>
                <div>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Дата заказа:{" "}
                    </strong>
                    <br></br>
                    {new Date(order.orderDate).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Время заказа:{" "}
                    </strong>
                    <br></br>
                    {order.orderTime.split(":").slice(0, 2).join(":")}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Адрес:{" "}
                    </strong>
                    <br></br>
                    {order.address}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Способ оплаты:{" "}
                    </strong>
                    <br></br>
                    {order.paymentMethod}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Стоимость заказа:{" "}
                    </strong>
                    <br></br> {order.totalPrice} ₽
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Статус заказа:{" "}
                    </strong>
                    <br></br>
                    {order.status}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Время доставки:{" "}
                    </strong>
                    <br></br>
                    {order.deliveryTime.split(":").slice(0, 2).join(":")}
                  </p>
                </div>
                <div className={Styles.delivery_ul_foods}>
                  <p className={Styles.delivery_description_h}>
                    Список блюд в заказе:
                  </p>
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
                <button
                  className={Styles.button_remove}
                  onClick={() => removeOrder(order.orderId)}
                >
                  <p className={Styles.remove_text}>Отменить</p>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className={Styles.ul_delivery}>
          <li className={Styles.li_delivery}>
            <p className={Styles.delivery_empty}>У вас нет заказов</p>
          </li>
        </ul>
      )}
    </div>
  );
};
