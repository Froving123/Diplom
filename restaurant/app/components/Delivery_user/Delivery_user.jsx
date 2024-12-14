"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Delivery_user.module.css";

export const Delivery_user = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState("");

  // Функция для загрузки заказов
  const fetchUserOrders = async () => {
    const token = localStorage.getItem("authToken"); // Получаем токен из localStorage
    console.log("Токен авторизации:", token); // Логирование токена (если нужно)

    if (!token) {
      setError("Вы не авторизованы. Пожалуйста, войдите в систему.");
      return;
    }

    try {
      console.log("Отправляем запрос для получения заказов...");
      const response = await fetch("http://localhost:5000/api/order/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("Ответ от сервера:", result); // Логируем ответ сервера

      if (response.ok) {
        console.log("Заказы успешно загружены:", result.orders); // Логирование заказов
        setUserOrders(result.orders || []); // Устанавливаем заказы
      } else {
        console.error("Ошибка от сервера:", result.message); // Логируем ошибку с сервера
        setError(result.message);
      }
    } catch (err) {
      console.error("Ошибка при получении заказов:", err); // Логирование ошибки
      setError("Ошибка при загрузке заказов");
    }
  };

  useEffect(() => {
    fetchUserOrders(); // Загрузка заказов при монтировании компонента
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
      // Отправляем запрос на сервер для удаления заказа
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
        // При успешном удалении обновляем данные пользователя (например, список заказов)
        await fetchUserOrders(); // Функция для обновления списка заказов
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
            console.log("Обрабатываем заказ:", order.orderId); // Логируем ID каждого заказа
            console.log("Блюда для заказа:", order.foods); // Логируем блюда заказа

            return (
              <li key={order.orderId} className={Styles.li_delivery}>
                <p className={Styles.delivery_description}>
                  Дата заказа:{" "}
                  {new Date(order.orderDate).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className={Styles.delivery_description}>
                  Время заказа: {order.orderTime}
                </p>
                <p className={Styles.delivery_description}>
                  Адрес: {order.address}
                </p>
                <p className={Styles.delivery_description}>
                  Способ оплаты: {order.paymentMethod}
                </p>
                <p className={Styles.delivery_description}>
                  Стоимость заказа: {order.totalPrice} ₽
                </p>
                <p className={Styles.delivery_description}>Список блюд:</p>
                <ul className={Styles.food_list}>
                  {order.foods.map((food, index) => {
                    return (
                      <li key={index} className={Styles.food_item}>
                        {food.foodName} — {food.quantity} шт.
                      </li>
                    );
                  })}
                </ul>
                <p className={Styles.delivery_description}>
                  Статус заказа: {order.status}
                </p>
                <p className={Styles.delivery_description}>
                  Время доставки: {order.deliveryTime}
                </p>
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
