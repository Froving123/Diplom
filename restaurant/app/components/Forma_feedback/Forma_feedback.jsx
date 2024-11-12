"use client";

import Styles from "./Forma_feedback.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";
import { useEffect, useState } from "react";

export const Forma_feedback = () => {
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", text: "" });
  const [error, setError] = useState("");

  const feedback = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.text) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      try {
        const user = auth.currentUser; // Получаем текущего пользователя
        if (user) {
          // Генерируем новый ключ
          const newItemRef = push(ref(db, "feedback"));
          const newItemKey = newItemRef.key;
          // Создаем объект с данными для записи
          const newItemData = {
            name: newItem.name,
            text: newItem.text,
            userId: user.uid, // Сохраняем идентификатор пользователя
          };
          // Записываем данные по новому ключу
          await set(ref(db, `feedback/${newItemKey}`), newItemData);
          setNewItem({ name: "", text: "" });
          setError("");
          alert("Ваша отзыв принят");
        }
      } catch (error) {
        console.error("Ошибка при добавлении документа: ", error);
      }
    }
  };

  /*useEffect(() => {
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
  }, []);*/

  const openedPopup = () => {
    setPopupIsOpened(true);
  };

  const closePopup = () => {
    setPopupIsOpened(false);
  };

  return (
    <div className={Styles.forma}>
      <div className={Styles.left_form}>
        <h2 className={Styles.form_h}>
          Форма обратной <br /> связи
        </h2>
        <p className={Styles.form_p}>
          Оставляйте ваши отзывы и пожилания <br /> они очень важны для нас.{" "}
        </p>
      </div>
      <div className={Styles.right_form}>
        <label className={Styles.form_i}>
          <span className={Styles.form_i}>Оценка</span>
          <select
            className={Styles.input_name}
            value={newItem.score}
            onChange={(e) => setNewItem({ ...newItem, score: e.target.value })}
          >
            <option disabled selected>
              Выберите оценку от 1 до 5
            </option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </label>
        <label className={Styles.form_i}>
          <span className={Styles.form_i}>Ваш отзыв</span>
          <textarea
            className={Styles.input_massage}
            type="text"
            value={newItem.text}
            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
          ></textarea>
        </label>
        {error && <p className={Styles.error_message}>{error}</p>}
        {authUser ? (
          <button className={Styles.button_form} onClick={feedback}>
            Отправить
          </button>
        ) : (
          <button className={Styles.button_form} onClick={openedPopup}>
            Отправить
          </button>
        )}
      </div>
      <Overlay isOpened={popupIsOpened} close={closePopup} />
      <Popup isOpened={popupIsOpened} close={closePopup}>
        <AuthForm close={closePopup} />
      </Popup>
    </div>
  );
};
