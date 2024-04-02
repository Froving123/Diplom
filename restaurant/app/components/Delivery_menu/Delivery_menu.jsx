"use client";

import React from "react";
import { ref, push, set } from "firebase/database";
import { db, auth } from "../../firebase";
import Styles from "./Delivery_menu.module.css";
import { useEffect, useState } from "react";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";
import { onAuthStateChanged } from "firebase/auth";

export const Delivery_menu = () => {
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  const openPopup = () => {
    setPopupIsOpened(true);
  };

  const closePopup = () => {
    setPopupIsOpened(false);
  };

  const addProductToCart = async (name, price) => {
    try {
      const user = auth.currentUser; // Получаем текущего пользователя
      if (user) {
        // Генерируем новый ключ
        const newItemRef = push(ref(db, "product"));
        const newItemKey = newItemRef.key;
        // Создаем объект с данными для записи
        const newItemData = {
          name: name,
          price: price,
          userId: user.uid, // Сохраняем идентификатор пользователя
        };
        // Записываем данные по новому ключу
        await set(ref(db, `product/${newItemKey}`), newItemData);
        alert("Товар добавлен в корзину");
      }
    } catch (error) {
      console.error("Ошибка при добавлении документа: ", error);
    }
  };
  return (
    <div className={Styles.delivery_menu}>
      <h2 className={Styles.delivery_h}>Закажите до дома</h2>
      <div className={Styles.foods}>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="images/pancakes.png" />
          <h3 className={Styles.food_h}>Блины</h3>
          <p className={Styles.price_menu}>1500₽</p>
          {authUser ? (
            <button
              className={Styles.button_menu_delivery}
              onClick={() => addProductToCart("Блины", "1500₽")}
            >
              Добавить в корзину
            </button>
          ) : (
            <button className={Styles.button_menu_delivery} onClick={openPopup}>
              Добавить в корзину
            </button>
          )}
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="images/meat_delivery.png" />
          <h3 className={Styles.food_h}>Стейк</h3>
          <p className={Styles.price_menu}>1500₽</p>
          {authUser ? (
            <button
              className={Styles.button_menu_delivery}
              onClick={() => addProductToCart("Стейк", "1500₽")}
            >
              Добавить в корзину
            </button>
          ) : (
            <button className={Styles.button_menu_delivery} onClick={openPopup}>
              Добавить в корзину
            </button>
          )}
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="images/eggs_bacon.png" />
          <h3 className={Styles.food_h}>
            Яйца с ветчиной <br />
            или беконом
          </h3>
          <div className={Styles.lowprice_div}>
            <p className={Styles.price_menu}>
              <strike className="strike">1000₽</strike>
            </p>
            <p className={Styles.lowprice_menu}>
              <sub>500₽</sub>
            </p>
          </div>
          {authUser ? (
            <button
              className={Styles.button_menu_delivery}
              onClick={() =>
                addProductToCart("Яйца с ветчиной или беконом", "500₽")
              }
            >
              Добавить в корзину
            </button>
          ) : (
            <button className={Styles.button_menu_delivery} onClick={openPopup}>
              Добавить в корзину
            </button>
          )}
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="images/eggs_tomato.png" />
          <h3 className={Styles.food_h}>
            Омлет с помидором <br />и сыром фета
          </h3>
          <div className={Styles.lowprice_div}>
            <p className={Styles.price_menu}>
              <strike className="strike">1000₽</strike>
            </p>
            <p className={Styles.lowprice_menu}>
              <sub>500₽</sub>
            </p>
          </div>
          {authUser ? (
            <button
              className={Styles.button_menu_delivery}
              onClick={() =>
                addProductToCart("Омлет с помидором и сыром фета", "500₽")
              }
            >
              Добавить в корзину
            </button>
          ) : (
            <button className={Styles.button_menu_delivery} onClick={openPopup}>
              Добавить в корзину
            </button>
          )}
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="images/burrito.png" />
          <h3 className={Styles.food_h}>Буррито</h3>
          <div className={Styles.lowprice_div}>
            <p className={Styles.price_menu}>
              <strike>1000₽</strike>
            </p>
            <p className={Styles.lowprice_menu}>
              <sub>500₽</sub>
            </p>
          </div>
          {authUser ? (
            <button
              className={Styles.button_menu_delivery}
              onClick={() => addProductToCart("Буррито", "500₽")}
            >
              Добавить в корзину
            </button>
          ) : (
            <button className={Styles.button_menu_delivery} onClick={openPopup}>
              Добавить в корзину
            </button>
          )}
        </div>
        <div className={Styles.food}>
          <img
            className={Styles.img_food}
            src="images/milkShake_delivery.png"
          />
          <h3 className={Styles.food_h}>Молочный коктель</h3>
          <p className={Styles.price_menu}>180₽</p>
          {authUser ? (
            <button
              className={Styles.button_menu_delivery}
              onClick={() => addProductToCart("Молочный коктель", "180₽")}
            >
              Добавить в корзину
            </button>
          ) : (
            <button className={Styles.button_menu_delivery} onClick={openPopup}>
              Добавить в корзину
            </button>
          )}
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="images/coffee_delivery.png" />
          <h3 className={Styles.food_h}>Кофе</h3>
          <p className={Styles.price_menu}>180₽</p>
          {authUser ? (
            <button
              className={Styles.button_menu_delivery}
              onClick={() => addProductToCart("Кофе", "180₽")}
            >
              Добавить в корзину
            </button>
          ) : (
            <button className={Styles.button_menu_delivery} onClick={openPopup}>
              Добавить в корзину
            </button>
          )}
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="images/juice.png" />
          <h3 className={Styles.food_h}>Сок</h3>
          <p className={Styles.price_menu}>180₽</p>
          {authUser ? (
            <button
              className={Styles.button_menu_delivery}
              onClick={() => addProductToCart("Сок", "180₽")}
            >
              Добавить в корзину
            </button>
          ) : (
            <button className={Styles.button_menu_delivery} onClick={openPopup}>
              Добавить в корзину
            </button>
          )}
        </div>
      </div>
      <Overlay isOpened={popupIsOpened} close={closePopup} />
      <Popup isOpened={popupIsOpened} close={closePopup}>
        <AuthForm close={closePopup} />
      </Popup>
    </div>
  );
};
