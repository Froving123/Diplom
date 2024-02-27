import Styles from "./Forma_feedback.module.css";

export const Forma_feedback = () => {
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
      <form className={Styles.right_form}>
        <label className={Styles.form_i}>
          <span className={Styles.form_i}>Имя</span>
          <input className={Styles.input_name} type="text" placeholder="Иван" />
        </label>
        <label className={Styles.form_i}>
          <span className={Styles.form_i}>Ваш отзыв</span>
          <textarea className={Styles.input_massage} type="text"></textarea>
        </label>
        <button className={Styles.button_form}>Отправить</button>
      </form>
    </div>
  );
};
