import Styles from "./Our_menu.module.css";

export const Our_menu = () => {
  return (
    <div className={Styles.our_menu} id="nav_two">
      <h2 className={Styles.menu_h}>Наше меню</h2>
      <img className={Styles.menu} src="./images/menu.png" />
    </div>
  );
};
