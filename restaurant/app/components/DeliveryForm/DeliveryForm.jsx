"use client";

import React, { useEffect, useState } from "react";
import Styles from "./DeliveryForm.module.css";
import {
  ref,
  push,
  set,
  remove,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import { db, auth } from "../../firebase";

export const DeliveryForm = (props) => {
  const [newItem, setNewItem] = useState({ address: "" });
  const [error, setError] = useState("");
  const [userProduct, setUserProduct] = useState([]);
  const [total, setTotal] = useState(0);

  const removeAllProducts = async () => {
    try {
      await remove(ref(db, "product"));
      console.log("Все записи из базы данных 'product' удалены");
    } catch (error) {
      console.error("Ошибка при удалении записей: ", error);
    }
  };

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

  useEffect(() => {
    const fetchUserProduct = async () => {
      const user = auth.currentUser;
      if (user) {
        const productRef = ref(db, "product");
        const userProductQuery = query(
          productRef,
          orderByChild("userId"),
          equalTo(user.uid)
        );

        try {
          onValue(userProductQuery, (snapshot) => {
            if (snapshot.exists()) {
              const product = [];
              snapshot.forEach((childSnapshot) => {
                product.push({
                  id: childSnapshot.key,
                  ...childSnapshot.val(),
                });
              });
              setUserProduct(product);
            } else {
              console.log("Данные не найдены");
            }
          });
        } catch (error) {
          console.error("Ошибка при получении данных: ", error);
        }
      }
    };

    fetchUserProduct();
  }, []);

  useEffect(() => {
    const totalPrice = userProduct.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );
    setTotal(totalPrice);
  }, [userProduct]);

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Доставка</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Адрес</span>
          <input
            className={Styles["form__field-input"]}
            type="street"
            value={newItem.address}
            placeholder="Ул.Мира 156, кв.45"
            onChange={(e) =>
              setNewItem({ ...newItem, address: e.target.value })
            }
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Способ оплаты</span>
          <input
            className={Styles["form__field-input"]}
            type="text"
            disabled
            placeholder="при получении"
          />
        </label>
        <div className={Styles.order}>
          <p className={Styles.order_content}>Стоимость заказа</p>
          <p className={Styles.order_content}>{total}₽</p>
        </div>
      </div>
      {error && <p className={Styles.error_message}>{error}</p>}
      <div className={Styles["form__actions"]}>
        <button onClick={delivery} className={Styles["form__submit"]}>
          Заказать
        </button>
      </div>
    </form>
  );
};
