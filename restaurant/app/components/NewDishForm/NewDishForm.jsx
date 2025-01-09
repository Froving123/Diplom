"use client";

import React, { useState, useEffect, useRef } from "react";
import Styles from "./NewDishForm.module.css";

export const NewDishForm = ({ close }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [availableCategory, setAvailableCategory] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const priceInput = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Удаляем все символы, кроме цифр
    if (value.length <= 4) {
      setPrice(value);
    }
  };

  const russianInput = (input) => (e) => {
    const value = e.target.value.replace(/[^А-Яа-яЁё\s]/g, ""); // Разрешаем только русские буквы и пробелы
    const formattedValue = value.replace(/(^|\s)([а-яё])/g, (match) =>
      match.toUpperCase()
    ); // Делаем первую букву в слове заглавной
    input(formattedValue);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    const fetchAllCatogories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/contman/categories",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setAvailableCategory(result.categories); // Здесь исправлено
        } else {
          setError(result.message || "Ошибка при получении категорий");
          setTimeout(() => setError(""), 3000);
        }
      } catch (error) {
        console.error("Ошибка при получении категорий:", error);
        setError("Ошибка при получении категорий");
        setTimeout(() => setError(""), 3000);
      }
    };

    fetchAllCatogories(); // Вызываем функцию получения категорий
  }, []); // Добавляем пустой массив зависимостей

  const addDish = async (e) => {
    e.preventDefault();

    if (!image || !name || !price || !category) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const formData = new FormData();
    if (price) {
      formData.append("price", price);
    }
    if (image) {
      formData.append("image", image);
    }
    if (name) {
      formData.append("name", name);
    }
    if (category) {
      formData.append("category", category);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contman/addDish",
        {
          method: "POST",
          body: formData, // Отправляем FormData
        }
      );

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

  const handleClear = () => {
    setImage(null), setName(""), setPrice(""), setCategory("");
  };

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Добавление блюда</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Фото блюда</span>
          <div className={Styles["form__input-wrapper"]}>
            <input
              className={Styles["form__field-input-file"]}
              type="text"
              readOnly
              value={image ? image.name : "Файл не выбран"} // Отображение имени файла
            />
            <button
              type="button" // Предотвращаем отправку формы
              className={Styles["form__file"]}
              onClick={() => fileInputRef.current.click()}
            >
              Выберите файл
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Название блюда</span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={name}
            onChange={russianInput(setName)}
          />
        </label>
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
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Категория блюда</span>
          <select
            className={Styles["form__field-input"]}
            disabled={availableCategory.length === 0}
            value={category}
            onChange={(e) => setCategory(e.target.value)} // Извлекаем значение из события
          >
            <option value="">Выберите категорию</option>
            {availableCategory.map((category) => (
              <option key={category.ID} value={category.ID}>
                {category.Наименование}
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
        <button onClick={addDish} className={Styles["form__submit"]}>
          Добавить
        </button>
      </div>
    </form>
  );
};
