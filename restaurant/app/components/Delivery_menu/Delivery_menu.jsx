"use client";

import React, { useState, useEffect } from "react";
import Styles from "./Delivery_menu.module.css";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";

export const Delivery_menu = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Функция для загрузки категорий
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

    // Функция для загрузки блюд
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

    // Проверяем, авторизован ли пользователь
    const token = localStorage.getItem("authToken");
    setAuthUser(token ? { token } : null);

    fetchCategories();
    fetchDishes();
  }, []);

  // Обработчик добавления блюда в корзину
  const handleAddToCart = async (dishId) => {
    if (!authUser) {
      setPopupIsOpen(true); // Открываем форму авторизации, если пользователь не авторизован
      return;
    }

    try {
      // Создаём корзину, если она ещё не создана
      const createBucketResponse = await fetch(
        "http://localhost:5000/api/bucket/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUser.token}`,
          },
        }
      );

      const bucketResult = await createBucketResponse.json();
      if (!createBucketResponse.ok) {
        alert(bucketResult.message || "Ошибка при создании корзины");
        return;
      }

      // Добавляем блюдо в корзину
      const response = await fetch("http://localhost:5000/api/bucket/foot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify({ foodId: dishId }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Блюдо добавлено в корзину");
      } else {
        alert(result.message || "Ошибка при добавлении блюда в корзину");
      }
    } catch (err) {
      console.error("Ошибка при добавлении в корзину:", err);
    }
  };

  // Отображение интерфейса
  return (
    <div className={Styles.delivery_menu}>
      <h2 className={Styles.delivery_h}>Закажите домой</h2>
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
                    <p className={Styles.price_menu}>{dish.Цена} ₽</p>
                    <button
                      className={Styles.button_menu_delivery}
                      onClick={() => handleAddToCart(dish.ID)}
                    >
                      Добавить в корзину
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <Overlay isOpened={popupIsOpen} close={() => setPopupIsOpen(false)} />
      <Popup isOpened={popupIsOpen} close={() => setPopupIsOpen(false)}>
        <AuthForm
          close={() => setPopupIsOpen(false)}
          updateAuthUser={setAuthUser}
        />
      </Popup>
    </div>
  );
};
