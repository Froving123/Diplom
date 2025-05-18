"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Reserv.module.css";

export const Reserv = () => {
  const [reserv, setReserv] = useState([]);
  const [error, setError] = useState("");

  // Получение всех отзывов
  const fetchReserv = async () => {
    try {
       const response = await fetch(
        "http://localhost:5000/api/reservman/reservGet",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setReserv(result.data);
      } else {
        setError(result.message || "Ошибка при загрузке бронирований");
      }
    } catch (err) {
      setError("Ошибка при загрузке бронирований");
      console.error(err);
    }
  };

  // Удаление брони
  const deleteReserv = async (reservId) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите отменить эту бронь?"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
       const response = await fetch(
        "http://localhost:5000/api/reservman/reservDelete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reservId }),
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchReserv();
      } else {
        setError(result.message || "Ошибка при удалении брони");
      }
    } catch (err) {
      setError("Ошибка при удалении брони");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReserv();
  }, []);

  return (
    <div className={Styles.reserv_container}>
      {error && <p className={Styles.error_message}>{error}</p>}
      {reserv.length > 0 ? (
        <ul className={Styles.reserv_list}>
          {reserv.map((reserv) => (
            <li key={reserv.reservId} className={Styles.reserv_item}>
              <div className={Styles.reserv_text}>
                <p className={Styles.reserv_description}>
                  <strong className={Styles.reserv_description_h}>
                    Дата:{" "}
                  </strong>
                  {new Date(reserv.reservDate).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className={Styles.reserv_description}>
                  <strong className={Styles.reserv_description_h}>
                    Время:{" "}
                  </strong>
                  {reserv.reservTime.split(":").slice(0, 2).join(":")}
                </p>
                <p className={Styles.reserv_description}>
                  <strong className={Styles.reserv_description_h}>
                    Количество человек:{" "}
                  </strong>
                  {reserv.people}
                </p>
                <p className={Styles.reserv_description}>
                  <strong className={Styles.reserv_description_h}>
                    Номер стола:{" "}
                  </strong>
                  {reserv.tableNumber}
                </p>
                <p className={Styles.reserv_description}>
                  <strong className={Styles.reserv_description_h}>
                    Пользователь:
                  </strong>
                  <br />
                  {reserv.userName} {reserv.userSurname} ({reserv.userEmail},{" "}
                  {reserv.userPhone})
                </p>
              </div>
              <div className={Styles.reserv_controls}>
                <button
                  className={Styles.reserv_button_delete}
                  onClick={() => deleteReserv(reserv.reservId)}
                >
                  <p className={Styles.button_text}> Отменить</p>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={Styles.reserv_empty_state}>
          <p className={Styles.reserv_empty_text}>
            Нет действующих бронирований
          </p>
        </div>
      )}
    </div>
  );
};
