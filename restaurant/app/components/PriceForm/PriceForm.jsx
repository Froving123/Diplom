"use client";

import React, { useState } from "react";
import Styles from "./PriceForm.module.css";

export const PriceForm = ({ close, dish }) => {
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const priceInput = (input) => (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Удаляем все символы, кроме цифр
    if (value.length <= 5) {
      input(value);
    }
  };

  const priceChange = async (e) => {
    e.preventDefault();

    if (!price) {
      setError("Пожалуйста, введите цену");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contman/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dishId: dish.ID, // Идентификатор выбранного блюда
          price,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Ошибка при изменении");
        setTimeout(() => setError(""), 3000);
        return;
      }

      alert("Цена успешно изменена");
      close();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при изменении цены:", error);
      setError("Ошибка при изменении цены");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Изменение цены</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Новая цена (в рублях)</span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={price}
            onChange={priceInput(setPrice)}
          />
        </label>
        <div className={Styles.price}>
          <p className={Styles.price_content}>Текущая цена</p>
          <p className={Styles.price_content}>
            {dish ? `${dish.Цена_без_скидки}₽` : "Неизвестно"}
          </p>
        </div>
      </div>
      {error && <p className={Styles.error_message}>{error}</p>}
      <div className={Styles["form__actions"]}>
        <button
          className={Styles["form__reset"]}
          type="reset"
          onClick={() => setPrice("")}
        >
          Очистить
        </button>
        <button onClick={priceChange} className={Styles["form__submit"]}>
          Изменить
        </button>
      </div>
    </form>
  );
};  
