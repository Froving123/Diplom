"use client";

import Styles from "./Header.module.css";
import Link from "next/link";
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
      <Link href="/">
        <img className={Styles.logo} src="images/logo.png" />
      </Link>
      <nav>
        <ul className={Styles.ul_header}>
          <li className={Styles.nav_p}>
            <Link className={Styles.nav_link} href="/AboutUs">
              О нас
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link className={Styles.nav_link} href="/Menu">
              Меню
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link className={Styles.nav_link} href="/Delivery">
              Доставка
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link className={Styles.nav_link} href="/ShoppingCart">
              Корзина
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <button className={Styles.button_profile} onClick={openPopup}>
              Профиль
            </button>
          </li>
        </ul>
      </nav>
      <Overlay isOpened={popupIsOpened} close={closePopup} />
      <Popup isOpened={popupIsOpened} close={closePopup}>
        <AuthForm />
      </Popup>
    </header>
  );
};
