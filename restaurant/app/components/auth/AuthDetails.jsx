"use client";

import React, { useEffect, useState } from "react";
import Styles from "./AuthDetails.module.css";
import { UserReservations } from "../Reservations/Reservations";
import { Delivery_user } from "../Delivery_user/Delivery_user";

export const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Отправляем запрос на сервер, чтобы получить данные пользователя
      fetch("/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setAuthUser(data.user);
          } else {
            localStorage.removeItem("authToken");
            setAuthUser(null);
            window.location.href = "/"; // Перенаправление на главную страницу
          }
        })
        .catch((err) => {
          console.error("Ошибка при получении данных пользователя:", err);
          localStorage.removeItem("authToken");
          setAuthUser(null);
          window.location.href = "/"; // Перенаправление на главную страницу
        });
    } else {
      setAuthUser(null);
      window.location.href = "/"; // Перенаправление на главную страницу
    }
  }, []);

  const userSignOut = () => {
    localStorage.removeItem("authToken");
    setAuthUser(null);
    window.location.href = "/"; // Перенаправление на главную страницу
  };

  return (
    <div className={Styles.str_profile}>
      {authUser ? (
        <div className={Styles.profile}>
          <p className={Styles.user}>{`Здравствуйте, ${authUser.name}`}</p>
          <UserReservations />
          <Delivery_user />
          <button className={Styles.button_logOut} onClick={userSignOut}>
            Выйти
          </button>
        </div>
      ) : (
        <p className={Styles.noUser}>Вы не авторизованы</p>
      )}
    </div>
  );
};
