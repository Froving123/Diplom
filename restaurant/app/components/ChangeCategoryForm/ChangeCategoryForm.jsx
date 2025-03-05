"use client";

import React, { useState, useEffect } from "react";
import Styles from "./ChangeCategoryForm.module.css";

export const ChangeCategoryForm = ({ close, category }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const russianInput = (input) => (e) => {
    const value = e.target.value.replace(/[^А-Яа-яЁё\s]/g, ""); // Разрешаем только русские буквы и пробелы
    const formattedValue = value.replace(/(^|\s)([а-яё])/g, (match) =>
      match.toUpperCase()
    ); // Делаем первую букву в слове заглавной
    input(formattedValue);
  };

  // Устанавливаем текущие данные категории при открытии формы
  useEffect(() => {
    if (category) {
      setName(category.Наименование.toString());
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Пожалуйста, заполните поле");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contman/updateCategory",
        {
          method: "POST", // Проверь, что на сервере этот маршрут обрабатывает POST (лучше использовать PUT)
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId: category.ID, name }), // Передаем ID категории
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Ошибка при изменении категории");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setName("");
      alert("Категория успешно обновлена");
      close();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при обновлении категории:", error);
      setError("Ошибка при обновлении категории");
      setTimeout(() => setError(""), 3000);
    }
  };

  const resetForm = () => {
    setName(category.Наименование.toString());
  };

  return (
    <form className={Styles["form"]} onSubmit={handleSubmit}>
      <h2 className={Styles["form__title"]}>Изменение категории</h2>
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
          type="button"
          onClick={resetForm}
        >
          Очистить
        </button>
        <button type="submit" className={Styles["form__submit"]}>
          Изменить
        </button>
      </div>
    </form>
  );
};
