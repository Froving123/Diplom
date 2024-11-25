"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Reservations.module.css";

export const UserReservations = () => {
  const [userReservations, setUserReservations] = useState([]);
  const [error, setError] = useState("");

  // Функция для загрузки бронирований
  const fetchUserReservations = async () => {
    const token = localStorage.getItem("authToken"); // Получаем токен из localStorage

    if (!token) {
      setError("Вы не авторизованы. Пожалуйста, войдите в систему.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/reservation/user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setUserReservations(result.reservations || []); // Устанавливаем бронирования
      } else {
        setError(result.message || "Ошибка при загрузке бронирований");
      }
    } catch (err) {
      console.error("Ошибка при получении бронирований:", err);
      setError("Ошибка при загрузке бронирований");
    }
  };

  // Загружаем бронирования при монтировании компонента
  useEffect(() => {
    fetchUserReservations();
  }, []);

  return (
    <div className={Styles.reservation}>
      <h2 className={Styles.title_reserv}>Ваше бронирование</h2>
      {error && <p className={Styles.error}>{error}</p>}
      {userReservations.length > 0 ? (
        <ul className={Styles.ul_reserv}>
          {userReservations.map((reservation) => (
            <li key={reservation.ID} className={Styles.li_reserv}>
              <p className={Styles.reserv_description}>
                Дата:{" "}
                {new Date(reservation.Дата).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className={Styles.reserv_description}>
                Время: {reservation.Время}
              </p>
              <p className={Styles.reserv_description}>
                Количество человек: {reservation.Количество_человек}
              </p>
              <p className={Styles.reserv_description}>
                Номер стола: {reservation.Номер_стола}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={Styles.ul_reserv}>
          <li className={Styles.li_reserv}>
            <p className={Styles.reserv_empty}>У вас нет бронирования</p>
          </li>
        </ul>
      )}
    </div>
  );
};
