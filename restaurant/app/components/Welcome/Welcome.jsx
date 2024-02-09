import Styles from "./Welcome.module.css";

export const Welcome = () => {
  return (
    <div className={Styles.main_div}>
      <div className={Styles.main_p}>
        <h1 className={Styles.h1}>
          Добро пожаловать <br /> в наш ресторан{" "}
        </h1>
        <div className={tyles.name_restaurant}>
          <p>
            <hr className={Styles.hr_name} />
            Best Rest
            <hr className={Styles.hr_name} />
          </p>
        </div>
        <button className={Styles.button_reserv}>Забронировать</button>
      </div>
    </div>
  );
};
