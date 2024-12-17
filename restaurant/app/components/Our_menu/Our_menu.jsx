import Styles from "./Our_menu.module.css";

export const Our_menu = () => {
  return (
    <div className={Styles.our_menu}>
      <h2 className={Styles.menu_h}>Меню ресторана</h2>
      <img className={Styles.menu} src="images/menu.png" />
    </div>
  );
};
