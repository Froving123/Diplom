"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Special_offers.module.css";

export const Special_offers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");

  // Получение всех спецпредложений с сервера
  const fetchOffers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/contman/offerGet",
        {
          method: "GET",
        }
      );

      const result = await response.json();
      if (result.success) {
        setOffers(result.data);
      } else {
        setError(result.message || "Ошибка при загрузке предложений");
      }
    } catch (err) {
      setError("Ошибка при загрузке предложений");
      console.error(err);
    }
  };

  // Удаление спецпредложения
  const deleteOffer = async (offerId) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить это предложение?"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contman/offerDelete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: offerId }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Предложение успешно удалено!");
        fetchOffers(); // Обновить список предложений
      } else {
        setError(result.message || "Ошибка при удалении предложения");
      }
    } catch (err) {
      setError("Ошибка при удалении предложения");
      console.error(err);
    }
  };

  /* // Изменение спецпредложения
  const updateOffer = async (offerId) => {
    if (!newDescription || !newDishId || !newStartDate || !newEndDate || !newDiscount) {
      return; // Отмена, если пользователь не ввел значения
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contman/offerUpdate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: offerId,
            description: newDescription,
            dishId: newDishId,
            startDate: newStartDate,
            endDate: newEndDate,
            discount: newDiscount,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Предложение успешно обновлено!");
        fetchOffers(); // Обновить список предложений
      } else {
        setError(result.message || "Ошибка при обновлении предложения");
      }
    } catch (err) {
      setError("Ошибка при обновлении предложения");
      console.error(err);
    }
  };

  // Создание нового спецпредложения
  const createOffer = async () => {
    if (!description || !dishId || !startDate || !endDate || !discount) {
      return; // Отмена, если пользователь не ввел значения
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contman/offerCreate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            dishId,
            startDate,
            endDate,
            discount,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Спецпредложение успешно создано!");
        fetchOffers(); // Обновить список предложений
      } else {
        setError(result.message || "Ошибка при создании предложения");
      }
    } catch (err) {
      setError("Ошибка при создании предложения");
      console.error(err);
    }
  };*/

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className={Styles.special_offers}>
      <div>
        {error && <p className={Styles.error_message}>{error}</p>}
        {offers.length > 0 ? (
          <ul className={Styles.ul_offers}>
            {offers.map((offer) => (
              <li key={offer.ID} className={Styles.offer}>
                <div className={Styles.offer_text}>
                  <p className={Styles.offer_description}>
                    {offer.Описание} ({offer.Название_блюда}):{" "}
                    {offer.Размер_скидки}₽
                  </p>{" "}
                  <p className={Styles.offer_date}>
                    Даты:{" "}
                    {new Date(offer.Дата_начала).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(offer.Дата_окончания).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className={Styles.offer_controls}>
                  <button className={Styles.button_edit}>
                    <p className={Styles.button_text}>Изменить</p>
                  </button>
                  <button
                    className={Styles.button_delete}
                    onClick={() => deleteOffer(offer.ID)}
                  >
                    <p className={Styles.button_text}> Удалить</p>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={Styles.empty_offers}>
            <p className={Styles.empty_description}>
              Нет доступных предложений
            </p>
          </div>
        )}
      </div>
      <div>
        <button className={Styles.button_create}>
          <p className={Styles.create_text}>Создать новое предложение</p>
        </button>
      </div>
    </div>
  );
};
