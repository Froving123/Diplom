"use client";

import React, { useState, useEffect } from "react";
import Styles from "./CreateOfferForm.module.css";

export const CreateOfferForm = (props) => {
  const [newOffer, setNewOffer] = useState({
    description: "",
    dish: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [availableDishes, setAvailableDishes] = useState([]);
  const [error, setError] = useState("");

  const today = new Date();
  const minStartDate = today.toISOString().split("T")[0]; // Сегодняшняя дата
  const maxStartDate = new Date(today.setMonth(today.getMonth() + 1))
    .toISOString()
    .split("T")[0]; // Через месяц от сегодняшнего дня

  // Определяем maxEndDate динамически
  const maxEndDate = newOffer.startDate
    ? new Date(
        new Date(newOffer.startDate).setMonth(
          new Date(newOffer.startDate).getMonth() + 1
        )
      )
        .toISOString()
        .split("T")[0]
    : maxStartDate;

  useEffect(() => {
    const fetchActiveDish = async () => {
      try {
        const response = await fetch(
          "/api/Contman/dishOffer",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setAvailableDishes(result.dishes);
        } else {
          setError(result.message || "Ошибка при получении всех блюд");
          setTimeout(() => setError(""), 3000);
        }
      } catch (error) {
        console.error("Ошибка при получении всех блюд:", error);
        setError("Ошибка при получении всех блюд");
        setTimeout(() => setError(""), 3000);
      }
    };

    fetchActiveDish();
  }, []);

  const createOffer = async (e) => {
    e.preventDefault();

    if (
      !newOffer.description ||
      !newOffer.dish ||
      !newOffer.discount ||
      !newOffer.startDate ||
      !newOffer.endDate
    ) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
       const response = await fetch(
        "http://localhost:5000/api/contman/offerCreate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOffer),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Ошибка при создании спецпредложения");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setNewOffer({
        description: "",
        dish: "",
        discount: "",
        startDate: "",
        endDate: "",
      });
      alert("Специальное предложение успешно создано");
      props.close();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при создании спецпредложения:", error);
      setError("Ошибка при создании спецпредложения");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleClear = () => {
    setNewOffer({
      description: "",
      dish: "",
      discount: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Создание спецпредложения</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>
            Описание (50 символов)
          </span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={newOffer.description}
            maxLength="50"
            onChange={(e) => {
              const description = e.target.value;
              if (!/^[а-яА-ЯёЁ\s]*$/.test(description)) {
                setTimeout(() => setError(""), 3000);
              } else {
                setNewOffer({ ...newOffer, description });
              }
            }}
            placeholder="Введите описание (макс. 50 символов)"
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Блюдо</span>
          <select
            className={Styles["form__field-input"]}
            value={newOffer.dish}
            onChange={(e) => setNewOffer({ ...newOffer, dish: e.target.value })}
          >
            <option value="">Выберите блюдо</option>
            {availableDishes.map((dish) => (
              <option key={dish.ID} value={dish.ID}>
                {dish.Название}
              </option>
            ))}
          </select>
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>
            Размер скидки (в рублях)
          </span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={newOffer.discount}
            maxLength="3"
            onChange={(e) => {
              const discount = e.target.value;
              if (!/^\d*$/.test(discount)) {
                setTimeout(() => setError(""), 3000);
              } else {
                setNewOffer({ ...newOffer, discount });
              }
            }}
            placeholder="Введите размер скидки"
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Дата начала</span>
          <input
            className={Styles["form__field-input"]}
            type="date"
            value={newOffer.startDate}
            min={minStartDate}
            max={maxStartDate} // Ограничение на месяц вперед
            onChange={(e) => {
              const newStartDate = e.target.value;
              setNewOffer({
                ...newOffer,
                startDate: newStartDate,
                endDate: "", // Очистить дату окончания при изменении даты начала
              });
            }}
          />
        </label>

        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Дата окончания</span>
          <input
            className={Styles["form__field-input"]}
            type="date"
            value={newOffer.endDate}
            min={
              newOffer.startDate
                ? new Date(
                    new Date(newOffer.startDate).setDate(
                      new Date(newOffer.startDate).getDate() + 1
                    )
                  )
                    .toISOString()
                    .split("T")[0]
                : minStartDate
            }
            max={maxEndDate}
            onChange={(e) =>
              setNewOffer({ ...newOffer, endDate: e.target.value })
            }
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
        <button onClick={createOffer} className={Styles["form__submit"]}>
          Создать
        </button>
      </div>
    </form>
  );
};
