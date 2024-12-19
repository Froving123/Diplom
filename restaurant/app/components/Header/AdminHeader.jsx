"use client";

import Styles from "./AdminHeader.module.css";

export const AdminHeader = () => {
  return (
    <header className={Styles.Aheader}>
        <img className={Styles.logo} src="/images/logo.png" />
    </header>
  );
};
