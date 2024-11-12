"use client";

import React, { useEffect, useState } from "react";
import Styles from "./DeliveryForm.module.css";

export const DeliveryForm = (props) => {
  const [newItem, setNewItem] = useState({ address: "" });
  const [error, setError] = useState("");
  const [userProduct, setUserProduct] = useState([]);
  const [total, setTotal] = useState(0);

  /*useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProduct(user.uid);
      } else {
        setUserProduct([]);
        setTotal(0);
      }
    });

    const unsubscribeProduct = onValue(ref(db, "product"), () => {
      const user = auth.currentUser;
      if (user) {
        fetchUserProduct(user.uid);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProduct();
    };
  }, []);*/

  const fetchUserProduct = async (uid) => {
    try {
      const productRef = ref(db, "product");
      const userProductQuery = query(
        productRef,
        orderByChild("userId"),
        equalTo(uid)
      );

      await new Promise((resolve) => {
        onValue(userProductQuery, (snapshot) => {
          if (snapshot.exists()) {
            const product = [];
            snapshot.forEach((childSnapshot) => {
              const price = parseInt(childSnapshot.val().price) || 0;
              const quantity = parseInt(childSnapshot.val().quantity) || 1;
              product.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
                price: price,
                quantity: quantity,
              });
            });
            setUserProduct(product);
            calculateTotal(product);
            resolve();
          } else {
            setUserProduct([]);
            setTotal(0);
            console.log("Данные не найдены");
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Ошибка при получении данных: ", error);
    }
  };

  const calculateTotal = (products) => {
    const totalPrice = products.reduce(
      (sum, item) => sum + parseInt(item.price) * item.quantity,
      0
    );
    setTotal(totalPrice);
  };

  const removeAllProducts = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const productRef = ref(db, "product");
        const userProductQuery = query(
          productRef,
          orderByChild("userId"),
          equalTo(user.uid)
        );

        await new Promise((resolve) => {
          onValue(userProductQuery, (snapshot) => {
            if (snapshot.exists()) {
              const updates = {};
              snapshot.forEach((childSnapshot) => {
                updates[`product/${childSnapshot.key}`] = null;
              });
              const updatesRef = ref(db);
              update(updatesRef, updates).then(() => {
                console.log(
                  "Все записи пользователя из базы данных 'product' удалены"
                );
                resolve();
              });
            } else {
              console.log("Данные не найдены");
              resolve();
            }
          });
        });
      }
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
      <h2 className={Styles["form__title"]}>Доставка</h2>
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
            <option disabled selected>
              Выберите способ оплаты
            </option>
            <option>Наличными при получении</option>
            <option>Картой при получении</option>
          </select>
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
