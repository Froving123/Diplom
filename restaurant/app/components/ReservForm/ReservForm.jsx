"use client";

import React, { useState } from "react";
import Styles from "./ReservForm.module.css";
import { ref, push, set } from "firebase/database";
import { db, auth } from "../../firebase";

export const ReservForm = (props) => {
  const [newItem, setNewItem] = useState({ date: "", time: "" });
  const [error, setError] = useState("");

  const reserv = async (e) => {
    e.preventDefault();
    if (!newItem.date || !newItem.time) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      try {
        const user = auth.currentUser; // Получаем текущего пользователя
        if (user) {
          // Генерируем новый ключ
          const newItemRef = push(ref(db, "reserv"));
          const newItemKey = newItemRef.key;
          // Создаем объект с данными для записи
          const newItemData = {
            date: newItem.date,
            time: newItem.time,
            userId: user.uid, // Сохраняем идентификатор пользователя
          };
          // Записываем данные по новому ключу
          await set(ref(db, `reserv/${newItemKey}`), newItemData);
          setNewItem({ date: "", time: "" });
          setError("");
          props.close();
          alert("Ваша бронь принята");
        }
      } catch (error) {
        console.error("Ошибка при добавлении документа: ", error);
      }
    }
  };

  const handleClear = () => {
    setNewItem({ date: "", time: "" });
  };

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Бронирование</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Дата</span>
          <input
            className={Styles["form__field-input"]}
            type="date"
            value={newItem.date}
            onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Время</span>
          <input
            className={Styles["form__field-input"]}
            type="time"
            value={newItem.time}
            onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
          />
        </label>
      </div>
      {error && <p className={Styles.error_message}>{error}</p>}
      <div className={Styles["form__actions"]}>
        <button
          className={Styles["form__reset"]}
          type="reset"
          onClick={handleClear}
        >
          Очистить
        </button>
        <button onClick={reserv} className={Styles["form__submit"]}>
          Забронировать
        </button>
      </div>
    </form>
  );
};
