"use client";

import React, { useEffect, useState } from "react";
import Styles from "./AuthDetails.module.css";
import Reservations from "../Reservations/Reservations";
import Delivery_user from "../Delivery_user/Delivery_user";

 export const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Проверка токена в localStorage при загрузке компонента
    const token = localStorage.getItem("authToken");
    if (token) {
      // Имитация получения информации о пользователе по токену
      fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setAuthUser(data.user); // Устанавливаем информацию о пользователе
          } else {
            setAuthUser(null);
            localStorage.removeItem("authToken"); // Убираем невалидный токен
          }
        })
        .catch((err) => {
          console.error("Ошибка при проверке токена:", err);
          setAuthUser(null);
          localStorage.removeItem("authToken");
        });
    }
  }, []);

  const userSignOut = () => {
    localStorage.removeItem("authToken"); // Удаляем токен из localStorage
    setAuthUser(null); // Обновляем состояние
    router.push("/"); // Перенаправляем на главную страницу
  };
  return (
    <div className={Styles.str_profile}>
      {authUser ? (
        <div className={Styles.profile}>
          <p className={Styles.user}>{`Здравствуйте, ${
            authUser.name || authUser.email
          }`}</p>
          <Reservations />
          <Delivery_user />
          <Link href="/">
            <button className={Styles.button_logOut} onClick={userSignOut}>
              Выйти
            </button>
          </Link>
        </div>
      ) : (
        <p>Вы не авторизованы.</p>
      )}
    </div>
  );
};