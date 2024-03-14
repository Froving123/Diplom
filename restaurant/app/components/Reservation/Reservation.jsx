import Styles from "./Reservation.module.css";

export const Reservation = () => {
  return (
    <div className={Styles.reservation}>
      <p className={Styles.text}>У вас нет бронирования</p>
    </div>
  );
};
