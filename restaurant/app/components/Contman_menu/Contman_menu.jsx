"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Contman_menu.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { ChangeDishForm } from "../ChangeDishForm/ChangeDishForm";
import { ChangeCategoryForm } from "../ChangeCategoryForm/ChangeCategoryForm";
import { NewCategoryForm } from "../NewCategoryForm/NewCategoryForm";
import { NewDishForm } from "../NewDishForm/NewDishForm";

export const Contman_menu = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  const [popupIsOpenNC, setPopupIsOpenNC] = useState(false);
  const [popupIsOpenCC, setPopupIsOpenCC] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Загрузка категорий
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "/api/delivery/categories"
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
        const response = await fetch("/api/delivery/menu");
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

  // Открыть форму изменения блюда
  const openChangeDishForm = (dish) => {
    setSelectedDish(dish);
    setPopupIsOpen(true);
  };

  const openChangeCategoryForm = (category) => {
    setSelectedCategory(category);
    setPopupIsOpenCC(true);
  };

  // Открыть форму добавления нового блюда
  const openNewDishForm = () => {
    setPopupIsOpened(true);
  };

  // Открыть форму добавления новой категории
  const openNewCategoryForm = () => {
    setPopupIsOpenNC(true);
  };

  const removeDish = async (dishId) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить блюдо?"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
      const response = await fetch(
        "/api/contman/removeDish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dishId }), // Отправляем dishId
        }
      );

      const result = await response.json();

      if (result.success) {
        // Если успешное удаление, обновляем блюда локально
        setDishes((prevDishes) =>
          prevDishes.filter((dish) => dish.ID !== dishId)
        );
      } else {
        // Если ошибка, выводим сообщение из ответа сервера
        alert(result.message || "Ошибка при удалении блюда");
      }
    } catch (err) {
      console.error("Ошибка при удалении блюда:", err);
      alert("Произошла ошибка при попытке удалить блюдо. Попробуйте снова.");
    }
  };

  const removeCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить категорию? Она удалится со всеми блюдами"
    );
    if (!confirmDelete) {
      return; // Отмена удаления
    }

    try {
      const response = await fetch(
        "/api/contman/removeCategory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryId }), // Отправляем categoryId
        }
      );

      const result = await response.json();

      if (result.success) {
        // Если успешное удаление, обновляем категории локально
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.ID !== categoryId)
        );
      } else {
        // Если ошибка, выводим сообщение из ответа сервера
        alert(result.message || "Ошибка при удалении категории");
      }
    } catch (err) {
      console.error("Ошибка при удалении категории:", err);
      alert(
        "Произошла ошибка при попытке удалить категорию. Попробуйте снова."
      );
    }
  };

  return (
    <div className={Styles.delivery_menu}>
      <h2 className={Styles.delivery_h}>Меню доставки</h2>
      <div className={Styles.foods}>
        {categories.map((category) => (
          <div key={category.ID} className={Styles.category}>
            <div className={Styles.category_name}>
              <button
                className={Styles.button_category}
                onClick={() => removeCategory(category.ID)}
              >
                <p className={Styles.remove_text}>Удалить категорию</p>
              </button>
              <h2 className={Styles.category_h}>{category.Наименование}</h2>
              <button
                className={Styles.button_category}
                onClick={() => openChangeCategoryForm(category)}
              >
                <p className={Styles.remove_text}>Изменить категорию</p>
              </button>
            </div>
            <hr className={Styles.hr_name} />
            <div className={Styles.foods_category}>
              {dishes
                .filter((dish) => dish.Категория === category.Наименование)
                .map((dish) => (
                  <div key={dish.ID} className={Styles.food}>
                    <button
                      className={Styles.button_remove}
                      onClick={() => removeDish(dish.ID)}
                    >
                      <p className={Styles.remove_text}>Удалить блюдо</p>
                    </button>
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
                      onClick={() => openChangeDishForm(dish)}
                    >
                      Изменить блюдо
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className={Styles.create_content}>
        <button className={Styles.button_create} onClick={openNewCategoryForm}>
          Добавить категорию
        </button>
        <hr className={Styles.hr_name} />
      </div>
      <button className={Styles.button_create} onClick={openNewDishForm}>
        Добавить блюдо
      </button>
      <Overlay isOpened={popupIsOpen} close={() => setPopupIsOpen(false)} />
      <Popup isOpened={popupIsOpen} close={() => setPopupIsOpen(false)}>
        <ChangeDishForm
          close={() => setPopupIsOpen(false)}
          dish={selectedDish} // Передаем выбранное блюдо
        />
      </Popup>
      <Overlay isOpened={popupIsOpenCC} close={() => setPopupIsOpenCC(false)} />
      <Popup isOpened={popupIsOpenCC} close={() => setPopupIsOpenCC(false)}>
        <ChangeCategoryForm
          close={() => setPopupIsOpenCC(false)}
          category={selectedCategory} // Передаем выбранное блюдо
        />
      </Popup>
      <Overlay isOpened={popupIsOpened} close={() => setPopupIsOpened(false)} />
      <Popup isOpened={popupIsOpened} close={() => setPopupIsOpened(false)}>
        <NewDishForm close={() => setPopupIsOpened(false)} />
      </Popup>
      <Overlay isOpened={popupIsOpenNC} close={() => setPopupIsOpenNC(false)} />
      <Popup isOpened={popupIsOpenNC} close={() => setPopupIsOpenNC(false)}>
        <NewCategoryForm close={() => setPopupIsOpenNC(false)} />
      </Popup>
    </div>
  );
};
