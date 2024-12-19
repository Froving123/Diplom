"use client";

import Styles from "./Header.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const ContmanHeader = () => {
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Проверка наличия токена в localStorage
    const token = localStorage.getItem("authTokenAdmin");
    if (token) {
      // Если токен есть, устанавливаем пользователя как авторизованного
      setAuthUser({ token });
    } else {
      setAuthUser(null);
    }
  }, []);

  return (
    <header className={Styles.header}>
      {pathname === "/Contman" ? (
        <img className={Styles.logo} src="/images/logo.png" />
      ) : (
        <Link href="/Contman" className={Styles.logo_link}>
          <img className={Styles.logo} src="/images/logo.png" />
        </Link>
      )}
      <nav>
        <ul className={Styles.ul_header}>
          <li className={Styles.nav_p}>
            <Link
              href="/Contman/Menu"
              className={`${Styles.nav_link} ${
                pathname === "/Contman/Menu" ? Styles.nav_link_active : ""
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
              <Link
                href="/ProfileAdmin"
                className={`${Styles.nav_link} ${
                  pathname === "/ProfileAdmin" ? Styles.nav_link_active : ""
                }`}
              >
                Профиль
              </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};