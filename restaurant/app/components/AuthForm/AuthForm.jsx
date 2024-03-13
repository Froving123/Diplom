"use client";  

import React, { useEffect, useState } from "react";
import Styles from "./AuthForm.module.css";
import { auth } from "@/app/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const AuthForm = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const toggleForm = (e) => {
    e.preventDefault();
    setIsLoginForm(!isLoginForm);
    setError("")
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      // Добавьте здесь логику для авторизации
      console.log("Авторизационные данные отправлены");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      // Добавьте здесь логику для отправки данных регистрации
      console.log("Регистрационные данные отправлены");
    }
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <form className={Styles["form"]}>
      {isLoginForm ? (
        <>
          <h2 className={Styles["form__title"]}>Авторизация</h2>
          <div className={Styles["form__fields"]}>
            <label className={Styles["form__field"]}>
              <input
                className={Styles["form__field-input"]}
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Пароль</span>
              <input
                className={Styles["form__field-input"]}
                type="password"
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          {error && <p className={Styles.error_message}>{error}</p>}
          <div className={Styles["form__actions"]}>
            <button className={Styles["form__reset"]} type="reset" onClick={handleClear}>
              Очистить
            </button>
            <button className={Styles["form__transition"]} onClick={toggleForm}>
              Нет аккаунта
            </button>
            <button onClick={handleLogin} className={Styles["form__submit"]}>
              Войти
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className={Styles["form__title"]}>Регистрация</h2>
          <div className={Styles["form__fields"]}>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Имя</span>
              <input
                className={Styles["form__field-input"]}
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Email</span>
              <input
                className={Styles["form__field-input"]}
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Пароль</span>
              <input
                className={Styles["form__field-input"]}
                type="password"
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          {error && <p className={Styles.error_message}>{error}</p>}
          <div className={Styles["form__actions"]}>
            <button className={Styles["form__reset"]} type="reset" onClick={handleClear}>
              Очистить
            </button>
            <button className={Styles["form__transition"]} onClick={toggleForm}>
              Уже есть аккаунт?
            </button>
            <button onClick={handleRegister} className={Styles["form__submit"]}>
              Зарегистрироваться
            </button>
          </div>
        </>
      )}
    </form>
  );
};
