import Styles from "./Advantages.module.css";

export const Advantages = () => {
  return (
    <div className={Styles.advantages}>
      <div className={Styles.advantage}>
        <img className={Styles.advantages_img} src="/images/rest.png" />
        <p className={Styles.advantage_main}>Магическая Атмосфера</p>
        <p className={Styles.advantage_p}>
          В нашем заведении царит <br /> магическая атмосфера <br /> наполненная
          вкусными <br /> ароматами
        </p>
      </div>
      <div className={Styles.advantage}>
        <img className={Styles.advantages_img} src="/images/good.png" />
        <p className={Styles.advantage_main}>Лучшее качество Еды</p>
        <p className={Styles.advantage_p}>
          Качество нашей <br /> Еды - отменное!
        </p>
      </div>
      <div className={Styles.advantage}>
        <img className={Styles.advantages_img} src="/images/low.png" />
        <p className={Styles.advantage_main}>Недорогая Еда</p>
        <p className={Styles.advantage_p}>
          Стоимость нашей Еды <br /> зависит только от ее <br /> количества.
          Качество <br /> всегда на высоте!
        </p>
      </div>
      <div className={Styles.advantage}>
        <img className={Styles.advantages_img} src="/images/delivery.png" />
        <p className={Styles.advantage_main}>Еда прямо до Дома</p>
        <p className={Styles.advantage_p}>
          Нет ничего дороже времени,
          <br /> так что берегите его. <br /> Обращайтесь к нам!
        </p>
      </div>
    </div>
  );
};
