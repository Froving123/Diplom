"use client";

import React, { useState, useEffect } from "react";
import Styles from "./ReservForm.module.css";
import {
  collection,
  addDoc,
  getDoc,
  querySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

export const ReservForm = (props) => {
  const [items, setItems] = useState([
  ]);
  const [newItem, setNewItem] = useState({ date: "", time: "" });
  const [total, setTotal] = useState(0);
const [error, setError] = useState("");

  const reserv = async (e) => {
    e.preventDefault();
      if (!newItem.date || !newItem.time) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
    if (newItem.date !== "" && newItem.time !== "") {
      await addDoc(collection(db, "items"), {
        date: newItem.date,
        time: newItem.time,
      });
      setNewItem({ date: "", time: "" });
      setError("");
      props.close();
      alert("Ваша бронь принята");
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  const handleClear = () => {
    setDate("");
    setTime("");
  };

  return (
    <form className={Styles["form"]}>
      <h2 className={Styles["form__title"]}>Бронирование</h2>
      <div className={Styles["form__fields"]}>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Дата</span>
          <input
            className={Styles["form__field-input"]}
            type="date"
            value={newItem.date}
            onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
          />
        </label>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Время</span>
          <input
            className={Styles["form__field-input"]}
            type="time"
            value={newItem.time}
            onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
          />
        </label>
      </div>
      {error && <p className={Styles.error_message}>{error}</p>}
      <div className={Styles["form__actions"]}>
        <button
          className={Styles["form__reset"]}
          type="reset"
          onClick={handleClear}
        >
          Очистить
        </button>
        <button onClick={reserv} className={Styles["form__submit"]}>
          Забронировать
        </button>
      </div>
    </form>
  );
};