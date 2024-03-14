"use client"
import React, { useState, useEffect } from 'react';
import Styles from "./Feedback.module.css"

export const Feedback = () => {
  const [sliderCount, setSliderCount] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const sliderRef = React.createRef();
  const sliderLineRef = React.createRef();

  useEffect(() => {
    setSliderWidth(sliderRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    rollSlider();
  }, [sliderCount]); // Trigger rollSlider whenever sliderCount changes

  const rollSlider = () => {
    sliderLineRef.current.style.transform = `translateX(${-sliderCount * sliderWidth}px)`;
  };

  const rightSlide = () => {
    setSliderCount((prevCount) => (prevCount + 1 >= sliders.length ? 0 : prevCount + 1));
  };

  const leftSlide = () => {
    setSliderCount((prevCount) => (prevCount - 1 < 0 ? sliders.length - 1 : prevCount - 1));
  };

  useEffect(() => {
    const intervalId = setInterval(rightSlide, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const sliders = [
    <div className={Styles.feedback_one} key={1}>
      <h2 className={Styles.feedback_h1}>
        Я надолго запомню мой День рождения, проведённый в этом ресторане! <br />
        Отдельное спасибо за комплепент в виде фруктовой тарелки. Будем рекомендовать <br />
        этот ресторан своим друзьям и родственникам, путешествующих в Санкт-Петербург!!!{" "}
        <br />
      </h2>
      <img src="images/profile1.svg" className={Styles.img_profile1} alt="Profile 1" />
      <p className={Styles.feedback_p1}>Посетитель</p>
      <p className={Styles.feedback_name1}>Михаил</p>
    </div>,
    <div className={Styles.feedback_two} key={2}>
      <h2 className={Styles.feedback_h2}>
        Хороший ресторан. Еда была вкусной, а атмосфера заведения придавала особое
        очарование. <br />
        Очень вежливый персонал, официант отлично знает позиции в меню и помог с выбором.{" "}
        <br />
        В общем нам все очень понравилось. Рекомендую посетить это место. <br />
      </h2>
      <img src="images/profile2.png" className={Styles.img_profile2} alt="Profile 2" />
      <p className={Styles.feedback_p2}>Посетитель</p>
      <p className={Styles.feedback_name2}>Николай</p>
    </div>,
    <div className={Styles.feedback_three} key={3}>
      <h2 className={Styles.feedback_h3}>
        Отмечали юбилей. Прекрасная праздничная атмосфера, бесподобная кухня,
        профессиональная подача блюд, <br />
        торт выше всех похвал. Обязательно вернемся сюда. Огромное спасибо всем кто
        участвовал в <br />
        организации нашего праздника. Рекомендуем всем посетить это волшебное место. <br />
      </h2>
      <img src="images/profile3.png" className={Styles.img_profile3} alt="Profile 3" />
      <p className={Styles.feedback_p3}>Посетитель</p>
      <p className={Styles.feedback_name3}>Виктор</p>
    </div>
  ];

  return (
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
      Left
    </button>
    <button className={Styles.slider_right} onClick={rightSlide}>
      Right
    </button>
    </div>
  </div>
);
};



  

