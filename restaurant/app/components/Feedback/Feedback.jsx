import Styles from "./Feedback.module.css";

export const Feedback = () => {
  return (
    <>
      <div className={Styles.slider}>
        <div className={Styles.slider_line}>
          <div className={Styles.sliders}>
            <div className={Styles.feedback_one}>
              <h2 className={Styles.feedback_h1}>
                Я надолго запомню мой День рождения, проведённый в этом ресторане! <br />
                Отдельное спасибо за комплепент в виде фруктовой тарелки. Будем рекомендовать <br />
                этот ресторан своим друзьям и родственникам, путешествующих в Санкт-Петербург!!!{" "}
                <br />
              </h2>
              <img src="./images/profile1.svg" className={Styles.img_profile1} />
              <p className={Styles.feedback_p1}>Посетитель</p>
              <p className={Styles.feedback_name1}>Михаил</p>
            </div>
          </div>
          <div className={Styles.sliders}>
            <div className={Styles.feedback_two}>
              <h2 className={Styles.feedback_h2}>
                Хороший ресторан. Еда была вкусной, а атмосфера заведения придавала особое
                очарование. <br />
                Очень вежливый персонал, официант отлично знает позиции в меню и помог с выбором.{" "}
                <br />
                В общем нам все очень понравилось. Рекомендую посетить это место. <br />
              </h2>
              <img src="./images/profile2.png" className={Styles.img_profile2} />
              <p className={Styles.feedback_p2}>Посетитель</p>
              <p className={Styles.feedback_name2}>Николай</p>
            </div>
          </div>
          <div className={Styles.sliders}>
            <div className={Styles.feedback_three}>
              <h2 className={Styles.feedback_h3}>
                Отмечали юбилей. Прекрасная праздничная атмосфера, бесподобная кухня,
                профессиональная подача блюд, <br />
                торт выше всех похвал. Обязательно вернемся сюда. Огромное спасибо всем кто
                участвовал в <br />
                организации нашего праздника. Рекомендуем всем посетить это волшебное место. <br />
              </h2>
              <img src="./images/profile3.png" className={Styles.img_profile3} />
              <p className={Styles.feedback_p3}>Посетитель</p>
              <p className={Styles.feedback_name3}>Виктор</p>
            </div>
          </div>
        </div>
      </div>
      <div className={Styles.slider_button}>
        <button className={Styles.slider_left}>&#10148;</button>
        <button className={Styles.slider_right}>&#10148;</button>
      </div>
    </>
  );
};
