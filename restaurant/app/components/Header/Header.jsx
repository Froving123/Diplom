import Styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={Styles.header}>
      <img className={Styles.logo} src="images/logo.png" />
      <nav>
        <ul className={Styles.ul_header}>
          <li className={Styles.nav_p}>
            <a className={Styles.a_nav} href="#nav_two">
              Меню
            </a>
          </li>
          <li className={Styles.nav_p}>
            <a className={Styles.a_nav} href="#nav_three">
              Доставка
            </a>
          </li>
          <li className={Styles.nav_p}>
            <a className={Styles.a_nav} href="shopping_cart.html">
              Корзина
            </a>
          </li>
          <li className={Styles.nav_p}>
            <a className={Styles.a_nav} href="#">
              Профиль
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
