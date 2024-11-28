"use client";

import Styles from "./Forma_feedback.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";
import { useState } from "react";

export const Forma_feedback = () => {
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", text: "", score: "" });
  const [error, setError] = useState("");

  const feedback = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.text || !newItem.score) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      try {
        const user = auth.currentUser;
        if (user) {
          const newItemRef = push(ref(db, "feedback"));
          const newItemKey = newItemRef.key;
          const newItemData = {
            name: newItem.name,
            text: newItem.text,
            score: newItem.score,
            userId: user.uid,
          };
          await set(ref(db, `feedback/${newItemKey}`), newItemData);
          setNewItem({ name: "", text: "", score: "" });
          setError("");
          alert("Ваш отзыв принят");
        }
      } catch (error) {
        console.error("Ошибка при добавлении документа: ", error);
      }
    }
  };

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
          Оставляйте ваши отзывы и пожелания <br /> они очень важны для нас.{" "}
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
            <option value="" disabled>
              Выберите оценку от 1 до 5
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label className={Styles.form_i}>
          <span className={Styles.form_i}>Ваш отзыв</span>
          <textarea
            className={Styles.input_massage}
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
