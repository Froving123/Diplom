"use client";

import Styles from "./AuthDetails.module.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserReservations } from "../Reservations/Reservations";
import { Delivery_user } from "../Delivery_user/Delivery_user";

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
    <div className={Styles.str_profile}>
      {authUser ? (
        <div className={Styles.profile}>
          <p className={Styles.user}>{`Здравствуйте ${authUser.email}`}</p>
          <UserReservations />
          <Delivery_user />
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
