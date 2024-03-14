"use client";

import Styles from "./AuthDetails.module.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Reservation } from "../Reservation/Reservation";
import { Delivery_user } from "../Delivery_user/Delivery_user";
import { Changing_email } from "../Changing/Changing_email/Changing_email";
import { Changing_password } from "../Changing/Changing_password/Changing_password";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);
  function userSignOut() {
    signOut(auth)
      .then(() => console.log("success"))
      .catch((e) => console.log(e));
  }
  return (
    <div>
      {authUser ? (
        <div className={Styles.profile}>
          <p className={Styles.user}>{`Пользователь: ${authUser.email}`}</p>
          <Reservation />
          <Delivery_user />
          <Changing_email />
          <Changing_password />
          <Link href="/">
            <button className={Styles.button_logOut} onClick={userSignOut}>
              Выйти
            </button>
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AuthDetails;
