import Styles from "./Discount.module.css";
import Link from "next/link";

export const Discount = () => {
  return (
    <div className={Styles.discount}>
      <div className={Styles.left_discount}>
        <h2 className={Styles.discount_h}>
          Закажите еду от одного из <br /> самых лучших ресторанов.
        </h2>
        <p className={Styles.discount_p}>
          Только в этом месяце завтраки от 500₽
        </p>
      </div>
      <div className={Styles.right_discount}>
        <Link href="/Delivery">
          <button className={Styles.button_delivery}>Заказать</button>
        </Link>
      </div>
    </div>
  );
};
