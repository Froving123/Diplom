"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Contman_menu.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { PriceForm } from "../PriceForm/PriceForm";

export const Contman_menu = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    // Загрузка категорий
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/delivery/categories"
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          console.error("Ошибка загрузки категорий:", data.message);
        }
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };

    // Загрузка блюд
    const fetchDishes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/delivery/menu");
        const data = await response.json();
        if (response.ok) {
          setDishes(data.menu);
        } else {
          console.error("Ошибка при получении блюд:", data.message);
        }
      } catch (error) {
        console.error("Ошибка при загрузке блюд:", error);
      }
    };

    fetchCategories();
    fetchDishes();
  }, []);

  // Открыть форму изменения цены с выбранным блюдом
  const openPriceForm = (dish) => {
    setSelectedDish(dish);
    setPopupIsOpen(true);
  };

  return (
    <div className={Styles.delivery_menu}>
      <h2 className={Styles.delivery_h}>Меню доставки</h2>
      <div className={Styles.foods}>
        {categories.map((category) => (
          <div key={category.ID} className={Styles.category}>
            <h2 className={Styles.category_h}>{category.Наименование}</h2>
            <hr className={Styles.hr_name} />
            <div className={Styles.foods_category}>
              {dishes
                .filter((dish) => dish.Категория === category.Наименование)
                .map((dish) => (
                  <div key={dish.ID} className={Styles.food}>
                    <img
                      className={Styles.img_food}
                      src={dish.Фото}
                      alt={dish.Название}
                    />
                    <h3 className={Styles.food_h}>{dish.Название}</h3>
                    <p className={Styles.price_menu}>
                      {dish.Скидка ? (
                        <>
                          <span className={Styles.old_price}>
                            {dish.Цена_без_скидки}₽
                          </span>{" "}
                          <span className={Styles.new_price}>
                            {dish.Цена_со_скидкой}₽
                          </span>
                        </>
                      ) : (
                        `${dish.Цена_без_скидки}₽`
                      )}
                    </p>
                    <button
                      className={Styles.button_menu_delivery}
                      onClick={() => openPriceForm(dish)}
                    >
                      Изменить цену блюда
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <Overlay isOpened={popupIsOpen} close={() => setPopupIsOpen(false)} />
      <Popup isOpened={popupIsOpen} close={() => setPopupIsOpen(false)}>
        <PriceForm
          close={() => setPopupIsOpen(false)}
          dish={selectedDish} // Передаем выбранное блюдо
        />
      </Popup>
    </div>
  );
};
