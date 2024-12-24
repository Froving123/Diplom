"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Review.module.css";

export const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  // Получение всех отзывов
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/contman/reviewGet",
        {
          method: "GET",
        }
      );

      const result = await response.json();
      if (result.success) {
        setReviews(result.data);
      } else {
        setError(result.message || "Ошибка при загрузке отзывов");
      }
    } catch (err) {
      setError("Ошибка при загрузке отзывов");
      console.error(err);
    }
  };

  // Удаление отзыва
  const deleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить этот отзыв?"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/contman/reviewDelete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: reviewId }),
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchReviews();
      } else {
        setError(result.message || "Ошибка при удалении отзыва");
      }
    } catch (err) {
      setError("Ошибка при удалении отзыва");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className={Styles.review_container}>
      {error && <p className={Styles.error_message}>{error}</p>}
      {reviews.length > 0 ? (
        <ul className={Styles.review_list}>
          {reviews.map((review) => (
            <li key={review.ID} className={Styles.review_item}>
              <div className={Styles.review_text}>
                <p className={Styles.review_text_content}>
                  {review.Текст_отзыва}
                </p>
                <p className={Styles.review_user_info}>
                  Пользователь: {review.Имя_пользователя}
                </p>
                <p className={Styles.review_user_info}>
                  Оценка: {review.Оценка}
                </p>
                <p className={Styles.review_date}>
                  Дата:{" "}
                  {new Date(review.Дата).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className={Styles.review_controls}>
                <button
                  className={Styles.review_button_delete}
                  onClick={() => deleteReview(review.ID)}
                >
                  <p className={Styles.button_text}> Удалить</p>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={Styles.review_empty_state}>
          <p className={Styles.review_empty_text}>Нет отзывов</p>
        </div>
      )}
    </div>
  );
};
