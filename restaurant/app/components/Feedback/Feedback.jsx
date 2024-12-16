"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Styles from "./Feedback.module.css";

export const Feedback = () => {
  const [sliderCount, setSliderCount] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]); // Данные с сервера
  const [error, setError] = useState("");

  const sliderRef = useRef(null);
  const sliderLineRef = useRef(null);

  const [sliderWidth, setSliderWidth] = useState(0);

  // Загрузка отзывов с сервера
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/feedback/user");
        const result = await response.json();
        if (result.success) {
          setFeedbacks(result.feedbacks);
        } else {
          throw new Error(result.message || " ");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFeedbacks();
  }, []);

  // Используем useLayoutEffect, чтобы измерить ширину слайдера до рендера
  useLayoutEffect(() => {
    const updateSliderWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      }
    };

    updateSliderWidth();
    window.addEventListener("resize", updateSliderWidth);

    return () => {
      window.removeEventListener("resize", updateSliderWidth);
    };
  }, [feedbacks]); // Зависимость от feedbacks, чтобы при изменении количества отзывов обновлялся размер

  useEffect(() => {
    rollSlider();
  }, [sliderCount, sliderWidth]);

  const rollSlider = () => {
    if (sliderLineRef.current) {
      sliderLineRef.current.style.transform = `translateX(${
        -sliderCount * sliderWidth
      }px)`;
    }
  };

  const rightSlide = () => {
    if (feedbacks.length > 1) {
      setSliderCount((prevCount) =>
        prevCount + 1 >= feedbacks.length ? 0 : prevCount + 1
      );
    }
  };

  const leftSlide = () => {
    if (feedbacks.length > 1) {
      setSliderCount((prevCount) =>
        prevCount - 1 < 0 ? feedbacks.length - 1 : prevCount - 1
      );
    }
  };

  useEffect(() => {
    if (feedbacks.length > 1) {
      const intervalId = setInterval(rightSlide, 8000);
      return () => clearInterval(intervalId);
    }
  }, [feedbacks]);

  // Если отзывов нет, компонент не отображается
  if (feedbacks.length === 0) {
    return null;
  }

  // Рассчитываем динамическую ширину для слайдера
  const sliderLineWidth = feedbacks.length * 100 + "%";

  if (error) {
    return <p className={Styles.error}>{error}</p>;
  }

  return (
    <div className={Styles.feedback}>
      <div className={Styles.slider} ref={sliderRef}>
        <div
          className={Styles.slider_line}
          ref={sliderLineRef}
          style={{ width: sliderLineWidth }}
        >
          {feedbacks.map((feedback, index) => (
            <div
              className={Styles.sliders}
              key={index}
              style={{ width: `${100 / feedbacks.length}%` }} // Устанавливаем ширину каждого отзыва в процентах
            >
              <div className={Styles.feedback_card}>
                <h2 className={Styles.feedback_h_all}>{feedback.text}</h2>
                <p className={Styles.feedback_name}>{feedback.userName}</p>
                <p className={Styles.feedback_score}>
                  Оценка: {feedback.score}/5
                </p>
                <p className={Styles.feedback_date}>
                  {new Date(feedback.date).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
        {feedbacks.length > 1 && (
          <div className={Styles.slider_button}>
            <button className={Styles.slider_left} onClick={leftSlide}>
              <img src="./images/left-button.png" className={Styles.button_img}></img>
            </button>
            <button className={Styles.slider_right} onClick={rightSlide}>
            <img src="./images/right-button.png" className={Styles.button_img}></img>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
