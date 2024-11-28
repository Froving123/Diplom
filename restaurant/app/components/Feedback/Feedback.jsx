"use client";

import React, { useState, useEffect, useRef } from "react";
import Styles from "./Feedback.module.css";

export const Feedback = () => {
  const [sliderCount, setSliderCount] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const sliderRef = useRef(null);
  const sliderLineRef = useRef(null);

  useEffect(() => {
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
  }, []);

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
    setSliderCount((prevCount) =>
      prevCount + 1 >= sliders.length ? 0 : prevCount + 1
    );
  };

  const leftSlide = () => {
    setSliderCount((prevCount) =>
      prevCount - 1 < 0 ? sliders.length - 1 : prevCount - 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(rightSlide, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const sliders = [
    <div className={Styles.feedback_all} key={1}>
      <h2 className={Styles.feedback_h_all}>
        Я надолго запомню мой День рождения, проведённый в этом ресторане!{" "}
        <br />
        Отдельное спасибо за комплепент в виде фруктовой тарелки. Будем
        рекомендовать <br />
        этот ресторан своим друзьям и родственникам, путешествующих в
        Санкт-Петербург!!! <br />
      </h2>
      <p className={Styles.feedback_p_all}>Посетитель</p>
      <p className={Styles.feedback_name_all}>Михаил</p>
    </div>,
    <div className={Styles.feedback_all} key={2}>
      <h2 className={Styles.feedback_h_all}>
        Хороший ресторан. Еда была вкусной, а атмосфера заведения придавала
        особое очарование. <br />
        Очень вежливый персонал, официант отлично знает позиции в меню и помог с
        выбором. <br />
        В общем нам все очень понравилось. Рекомендую посетить это место. <br />
      </h2>
      <p className={Styles.feedback_p_all}>Посетитель</p>
      <p className={Styles.feedback_name_all}>Николай</p>
    </div>,
    <div className={Styles.feedback_all} key={3}>
      <h2 className={Styles.feedback_h_all}>
        Отмечали юбилей. Прекрасная праздничная атмосфера, бесподобная кухня,
        профессиональная подача блюд, <br />
        торт выше всех похвал. Обязательно вернемся сюда. Огромное спасибо всем
        кто участвовал в <br />
        организации нашего праздника. Рекомендуем всем посетить это волшебное
        место. <br />
      </h2>
      <p className={Styles.feedback_p_all}>Посетитель</p>
      <p className={Styles.feedback_name_all}>Виктор</p>
    </div>,
  ];

  return (
    <div className={Styles.feedback}>
      <div className={Styles.slider} ref={sliderRef}>
        <div className={Styles.slider_line} ref={sliderLineRef}>
          {sliders.map((slider, index) => (
            <div className={Styles.sliders} key={index}>
              {slider}
            </div>
          ))}
        </div>
        <div className={Styles.slider_button}>
          <button className={Styles.slider_left} onClick={leftSlide}>
            &lt;
          </button>
          <button className={Styles.slider_right} onClick={rightSlide}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
