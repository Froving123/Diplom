"use client";

import React, { useState } from "react";
import Styles from "./NewCategoryForm.module.css";

export const NewCategoryForm = (props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const russianInput = (input) => (e) => {
    const value = e.target.value.replace(/[^А-Яа-яЁё\s]/g, ""); // Разрешаем только русские буквы и пробелы
    const formattedValue = value.replace(/(^|\s)([а-яё])/g, (match) =>
      match.toUpperCase()
    ); // Делаем первую букву в слове заглавной
    input(formattedValue);
  };

  const addCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Пожалуйста, заполните поле");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
       const response = await fetch(
        "http://localhost:5000/api/contman/addCategory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Ошибка при добавлении категории");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setName("");
      alert("Категория успешно добавлена");
      props.close();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при добавлении категории:", error);
      setError("Ошибка при добавлении категории");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleClear = () => {
    setName("");
  };

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Добавление категории</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>
            Название категории
          </span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={name}
            onChange={russianInput(setName)}
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
        <button onClick={addCategory} className={Styles["form__submit"]}>
          Добавить
        </button>
      </div>
    </form>
  );
};
