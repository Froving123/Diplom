import Styles from "./Delivery_menu.module.css";

export const Delivery_menu = () => {
  return (
    <div className={Styles.delivery_menu} id="nav_three">
      <h2 className={Styles.delivery_h}>Закажите до дома</h2>
      <div className={Styles.foods}>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="./images/pancakes.png" />
          <h3 className={Styles.food_h}>Блины</h3>
          <p className={Styles.price_menu}>1500₽</p>
          <button className={Styles.button_menu_delivery}>Добавить в корзину</button>
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="./images/meat_delivery.png" />
          <h3 className={Styles.food_h}>Стейк</h3>
          <p className={Styles.price_menu}>1500₽</p>
          <button className={Styles.button_menu_delivery}>Добавить в корзину</button>
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="./images/eggs_bacon.png" />
          <h3 className={Styles.food_h}>
            Яйца с ветчиной <br />
            или беконом
          </h3>
          <div className={Styles.lowprice_div}>
            <p className={Styles.price_menu}>
              <strike className="strike">1000₽</strike>
            </p>
            <p className={Styles.lowprice_menu}>
              <sub>500₽</sub>
            </p>
          </div>
          <button className={Styles.button_menu_delivery}>Добавить в корзину</button>
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="./images/eggs_tomato.png" />
          <h3 className={Styles.food_h}>
            Омлет с помидором <br />и сыром фета
          </h3>
          <div className={Styles.lowprice_div}>
            <p className={Styles.price_menu}>
              <strike className="strike">1000₽</strike>
            </p>
            <p className={Styles.lowprice_menu}>
              <sub>500₽</sub>
            </p>
          </div>
          <button className={Styles.button_menu_delivery}>Добавить в корзину</button>
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="./images/burrito.png" />
          <h3 className={Styles.food_h}>Буррито</h3>
          <div className={Styles.lowprice_div}>
            <p className={Styles.price_menu}>
              <strike className="strike">1000₽</strike>
            </p>
            <p className={Styles.lowprice_menu}>
              <sub>500₽</sub>
            </p>
          </div>
          <button className={Styles.button_menu_delivery}>Добавить в корзину</button>
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="./images/milkShake_delivery.png" />
          <h3 className={Styles.food_h}>Молочный коктель</h3>
          <p className={Styles.price_menu}>180₽</p>
          <button className={Styles.button_menu_delivery}>Добавить в корзину</button>
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="./images/coffee_delivery.png" />
          <h3 className={Styles.food_h}>Кофе</h3>
          <p className={Styles.price_menu}>180₽</p>
          <button className={Styles.button_menu_delivery}>Добавить в корзину</button>
        </div>
        <div className={Styles.food}>
          <img className={Styles.img_food} src="./images/juice.png" />
          <h3 className={Styles.food_h}>Сок</h3>
          <p className={Styles.price_menu}>180₽</p>
          <button className={Styles.button_menu_delivery}>Добавить в корзину</button>
        </div>
      </div>
    </div>
  );
};
