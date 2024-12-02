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

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email); // пароль для почты
  const validatePhone = (phone) => /^\d{11}$/.test(phone); // Пример для номера телефона
  const validatePassword = (password) => password.length >= 6; // Пример для пароля
  const russianInput = (input) => (e) => {
    const value = e.target.value.replace(/[^А-Яа-яЁё]/g, "");
    const formattedValue = value.replace(/(^)([а-яё])/g, (match) =>
      match.toUpperCase()
    );
    input(formattedValue);
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
      }, 3000);
      return;
    }

    // проверка на корректность поля email
    if (!validateEmail(email)) {
      setError("Неверный формат email");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    // проверка на корректность поля phone
    if (!validatePhone(phone)) {
      setError("Неверный формат телефона");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    // проверка на корректность поля password
    if (!validatePassword(password)) {
      setError("Пароль должен быть не менее 6 символов");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    // Проверка на совпадение паролей
    if (copyPassword !== password) {
      setError("Пароли не совпадают");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    fetch("http://localhost:5000/api/user/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        last_name,
        name,
        surname,
        phone,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) {
          setError(result.message || "Ошибка при регистрации");
          setTimeout(() => {
            setError("");
          }, 3000);
          return;
        }

        // Сохраняем токен в localStorage
        localStorage.setItem("authToken", result.token);

        // Обновляем состояние в Header
        props.updateAuthUser({ token: result.token });

        // Очищаем формы
        setError("");
        setEmail("");
        setCopyPassword("");
        setPassword("");
        setLast_name("");
        setName("");
        setSurname("");
        setPhone("");
        alert("Пользователь успешно зарегистрирован");
        props.close();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных на сервер:", error);
        setError("Ошибка при регистрации");
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  const logIn = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (!result.success) {
            setError(result.message || "Ошибка при авторизации");
            setTimeout(() => {
              setError("");
            }, 3000);
            return;
          }

          // Сохраняем токен в localStorage
          localStorage.setItem("authToken", result.token);

          // Обновляем состояние в Header
          props.updateAuthUser({ token: result.token });

          // Очищаем формы
          setError("");
          setEmail("");
          setPassword("");
          alert("Пользователь успешно авторизован");
          props.close();
          window.location.reload();
        })
        .catch((error) => {
          console.error("Ошибка при отправке данных на сервер:", error);
          setError("Ошибка при авторизации");
          setTimeout(() => {
            setError("");
          }, 3000);
        });
    }
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
                placeholder="******"
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
                onChange={russianInput(setLast_name)}
              />
            </label>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Имя</span>
              <input
                className={Styles["form__field-input"]}
                type="text"
                placeholder="Иван"
                value={name}
                onChange={russianInput(setName)}
              />
            </label>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Отчество</span>
              <input
                className={Styles["form__field-input"]}
                type="text"
                placeholder="Иванович"
                value={surname}
                onChange={russianInput(setSurname)}
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
                placeholder="******"
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
                placeholder="******"
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
