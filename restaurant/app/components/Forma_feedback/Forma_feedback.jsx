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
        <label className={Styles.form_i} for={Styles.input_name}>
          Имя
        </label>
        <input
          className={Styles.input_name}
          type="text"
          id="input_name"
          name="input_name"
          placeholder="Иван"
        />
        <label className={Styles.form_i} for={Styles.input_massage}>
          Ваш отзыв
        </label>
        <textarea
          className={Styles.input_massage}
          type="text"
          id="input_massage"
          name="input_massage"
        ></textarea>
        <button className={Styles.button_form}>Отправить</button>
      </form>
    </div>
  );
};
