import Styles from "./Our_story.module.css";

export const Our_story = () => {
  return (
    <div className={Styles.our_story}>
      <div className={Styles.left_story}>
        <h2 className={Styles.story_h}>Коротко о нас</h2>
        <p className={Styles.story_p}>
          Основной принцип нашего ресторана - отличное <br />
          качество и исполнение блюд. Никаких консервантов, <br />
          красителей и усилителей вкуса! Натуральные <br />
          продукты дарят нашим гостям удивительные по вкусу <br />
          лакомства, а непринужденная атмосфера располагает <br />
          к романтическим ужинам и семейным праздникам. <br />
        </p>
      </div>
      <div className={Styles.right_story}>
        <img className={Styles.story_img} src="./images/img-story.svg" />
      </div>
    </div>
  );
};
