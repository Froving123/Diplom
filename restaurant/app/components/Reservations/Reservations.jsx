"use client";

import React, { useState, useEffect } from "react";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { db, auth } from "@/app/firebase";
import Styles from "./Reservations.module.css";

export const UserReservations = () => {
  const [userReservations, setUserReservations] = useState([]);

  useEffect(() => {
    const fetchUserReservations = async () => {
      const user = auth.currentUser;
      if (user) {
        const reservationsRef = ref(db, "items");
        const userReservationsQuery = query(
          reservationsRef,
          orderByChild("userId"),
          equalTo(user.uid)
        );

        try {
          const snapshot = await get(userReservationsQuery);
          if (snapshot.exists()) {
            const reservations = [];
            snapshot.forEach((childSnapshot) => {
              reservations.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });
            setUserReservations(reservations);
          } else {
            console.log("Данные не найдены");
          }
        } catch (error) {
          console.error("Ошибка при получении данных: ", error);
        }
      }
    };

    fetchUserReservations();
  }, []);

  return (
    <div className={Styles.reservation}>
      <h2 className={Styles.title_reserv}>Ваше бронирование</h2>
      {userReservations.length > 0 ? (
        <ul className={Styles.ul_reserv}>
          {userReservations.map((reservation) => (
            <li key={reservation.id}>
              <p className={Styles.reserv_description}>
                Дата: {reservation.date}
              </p>
              <p className={Styles.reserv_description}>
                Время: {reservation.time}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={Styles.ul_reserv}>
          <p className={Styles.reserv_description}>У вас нет бронирования</p>
        </ul>
      )}
    </div>
  );
};
