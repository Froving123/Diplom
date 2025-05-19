"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Hide_Offers.module.css";

export const Hide_Offers = () => {
  const [offers, setOffers] = useState([]);

  // Получение всех специальных предложений
  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/contman/hideOfferGet", {
        method: "GET",
      });

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

  const recoveryOffer = async (offerId) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите восстановить это предложение?"
    );
    if (!confirmDelete) {
      return; // Отмена восстановления
    }

    try {
      const response = await fetch("/api/contman/offerRecovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: offerId }),
      });

      const result = await response.json();
      if (result.success) {
        fetchOffers(); // Обновить список предложений
      } else {
        setError(result.message || "Ошибка при восстановлении предложения");
      }
    } catch (err) {
      setError("Ошибка при восстановлении предложения");
      console.error(err);
    }
  };

  // Удаление специального предложения
  const deleteOffer = async (offerId) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить это предложение?"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
      const response = await fetch("/api/contman/offerDelete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: offerId }),
      });

      const result = await response.json();
      if (result.success) {
        fetchOffers(); // Обновить список предложений
      } else {
        setError(result.message || "Ошибка при удалении предложения");
      }
    } catch (err) {
      setError("Ошибка при удалении предложения");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className={Styles.special_offers}>
      <div className={Styles.special_offers_ul}>
        {error && <p className={Styles.error_message}>{error}</p>}
        {offers.length > 0 ? (
          <ul className={Styles.ul_offers}>
            {offers.map((offer) => (
              <li key={offer.ID} className={Styles.offer}>
                <div className={Styles.offer_controls}>
                  <button
                    className={Styles.button_delete}
                    onClick={() => recoveryOffer(offer.ID)}
                  >
                    <p className={Styles.button_text}> Восстановить</p>
                  </button>
                </div>
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
            <p className={Styles.empty_description}>Нет скрытых предложений</p>
          </div>
        )}
      </div>
    </div>
  );
};
