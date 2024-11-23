"use client";

import React, { useState } from "react";
import Styles from "./ReservForm.module.css";

export const ReservForm = (props) => {
  const [newItem, setNewItem] = useState({
    date: "",
    time: "",
    people: "",
    number: "",
  });
  const [error, setError] = useState("");

  const reserv = async (e) => {
    e.preventDefault();
    if (!newItem.date || !newItem.time || !newItem.people || !newItem.number) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
      return; // Не продолжаем выполнение, если поля не заполнены
    }

    const token = localStorage.getItem("authToken"); // Получаем токен из localStorage
   
    fetch("http://localhost:5000/api/reservation/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
      },
      body: JSON.stringify({
        date: newItem.date,
        time: newItem.time,
        people: newItem.people,
        number: newItem.number,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) {
          setError(result.message || "Ошибка при бронировании");
          setTimeout(() => {
            setError("");
          }, 3000);
          return;
        }

        // Очищаем формы
        setNewItem({ date: "", time: "", people: "", number: "" });
        alert("Бронирование успешно создано");
        props.close();
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных на сервер:", error);
        setError("Ошибка при бронировании");
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  const handleClear = () => {
    setNewItem({ date: "", time: "", people: "", number: "" });
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
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>
            Количество человек
          </span>
          <select
            className={Styles["form__field-input"]}
            value={newItem.people} // Устанавливаем значение из состояния
            onChange={(e) => setNewItem({ ...newItem, people: e.target.value })} // Обновляем значение
          >
            <option value="">Сколько будет человек</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
          </select>
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Номер стола</span>
          <select
            className={Styles["form__field-input"]}
            value={newItem.number}
            onChange={(e) => setNewItem({ ...newItem, number: e.target.value })}
          >
            <option value="">Выберите стол</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
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
