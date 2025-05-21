"use client";

import Styles from "./CourHeader.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const CourHeader = () => {
  const pathname = usePathname();
  const [authAdmin, setAuthAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authTokenAdmin");

    if (!token) {
      return;
    }

    fetch("/api/admin/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const hasAdminRole =
          data.success &&
          Array.isArray(data.user.roles) &&
          data.user.roles.some((role) => role.id === 3);

        if (hasAdminRole) {
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
  }, []);

  const adminSignOut = () => {
    localStorage.removeItem("authTokenAdmin");
    setAuthAdmin(null);
    window.location.href = "/Admin";
  };

  return (
    <header className={Styles.header}>
      <img className={Styles.logo} src="/images/logo.png" />
      <nav>
        <ul className={Styles.ul_header}>
          <li className={Styles.nav_p}>
            <Link
              href="/Cour/ReadyOrder"
              className={`${Styles.nav_link} ${
                pathname === "/Cour/ReadyOrder" ? Styles.nav_link_active : ""
              }`}
            >
              Готовые заказы
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Cour/CourOrder"
              className={`${Styles.nav_link} ${
                pathname === "/Cour/CourOrder" ? Styles.nav_link_active : ""
              }`}
            >
              Взятые заказы
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Cour/StoryOrder"
              className={`${Styles.nav_link} ${
                pathname === "/Cour/StoryOrder" ? Styles.nav_link_active : ""
              }`}
            >
              Выполненые заказы
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
