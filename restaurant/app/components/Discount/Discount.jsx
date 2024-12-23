"use client";

import { useState, useEffect } from "react";
import Styles from "./Discount.module.css";
import Link from "next/link";

export const Discount = () => {
  const [discountedItem, setDiscountedItem] = useState({
    price: null,
    dishName: null,
  });

  useEffect(() => {
    // Функция для получения цены товара с учётом скидки
    const fetchDiscountedItem = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/delivery/discount"
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setDiscountedItem({ price: data.price, dishName: data.dishName });
        } else {
          console.error("Ошибка загрузки данных о скидке:", data.message);
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных о скидке:", error);
      }
    };

    fetchDiscountedItem();
  }, []);

  return (
    <div className={Styles.discount}>
      <div className={Styles.left_discount}>
        <h2 className={Styles.discount_h}>
          Закажите еду от одного из <br /> самых лучших ресторанов.
        </h2>
        <p className={Styles.discount_p}>
          {discountedItem.price !== null && discountedItem.dishName
            ? `Специальное предложение: блюдо "${discountedItem.dishName}" со скидкой стоит ${discountedItem.price}₽`
            : "Сейчас нет специальных предложений."}
        </p>
      </div>
      <div className={Styles.right_discount}>
        <Link href="/Delivery">
          <button className={Styles.button_delivery}>Заказать</button>
        </Link>
      </div>
    </div>
  );
};
