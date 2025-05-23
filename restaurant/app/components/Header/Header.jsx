"use client";

import Styles from "./Header.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";

export const Header = () => {
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Проверка наличия токена в localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      // Если токен есть, устанавливаем пользователя как авторизованного
      setAuthUser({ token });
    } else {
      setAuthUser(null);
    }
  }, []);

  const openPopup = () => {
    setPopupIsOpened(true);
  };

  const closePopup = () => {
    setPopupIsOpened(false);
  };

  return (
    <header className={Styles.header}>
      {pathname === "/" ? (
        <img className={Styles.logo} src="/images/logo.png" />
      ) : (
        <Link href="/" className={Styles.logo_link}>
          <img className={Styles.logo} src="/images/logo.png" />
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
              href="/Cart"
              className={`${Styles.nav_link} ${
                pathname === "/Cart" ? Styles.nav_link_active : ""
              }`}
            >
              Корзина
            </Link>
          </li>
          <li className={Styles.nav_p}>
            {authUser ? (
              <Link
                href="/Profile"
                className={`${Styles.nav_link} ${
                  pathname === "/Profile" ? Styles.nav_link_active : ""
                }`}
              >
                Профиль
              </Link>
            ) : (
              <button className={Styles.button_profile} onClick={openPopup}>
                Войти
              </button>
            )}
          </li>
        </ul>
      </nav>
      <Overlay isOpened={popupIsOpened} close={closePopup} />
      <Popup isOpened={popupIsOpened} close={closePopup}>
        <AuthForm close={closePopup} updateAuthUser={setAuthUser} />
      </Popup>
    </header>
  );
};
