"use client";

import Styles from "./Forma_feedback.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";
import { useState, useEffect } from "react";

export const Forma_feedback = () => {
  const [newItem, setNewItem] = useState({
    score: "",
    text: "",
  });
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Проверка наличия токена в localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      // Если токен есть, устанавливаем пользователя как авторизованного
      setAuthUser({ token });
    } else {
      setAuthUser(null);
    }
  }, []);

  const feedback = async (e) => {
    e.preventDefault();

    if (!newItem.score || !newItem.text) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const token = localStorage.getItem("authToken");

    // Отправляем данные на сервер для создания отзыва
    fetch("/api/feedback/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        score: newItem.score,
        text: newItem.text,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) {
          setError(result.message || "Ошибка при отправке отзыва");
          setTimeout(() => {
            setError("");
          }, 3000);
          return;
        }

        // Обновляем данные после успешного создания отзыва
        setNewItem({ score: "", text: "" });
        alert(`Отзыв успешно создан. Спасибо!`);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных на сервер:", error);
        setError("Ошибка при отправке отзыва");
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  const openPopup = () => {
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
          Оставляйте ваши отзывы и пожелания <br /> они очень важны для нас.
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
          <button className={Styles.button_form} onClick={openPopup}>
            Отправить
          </button>
        )}
      </div>
      <Overlay isOpened={popupIsOpened} close={closePopup} />
      <Popup isOpened={popupIsOpened} close={closePopup}>
        <AuthForm close={closePopup} updateAuthUser={setAuthUser} />
      </Popup>
    </div>
  );
};
