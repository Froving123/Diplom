"use client";

import Styles from "./Header.module.css";
import { useState } from "react";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";

export const Header = () => {
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  
  const openPopup = () => {
    setPopupIsOpened(true);
  };

  const closePopup = () => {
    setPopupIsOpened(false);
  };

  return (
    <header className={Styles.header}>
      <img className={Styles.logo} src="images/logo.png" />
      <nav>
        <ul className={Styles.ul_header}>
        <li className={Styles.nav_p}>
            <a className={Styles.a_nav} href="#">
              О нас
            </a>
          </li>
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
            <button className={Styles.button_profile} onClick={openPopup}>
              Профиль
            </button>
          </li>
        </ul>
      </nav>
      <Overlay isOpened={popupIsOpened} close={closePopup}/>
      <Popup isOpened={popupIsOpened} close={closePopup}>
          <AuthForm />
      </Popup>
    </header>
  );
};
