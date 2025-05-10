"use client";

import React, { useState, useEffect, useRef } from "react";
import Styles from "./ChangeDishForm.module.css";

export const ChangeDishForm = ({ close, dish }) => {
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Устанавливаем текущие данные блюда при открытии формы
  useEffect(() => {
    if (dish) {
      setPrice(dish.Цена_без_скидки.toString());
    }
  }, [dish]);

  const priceInput = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Удаляем все символы, кроме цифр
    if (value.length <= 4) {
      setPrice(value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем, изменилось ли хотя бы одно поле
    if (!price && !image) {
      setError("Пожалуйста, внесите изменения в цену или фото");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("dishId", dish.ID);
    if (price) {
      formData.append("price", price);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(
        "/api/contman/updateDish",
        {
          method: "POST",
          body: formData, // Отправляем FormData
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Ошибка при изменении блюда");
        setTimeout(() => setError(""), 3000);
        return;
      }

      alert("Блюдо успешно обновлено");
      close();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при изменении блюда:", error);
      setError("Ошибка при изменении блюда");
      setTimeout(() => setError(""), 3000);
    }
  };

  const resetForm = () => {
    setPrice(dish.Цена_без_скидки.toString());
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Сбрасываем значение в input
    }
  };

  return (
    <form className={Styles["form"]} onSubmit={handleSubmit}>
      <h2 className={Styles["form__title"]}>Изменение блюда</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Новое фото</span>
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
          <span className={Styles["form__field-title"]}>
            Новая цена (в рублях)
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
          type="button"
          onClick={resetForm}
        >
          Очистить
        </button>
        <button className={Styles["form__submit"]} type="submit">
          Изменить
        </button>
      </div>
    </form>
  );
};
