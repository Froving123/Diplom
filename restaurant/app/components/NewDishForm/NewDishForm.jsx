"use client";

import React, { useState } from "react";
import Styles from "./NewDishForm.module.css";

export const NewDishForm = ({ close }) => {
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const priceInput = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Удаляем все символы, кроме цифр
    if (value.length <= 4) {
      setPrice(value);
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
        body: JSON.stringify({ price }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Ошибка при добавлении блюда");
        setTimeout(() => setError(""), 3000);
        return;
      }

      alert("Блюдо успешно добавлено");
      close();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при добавлении блюда:", error);
      setError("Ошибка при добавлении блюда");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Добавление блюда</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>
            Цена блюда (в рублях)
          </span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={price}
            onChange={priceInput}
          />
        </label>
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
          Добавить
        </button>
      </div>
    </form>
  );
};
