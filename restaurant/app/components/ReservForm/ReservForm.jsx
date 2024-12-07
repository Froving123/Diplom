"use client";

import React, { useState, useEffect } from "react";
import Styles from "./ReservForm.module.css";

export const ReservForm = (props) => {
  const [newItem, setNewItem] = useState({
    date: "",
    time: "",
    people: "",
    table: "",
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllTables = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/reservation/tables",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setAvailableTables(result.tables);
        } else {
          setError(result.message || "Ошибка при получении всех столов");
          setTimeout(() => setError(""), 3000);
        }
      } catch (error) {
        console.error("Ошибка при получении всех столов:", error);
        setError("Ошибка при получении всех столов");
        setTimeout(() => setError(""), 3000);
      }
    };

    fetchAllTables();
  }, []);

  useEffect(() => {
    if (newItem.date && newItem.time) {
      const fetchAvailableTables = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/reservation/active-tables?date=${newItem.date}&time=${newItem.time}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const result = await response.json();
          if (response.ok) {
            setAvailableTables(result.tables);
          } else {
            setError(result.message || "Ошибка при получении доступных столов");
          }
        } catch (error) {
          console.error("Ошибка при получении доступных столов:", error);
          setError("Ошибка при получении доступных столов");
        }
      };

      fetchAvailableTables();
    }
  }, [newItem.date, newItem.time]); 

  const reserv = async (e) => {
    e.preventDefault();

    if (!newItem.date || !newItem.time || !newItem.people || !newItem.table) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/reservation/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: newItem.date,
            time: newItem.time,
            people: newItem.people,
            table: newItem.table,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Ошибка при бронировании");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setNewItem({ date: "", time: "", people: "", table: "" });
      alert("Бронирование успешно создано");
      props.close();
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      setError("Ошибка при бронировании");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleClear = () => {
    setNewItem({ date: "", time: "", people: "", table: "" });
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
            value={newItem.people}
            onChange={(e) => setNewItem({ ...newItem, people: e.target.value })}
          >
            <option value="">Сколько будет человек</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Выберите стол</span>
          <select
            className={Styles["form__field-input"]}
            disabled={availableTables.length === 0}
            value={newItem.table}
            onChange={(e) => setNewItem({ ...newItem, table: e.target.value })}
          >
            <option value="">Выберите стол</option>
            {availableTables.map((table) => (
              <option key={table.ID} value={table.ID}>
                {table.Наименование}
              </option>
            ))}
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
