"use client";

import React, { useEffect, useState } from "react";
import Styles from "./DeliveryForm.module.css";

export const DeliveryForm = (props) => {
  const [newItem, setNewItem] = useState({ address: "", payment: "" });
  const [error, setError] = useState("");
  const [userProduct, setUserProduct] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0); // переименовали переменную

  const delivery = async (e) => {
    e.preventDefault();
    if (!newItem.address) {
      setError("Пожалуйста, заполните поле");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      try {
        const user = auth.currentUser;
        if (user) {
          const newItemRef = push(ref(db, "delivery"));
          const newItemKey = newItemRef.key;
          const newItemData = {
            address: newItem.address,
            payment: newItem.payment,
            userId: user.uid,
            price: total,
          };
          await set(ref(db, `delivery/${newItemKey}`), newItemData);
          setNewItem({ address: "" });
          setError("");
          props.close();
          await removeAllProducts();
          window.location.reload();
          alert("Ваш заказ принят");
        }
      } catch (error) {
        console.error("Ошибка при добавлении документа: ", error);
      }
    }
  };

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Оформление</h2>
      <p className={Styles["form__title"]}>
        Доставка осуществляется в пределах КАД
      </p>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Улица</span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={newItem.street}
            placeholder="Ленина"
            onChange={(e) => setNewItem({ ...newItem, street: e.target.value })}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Дом</span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={newItem.home}
            placeholder="156"
            onChange={(e) => setNewItem({ ...newItem, home: e.target.value })}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Квартира</span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            value={newItem.flat}
            placeholder="45"
            onChange={(e) => setNewItem({ ...newItem, flat: e.target.value })}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Способ оплаты</span>
          <select
            className={Styles["form__field-input"]}
            value={newItem.payment}
            onChange={(e) =>
              setNewItem({ ...newItem, payment: e.target.value })
            }
          >
            <option value="" disabled>
              Выберите способ оплаты
            </option>
            <option value="Наличными при получении">
              Наличными при получении
            </option>
            <option value="Картой при получении">Картой при получении</option>
          </select>
        </label>
        <div className={Styles.order}>
          <p className={Styles.order_content}>Стоимость доставки</p>
          <p className={Styles.order_content}>{deliveryPrice}₽</p>{" "}
          {/* используем deliveryPrice */}
        </div>
        <div className={Styles.order}>
          <p className={Styles.order_content}>Стоимость заказа</p>
          <p className={Styles.order_content}>{total}₽</p>
        </div>
      </div>
      {error && <p className={Styles.error_message}>{error}</p>}
      <div className={Styles["form__actions"]}>
        <button type="submit" className={Styles["form__submit"]}>
          Заказать
        </button>
      </div>
    </form>
  );
};
