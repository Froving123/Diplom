"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Styles from "./Footer.module.css";

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className={Styles.all_footer}>
      <div className={Styles.top_footer}>
        {pathname === "/" ? (
          <img className={Styles.logo} src="./images/logo.png" />
        ) : (
          <Link href="/" className={Styles.logo_link}>
            <img className={Styles.logo} src="./images/logo.png" />
          </Link>
        )}
        <div className={Styles.footer_info}>
          <p className={Styles.top_fot_h}>Позвонить нам</p>
          <p className={Styles.top_fot_p}>+7(919)449-26-26</p>
        </div>
        <div className={Styles.footer_info}>
          <p className={Styles.top_fot_h}>График работы</p>
          <p className={Styles.top_fot_p}>Круглосуточно</p>
          <p className={Styles.top_fot_p}>24 часа</p>
        </div>
        <div className={Styles.footer_info}>
          <p className={Styles.top_fot_h}>Прийти к нам</p>
          <p className={Styles.top_fot_p}>Санкт-Петербург, Лесная, 20</p>
        </div>
      </div>
      <hr className={Styles.hr_footer} />
      <h4 className={Styles.fot_copyright}>Best Rest. ® 2024</h4>
    </footer>
  );
};
