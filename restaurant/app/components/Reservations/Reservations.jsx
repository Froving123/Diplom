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

  useEffect(() => {
    fetchUserReservations();
  }, []);

  const removeReserv = async (ReservId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("Токен не найден");
      return;
    }

    const confirmDelete = window.confirm(
      "Вы уверены, что хотите отменить бронирование?"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/reservation/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ReservId }),
        }
      );

      const result = await response.json();
      if (result.success) {
        await fetchUserReservations();
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Ошибка при отмене брони:", err);
    }
  };

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
                <strong className={Styles.reserv_description_h}>Дата: </strong>
                {new Date(reservation.Дата).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className={Styles.reserv_description}>
                <strong className={Styles.reserv_description_h}>Время: </strong>
                {reservation.Время.split(":").slice(0, 2).join(":")}
              </p>
              <p className={Styles.reserv_description}>
                <strong className={Styles.reserv_description_h}>
                  Количество человек:{" "}
                </strong>
                {reservation.Количество_человек}
              </p>
              <p className={Styles.reserv_description}>
                <strong className={Styles.reserv_description_h}>
                  Номер стола:{" "}
                </strong>
                {reservation.Номер_стола}
              </p>
              <button
                className={Styles.button_remove}
                onClick={() => removeReserv(reservation.ID)}
              >
                <p className={Styles.remove_text}>Отменить</p>
              </button>
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
