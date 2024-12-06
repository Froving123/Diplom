"use client";

import { useState, useEffect } from "react";
import Styles from "./Discount.module.css";
import Link from "next/link";

export const Discount = () => {
  const [discountedItem, setDiscountedItem] = useState({
    price: null,
    category: null,
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
          setDiscountedItem({ price: data.price, category: data.category });
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
          {discountedItem.price !== null && discountedItem.category
            ? `Только в этом месяце ${discountedItem.category} ${discountedItem.price}₽`
            : ""}
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
