"use client";

import React, { useState } from "react";
import Styles from "./AuthForm.module.css";

export const AuthForm = (props) => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [last, setLast] = useState("");
  const [name, setName] = useState("");
  const [fat, setFat] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");

  const toggleForm = (e) => {
    e.preventDefault();
    setIsLoginForm(!isLoginForm);
    setError("");
  };

  const register = (e) => {
    e.preventDefault();
    if (
      !email ||
      !password ||
      !copyPassword ||
      !last ||
      !name ||
      !fat ||
      !tel
    ) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      e.preventDefault();
      if (copyPassword !== password) {
        setError("пароли не совпадают");
        setTimeout(() => {
          setError("");
        }, 5000);
        return;
      }
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          console.log(user);
          setError("");
          setEmail("");
          setCopyPassword("");
          setPassword("");
          props.close();
          alert("Пользователь успешно авторизован!");
        })
        .catch((error) => console.log(error));
    }
  };

  const logIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          console.log(user);
          setError("");
          setEmail("");
          setPassword("");
          props.close();
          alert("Пользователь успешно авторизован!");
        })
        .catch((error) => {
          console.log(error);
          setError("Неправильная почта или пароль");
          setTimeout(() => {
            setError("");
          }, 5000);
        });
    }
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
    setCopyPassword("");
    setLast("");
    setName("");
    setFat("");
    setTel("");
  };

  const handleRussianInput = (setter) => (e) => {
    const value = e.target.value.replace(/[^А-Яа-яЁё\s]/g, ''); // Удаляет все, кроме русских букв и пробелов
    const formattedValue = value.replace(/(^|\s)([А-Яа-яЁё])/g, (match) => match.toUpperCase()); // Преобразует первую букву каждого слова в верхний регистр
    setter(formattedValue);
  };

  return (
    <form className={Styles["form"]}>
      {isLoginForm ? (
        <>
          <h2 className={Styles["form__title"]}>Авторизация</h2>
          <div className={Styles["form__fields"]}>
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
            <button
              className={Styles["form__reset"]}
              type="reset"
              onClick={handleClear}
            >
              Очистить
            </button>
            <button className={Styles["form__transition"]} onClick={toggleForm}>
              Нет аккаунта
            </button>
            <button onClick={logIn} className={Styles["form__submit"]}>
              Войти
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className={Styles["form__title"]}>Регистрация</h2>
          <div className={Styles["form__fields"]}>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Фамилия</span>
              <input
                className={Styles["form__field-input"]}
                type="text"
                placeholder="Иванов"
                value={last}
                onChange={handleRussianInput(setLast)}
              />
            </label>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Имя</span>
              <input
                className={Styles["form__field-input"]}
                type="text"
                placeholder="Иван"
                value={name}
                onChange={handleRussianInput(setName)}
              />
            </label>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Отчество</span>
              <input
                className={Styles["form__field-input"]}
                type="text"
                placeholder="Иванов"
                value={fat}
                onChange={handleRussianInput(setFat)}
              />
            </label>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>
                Номер телефона
              </span>
              <input
                className={Styles["form__field-input"]}
                type="tel"
                placeholder="80000000000"
                value={tel}
                onChange={(e) => setNumber(e.target.value)}
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
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>
                Подтвердите пароль
              </span>
              <input
                className={Styles["form__field-input"]}
                type="password"
                placeholder="***********"
                value={copyPassword}
                onChange={(e) => setCopyPassword(e.target.value)}
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
            <button className={Styles["form__transition"]} onClick={toggleForm}>
              Уже есть аккаунт?
            </button>
            <button onClick={register} className={Styles["form__submit"]}>
              Зарегистрироваться
            </button>
          </div>
        </>
      )}
    </form>
  );
};
