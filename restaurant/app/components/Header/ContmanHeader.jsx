"use client";

import Styles from "./ContmanHeader.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const ContmanHeader = () => {
  const pathname = usePathname();
  const [authAdmin, setAuthAdmin] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authTokenAdmin");

    if (token) {
      fetch("/api/admin/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.user.role.toString() === "1") {
            setAuthAdmin(data.user);
          } else {
            localStorage.removeItem("authTokenAdmin");
            window.location.href = "/Admin";
          }
        })
        .catch(() => {
          localStorage.removeItem("authTokenAdmin");
          window.location.href = "/Admin";
        });
    } else {
      window.location.href = "/Admin";
    }
  }, []);

  const adminSignOut = () => {
    localStorage.removeItem("authTokenAdmin");
    setAuthAdmin(null);
    window.location.href = "/Admin";
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className={Styles.header}>
      <img className={Styles.logo} src="/images/logo.png" />

      {/* Кнопка бургер-меню */}
      <button className={Styles.burger} onClick={toggleMenu}>
        ☰
      </button>

      {/* Навигация */}
      <nav className={`${Styles.nav} ${isMenuOpen ? Styles.open : ""}`}>
        <ul className={Styles.ul_header}>
          <li className={Styles.nav_p}>
            <Link
              href="/Contman/Menu"
              className={`${Styles.nav_link} ${
                pathname === "/Contman/Menu" ? Styles.nav_link_active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Меню доставки
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Contman/Discount"
              className={`${Styles.nav_link} ${
                pathname === "/Contman/Discount" ? Styles.nav_link_active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Специальные предложения
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Contman/HideMenu"
              className={`${Styles.nav_link} ${
                pathname === "/Contman/HideMenu" ? Styles.nav_link_active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Скрытое меню
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Contman/HideOffers"
              className={`${Styles.nav_link} ${
                pathname === "/Contman/HideOffers" ? Styles.nav_link_active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Скрытые специальные предложения
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Contman/Review"
              className={`${Styles.nav_link} ${
                pathname === "/Contman/Review" ? Styles.nav_link_active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Отзывы
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <button className={Styles.button_logout} onClick={adminSignOut}>
              Выйти
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
