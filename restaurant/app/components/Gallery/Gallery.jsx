import Styles from "./Gallery.module.css";

export const Gallery = () => {
  return (
    <div className={Styles.gallery}>
      <h2 className={Styles.gallery_h}>Галерея</h2>
      <div className={Styles.imges_rest}>
        <img className={Styles.img_rest} src="/images/rest_zal.png" />
        <img className={Styles.img_rest} src="/images/coffee.png" />
        <img className={Styles.img_rest} src="/images/meat.png" />
        <img className={Styles.img_rest} src="/images/eggs.png" />
        <img className={Styles.img_rest} src="/images/milkShake.png" />
        <img className={Styles.img_rest} src="/images/rest_zal1.png" />
      </div>
    </div>
  );
};
