"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Delivery_user.module.css";

export const Delivery_user = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState("");

  // Функция для загрузки заказов
  const fetchUserOrders = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Вы не авторизованы. Пожалуйста, войдите в систему.");
      return;
    }

    try {
      const response = await fetch("/api/order/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setUserOrders(result.orders || []);
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
      const response = await fetch("/api/order/remove", {
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
        setUserOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
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
            const isOrderIssued =
              order.status === "Получен" || order.statusId === 5;

            return (
              <li
                key={order.orderId}
                className={`${Styles.li_delivery} ${
                  isOrderIssued ? Styles.li_no_cancel : Styles.li_with_cancel
                }`}
              >
                <div>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Номер заказа:{" "}
                    </strong>
                    <br />
                    {order.orderId}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Дата заказа:{" "}
                    </strong>
                    <br />
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
                    <br />
                    {order.orderTime.split(":").slice(0, 2).join(":")}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Адрес:{" "}
                    </strong>
                    <br />
                    {order.address}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Способ оплаты:{" "}
                    </strong>
                    <br />
                    {order.paymentMethod}
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Стоимость заказа:{" "}
                    </strong>
                    <br /> {order.totalPrice} ₽
                  </p>
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Статус заказа:{" "}
                    </strong>
                    <br />
                    {order.status}
                  </p>
                  {isOrderIssued === true && (
                    <p className={Styles.delivery_description}>
                      <strong className={Styles.delivery_description_h}>
                        Время доставки:{" "}
                      </strong>
                      <br />
                      {order.deliveryTime.split(":").slice(0, 2).join(":")}
                    </p>
                  )}
                  {!isOrderIssued && (
                    <p className={Styles.delivery_description}>
                      <strong className={Styles.delivery_description_h}>
                        Время доставки:{" "}
                      </strong>
                      <br />
                      около{" "}
                      {order.deliveryTime.split(":")[1]}{" "}
                      минут
                    </p>
                  )}
                  <p className={Styles.delivery_description}>
                    <strong className={Styles.delivery_description_h}>
                      Примечания к заказу:{" "}
                    </strong>
                    <br />
                    {order.comment}
                  </p>
                </div>
                <div className={Styles.delivery_ul_foods}>
                  <p className={Styles.delivery_description_h}>
                    Список блюд в заказе:
                  </p>
                  <ul className={Styles.food_list}>
                    {order.foods.map((food, index) => (
                      <li key={index} className={Styles.food_item}>
                        {food.foodName} — {food.quantity} шт.
                      </li>
                    ))}
                  </ul>
                </div>
                {!isOrderIssued && (
                  <button
                    className={Styles.button_remove}
                    onClick={() => removeOrder(order.orderId)}
                  >
                    <p className={Styles.remove_text}>Отменить</p>
                  </button>
                )}
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
