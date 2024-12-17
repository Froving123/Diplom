"use client";

import React, { useEffect, useState } from "react";
import Styles from "./DeliveryForm.module.css";
import { useCart } from "@/CartContext";

export const DeliveryForm = (props) => {
  const [newItem, setNewItem] = useState({
    street: "",
    home: "",
    flat: "",
    payment: "",
  });
  const [availablePayment, setAvailablePayment] = useState([]);
  const { totalPrice, updateCart } = useCart();
  const [error, setError] = useState("");
  const DELIVERY_PRICE = 700; // Статичная стоимость доставки

  useEffect(() => {
    const fetchAllPayment = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/order/payment",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setAvailablePayment(result.payment);
        } else {
          setError(result.message || "Ошибка при получении всех способов");
          setTimeout(() => setError(""), 3000);
        }
      } catch (error) {
        console.error("Ошибка при получении всех способов:", error);
        setError("Ошибка при получении всех способов");
        setTimeout(() => setError(""), 3000);
      }
    };

    fetchAllPayment();
  }, []);

  const numberInput = (setState, maxLength) => (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= maxLength) {
      setState(value);
    }
  };
  const russianInput = (key) => (e) => {
    const value = e.target.value.replace(/[^А-Яа-яЁё]/g, "");
    const formattedValue = value.replace(/(^|\\s)([а-яё])/g, (match) =>
      match.toUpperCase()
    );
    setNewItem((prevState) => ({
      ...prevState,
      [key]: formattedValue,
    }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!newItem.street || !newItem.home || !newItem.payment) {
      setError("Пожалуйста, заполните все обязательные поля");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    try {
      const orderData = {
        address: {
          street: newItem.street,
          home: newItem.home,
          flat: newItem.flat || "",
        },
        payment: newItem.payment,
        totalPrice: totalPrice, // Общая стоимость с доставкой
        deliveryPrice: DELIVERY_PRICE,
      };

      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:5000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Ваш заказ успешно создан!");
        setNewItem({ street: "", home: "", flat: "", payment: "" });
        props.close(); // Закрытие формы
        window.location.reload();
      } else {
        const result = await response.json();
        setError(result.message || "Ошибка при создании заказа");
      }
    } catch (error) {
      console.error("Ошибка отправки заказа:", error);
      setError("Произошла ошибка. Повторите попытку позже.");
    }
  };

  const handleClear = () => {
    setNewItem({ street: "", home: "", flat: "", payment: "" });
  };

  useEffect(() => {
    updateCart(); // Обновление данных корзины при монтировании
  }, [updateCart]);

  return (
    <form className={Styles["form"]} onSubmit={submitOrder}>
      <h2 className={Styles["form__title"]}>Оформление</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>
            Улица<span className={Styles["required"]}>*</span>
          </span>
          <input
            className={`${Styles["form__field-input"]} ${
              !newItem.street && error ? Styles["error-border"] : ""
            }`}
            type="text"
            aria-required="true"
            value={newItem.street}
            placeholder="Ленина"
            onChange={russianInput("street")}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>
            Дом<span className={Styles["required"]}>*</span>
          </span>
          <input
            className={`${Styles["form__field-input"]} ${
              !newItem.street && error ? Styles["error-border"] : ""
            }`}
            type="text"
            aria-required="true"
            value={newItem.home}
            placeholder="156"
            onChange={numberInput(
              (value) => setNewItem({ ...newItem, home: value }),
              4
            )}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Квартира</span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={newItem.flat}
            placeholder="45"
            onChange={numberInput(
              (value) => setNewItem({ ...newItem, flat: value }),
              5
            )}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>
            Способ оплаты<span className={Styles["required"]}>*</span>
          </span>
          <select
            className={`${Styles["form__field-input"]} ${
              !newItem.street && error ? Styles["error-border"] : ""
            }`}
            aria-required="true"
            disabled={availablePayment.length === 0}
            value={newItem.payment}
            onChange={(e) =>
              setNewItem({ ...newItem, payment: e.target.value })
            }
          >
            <option value=""> Выберите способ оплаты</option>
            {availablePayment.map((payment) => (
              <option key={payment.ID} value={payment.ID}>
                {payment.Наименование}
              </option>
            ))}
          </select>
        </label>
        <div className={Styles.price}>
          <p className={Styles.price_content}>Стоимость доставки</p>
          <p className={Styles.price_content}>{DELIVERY_PRICE}₽</p>
        </div>
        <div className={Styles.price}>
          <p className={Styles.price_content}>Стоимость заказа</p>
          <p className={Styles.price_content}>{totalPrice + DELIVERY_PRICE}₽</p>
        </div>
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
        <button type="submit" className={Styles["form__submit"]}>
          Заказать
        </button>
      </div>
    </form>
  );
};
