"use client";

import Styles from "./ManordHeader.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const ManordHeader = () => {
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
          data.user.roles.some((role) => role.id === 2);

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
              href="/Manord/NewOrder"
              className={`${Styles.nav_link} ${
                pathname === "/Manord/NewOrder" ? Styles.nav_link_active : ""
              }`}
            >
              Новые заказы
            </Link>
          </li>
          <li className={Styles.nav_p}>
            <Link
              href="/Manord/ConfirmedOrder"
              className={`${Styles.nav_link} ${
                pathname === "/Manord/ConfirmedOrder"
                  ? Styles.nav_link_active
                  : ""
              }`}
            >
              Принятые заказы
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
