import Styles from "./Discount.module.css";

export const Discount = () => {
  return (
    <div className={Styles.discount}>
      <div className={Styles.left_discount}>
        <h2 className={Styles.discount_h}>
          Закажите еду от одного из <br /> самых лучших ресторанов.
        </h2>
        <p className={Styles.discount_p}>Только в этом месяце завтраки от 500 ₽</p>
      </div>
      <div className={Styles.right_discount}>
        <a href="#nav_three">
          <button className={Styles.button_delivery}>Заказать</button>
        </a>
      </div>
    </div>
  );
};
