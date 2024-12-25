"use client";

import React, { useState } from "react";
import Styles from "./AdminAuthForm.module.css";
import { useRouter } from "next/navigation";

export const AdminAuthForm = (props) => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleForm = (e) => {
    e.preventDefault();
    setIsLoginForm(!isLoginForm);
    setError("");
  };

  const validatePassword = (password) => password.length >= 6; // Пример для пароля

  const createPassword = (e) => {
    e.preventDefault();
    // Проверка на заполнение всех полей
    if (!login || !password || !copyPassword) {
      setError("Пожалуйста, заполните все поля");
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

    fetch("http://localhost:5000/api/admin/create-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
        password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) {
          setError(result.message || "Ошибка при создании пароля");
          setTimeout(() => {
            setError("");
          }, 3000);
          return;
        }

        // Очищаем формы
        setError("");
        setLogin("");
        setCopyPassword("");
        setPassword("");
        alert("Сотрудник успешно создал пароль");
        props.close();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных на сервер:", error);
        setError("Ошибка при создании пароля");
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  const logIn = (e) => {
    e.preventDefault();

    if (!login || !password) {
      setError("Пожалуйста, заполните все поля");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
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
        localStorage.setItem("authTokenAdmin", result.token);

        // Обновляем состояние в Header
        props.updateAuthAdmin({ token: result.token });

        // Очищаем формы
        setError("");
        setLogin("");
        setPassword("");
        alert("Сотрудник успешно авторизован");
        props.close();

        // Перенаправляем пользователя на нужную страницу в зависимости от логина
        if (login.toLowerCase() === "contman") {
          router.push("/Contman/Menu");
        } else if (login.toLowerCase() === "manord") {
          router.push("/Manord/NewOrder");
        } else if (login.toLowerCase() === "deliver") {
          router.push("/Cour/ReadyOrder");
        } else {
          setError("Неизвестный пользователь");
          setTimeout(() => {
            setError("");
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Ошибка при отправке данных на сервер:", error);
        setError("Ошибка при авторизации");
        setTimeout(() => {
          setError("");
        }, 3000);
      });
  };

  const handleClear = () => {
    setLogin("");
    setPassword("");
    setCopyPassword("");
  };

  return (
    <form className={Styles["form"]}>
      {isLoginForm ? (
        <>
          <h2 className={Styles["form__title"]}>Авторизация</h2>
          <div className={Styles["form__fields"]}>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Логин</span>
              <input
                className={Styles["form__field-input"]}
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
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
              Нет пароля
            </button>
            <button onClick={logIn} className={Styles["form__submit"]}>
              Войти
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className={Styles["form__title"]}>Создание пароля</h2>
          <div className={Styles["form__fields"]}>
            <label className={Styles["form__field"]}>
              <span className={Styles["form__field-title"]}>Логин</span>
              <input
                className={Styles["form__field-input"]}
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
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
              Уже есть пароль
            </button>
            <button onClick={createPassword} className={Styles["form__submit"]}>
              Сохранить пароль
            </button>
          </div>
        </>
      )}
    </form>
  );
};
