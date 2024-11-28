"use client";

import React, { useEffect, useState } from "react";
import Styles from "./AuthDetails.module.css";
import { UserReservations } from "../Reservations/Reservations";
import { Delivery_user } from "../Delivery_user/Delivery_user";
import Link from "next/link";

export const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Получаем токен из localStorage
    const token = localStorage.getItem("authToken");

    if (token) {
      // Отправляем запрос на сервер, чтобы получить данные пользователя
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
            localStorage.removeItem("authToken");
          }
        })
        .catch((err) => {
          console.error("Ошибка при получении данных пользователя:", err);
          setAuthUser(null);
          localStorage.removeItem("authToken");
        });
    } else {
      setAuthUser(null); // Если токен отсутствует, сбрасываем состояние
    }
  }, []);

  const userSignOut = () => {
    localStorage.removeItem("authToken"); // Удаляем токен из localStorage
    setAuthUser(null); // Обновляем состояние
    window.location.href = "/";
  };

  return (
    <div className={Styles.str_profile}>
      {authUser ? (
        <div className={Styles.profile}>
          <p className={Styles.user}>{`Здравствуйте, ${authUser.name}`}</p>
          <UserReservations />
          <Delivery_user />
          <Link href="/">
            <button className={Styles.button_logOut} onClick={userSignOut}>
              Выйти
            </button>
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
