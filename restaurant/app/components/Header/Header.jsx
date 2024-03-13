"use client";

import Styles from "./Header.module.css";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";

export const Header = () => {
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  const pathname = usePathname();

  const openPopup = () => {
    setPopupIsOpened(true);
  };

  const closePopup = () => {
    setPopupIsOpened(false);
  };

  return (
    <header className={Styles.header}>
      {pathname === "/" ? (
        <img className={Styles.logo} src="./images/logo.png" />
      ) : (
        <Link href="/" className={Styles.logo_link}>
          <img className={Styles.logo} src="./images/logo.png" />
        </Link>
      )}
      <nav>
        <ul className={Styles.ul_header}>
          <li className={Styles.nav_p}>
            <Link
              href="/AboutUs"
              className={`${Styles.nav_link} ${
                pathname === "/AboutUs" ? Styles.nav_link_active : ""
              }`}
            >
              О нас
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Menu"
              className={`${Styles.nav_link} ${
                pathname === "/Menu" ? Styles.nav_link_active : ""
              }`}
            >
              Меню
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Delivery"
              className={`${Styles.nav_link} ${
                pathname === "/Delivery" ? Styles.nav_link_active : ""
              }`}
            >
              Доставка
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/ShoppingCart"
              className={`${Styles.nav_link} ${
                pathname === "/ShoppingCart" ? Styles.nav_link_active : ""
              }`}
            >
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
        <AuthForm close={closePopup} />
      </Popup>
    </header>
  );
};
