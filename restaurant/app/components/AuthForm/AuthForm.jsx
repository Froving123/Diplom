"use client";

import React, { useState } from "react";
import Styles from "./AuthForm.module.css";

export const AuthForm = (props) => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [last_name, setLast_name] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
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

    // Проверка на заполнение всех полей
    if (
      !email ||
      !password ||
      !copyPassword ||
      !last_name ||
      !name ||
      !surname ||
      !phone
    ) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    // Проверка на совпадение паролей
    if (copyPassword !== password) {
      setError("Пароли не совпадают");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    // Отправка данных на сервер
    fetch("http://localhost:5000/api/user/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        last_name, // Фамилия пользователя
        name, // Имя пользователя
        surname, // Отчество пользователя
        phone, // Номер телефона пользователя
        email, // Email пользователя
        password, // Пароль пользователя
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) {
          setError(result.message || "Ошибка при регистрации");
          setTimeout(() => {
            setError("");
          }, 5000);
          return;
        }

        setError("");
        setEmail("");
        setCopyPassword("");
        setPassword("");
        setLast_name("");
        setName("");
        setSurname("");
        setPhone("");
        alert("Пользователь успешно зарегистрирован!");
        props.close();
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных на сервер:", error);
        setError("Ошибка при регистрации");
        setTimeout(() => {
          setError("");
        }, 5000);
      });
  };

  const logIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email, // Email пользователя
          password, // Пароль пользователя
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (!result.success) {
            setError(result.message || "Ошибка при авторизации");
            setTimeout(() => {
              setError("");
            }, 5000);
            return;
          }
  
          setError("");
          setEmail("");
          setPassword("");
          alert("Пользователь успешно авторизован!");
          props.close();
        })
        .catch((error) => {
          console.error("Ошибка при отправке данных на сервер:", error);
          setError("Ошибка при авторизации");
          setTimeout(() => {
            setError("");
          }, 5000);
        });
    };
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
    setCopyPassword("");
    setLast_name("");
    setName("");
    setSurname("");
    setPhone("");
  };

  const handleRussianInput = (setter) => (e) => {
    const value = e.target.value.replace(/[^А-Яа-яЁё\s]/g, "");
    const formattedValue = value.replace(/(^|\s)([А-Яа-яЁё])/g, (match) =>
      match.toUpperCase()
    );
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
                value={last_name}
                onChange={handleRussianInput(setLast_name)}
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
                placeholder="Иванович"
                value={surname}
                onChange={handleRussianInput(setSurname)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
