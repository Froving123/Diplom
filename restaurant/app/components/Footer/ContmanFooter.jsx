"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Styles from "./Contman.module.css";

export const ContmanFooter = () => {
  const pathname = usePathname();

  return (
    <footer className={Styles.all_footer}>
      <div className={Styles.top_footer}>
        {pathname === "/Contman" ? (
          <img className={Styles.logo} src="/images/logo.png" />
        ) : (
          <Link href="/Contman" className={Styles.logo_link}>
            <img className={Styles.logo} src="/images/logo.png" />
          </Link>
        )}
        <div className={Styles.footer_info}>
          <p className={Styles.top_fot_h}>Позвонить нам</p>
          <p className={Styles.top_fot_p}>+7(919)449-26-26</p>
        </div>
        <div className={Styles.footer_info}>
          <p className={Styles.top_fot_h}>График работы</p>
          <p className={Styles.top_fot_p}>ПН-ВС</p>
          <p className={Styles.top_fot_p}>07:00-00:00</p>
        </div>
        <div className={Styles.footer_info}>
          <p className={Styles.top_fot_h}>Прийти к нам</p>
          <p className={Styles.top_fot_p}>Березники, Мира, 20</p>
        </div>
      </div>
      <hr className={Styles.hr_footer} />
      <h4 className={Styles.fot_copyright}>Best Rest. ® 2024</h4>
    </footer>
  );
};
