import Styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={Styles.all_footer}>
      <div className={Styles.top_footer}>
        <img className={Styles.logo} src="images/logo.png" />
        <div className={Styles.footer_info}>
          <p className={Styles.top_fot_h}>Позвонить нам</p>
          <p className={Styles.top_fot_p}>+7(985)330-**-**</p>
        </div>
        <div className={Styles.footer_info}>
          <p className={Styles.top_fot_h}>График работы:</p>
          <p className={Styles.top_fot_p}>ВС-ЧТ - 10:00-00:00</p>
          <p className={Styles.top_fot_p}>ПТ-СБ - 12:00-22:00</p>
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
