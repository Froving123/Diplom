"use client";   

import React, { useState } from "react";
import Styles from "../AuthForm/AuthForm.module.css";
import { auth } from "@/app/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");
  function register(e) {
    e.preventDefault();
    if (copyPassword !== password) {
      setError("пароли не совпадают");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        setError("");
        setEmail("");
        setCopyPassword("");
        setPassword("");
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      <form onSubmit={register}>
        <h2 className={Styles["form__title"]}>Регистрация</h2>
        <label className={Styles["form__field"]}>
          <span className={Styles["form__field-title"]}>Повтор пароля</span>
          <input
            className={Styles["form__field-input"]}
            type="password"
            placeholder="повтор пароля"
            value={copyPassword}
            onChange={(e) => setCopyPassword(e.target.value)}
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
        <button className={Styles["form__submit"]} type="submit">
          Зарегистрироваться
        </button>
        {error ? <p>{error}</p>: ""}
      </form>
    </div>
  );
};
export default SignUp;
