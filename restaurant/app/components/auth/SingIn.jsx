"use client";   

import React, { useState } from "react";
import Styles from "../AuthForm/AuthForm.module.css";
import { auth } from "@/app/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function logIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        setError("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.log(error);
        setError("Такого аккаунта не существует")
      });
  }

  return (
    <div>
      <form>
        <h2 className={Styles["form__title"]}>Авторизация</h2>
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
        <button onClick={logIn} className={Styles["form__submit"]}>
          Войти
        </button>
        {error ? <p>{error}</p>: ""}
      </form>
    </div>
  );
};
export default SignIn;
