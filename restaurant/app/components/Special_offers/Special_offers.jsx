"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Special_offers.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { CreateOfferForm } from "../CreateOfferForm/CreateOfferForm";

export const Special_offers = () => {
  const [offers, setOffers] = useState([]);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [error, setError] = useState("");

  // Получение всех специальных предложений
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

  // Удаление специального предложения
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

  // Открытие формы для создания нового предложения
  const openCreateOfferForm = () => {
    setSelectedOffer(null); // Сбрасываем выбранное предложение
    setPopupIsOpen(true); // Открываем попап для создания
  };

  return (
    <div className={Styles.special_offers}>
      <div  className={Styles.special_offers_ul}>
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
        <button
          className={Styles.button_create}
          onClick={() => openCreateOfferForm()}
        >
          <p className={Styles.create_text}>Создать новое предложение</p>
        </button>
      </div>
      {/* Попап для создания предложения */}
      <Overlay isOpened={popupIsOpen} close={() => setPopupIsOpen(false)} />
      <Popup isOpened={popupIsOpen} close={() => setPopupIsOpen(false)}>
        <CreateOfferForm close={() => setPopupIsOpen(false)} />
      </Popup>
    </div>
  );
};
