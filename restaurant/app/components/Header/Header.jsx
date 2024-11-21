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

  const logout = () => {
    // Удаляем токен и обновляем состояние
    localStorage.removeItem("authToken");
    setAuthUser(null);
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
          {/* Другие пункты меню */}
          <li className={Styles.nav_p}>
            {authUser ? (
              <>
                <Link
                  href="/Profile"
                  className={`${Styles.nav_link} ${
                    pathname === "/Profile" ? Styles.nav_link_active : ""
                  }`}
                >
                  Профиль
                </Link>
                <button onClick={logout} className={Styles.button_profile}>
                  Выйти
                </button>
              </>
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
