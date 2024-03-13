"use client";

import { auth } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";

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
        <div>
          <p>{`Авторизованный юзер ${authUser.email}`}</p>
          <button onClick={userSignOut}>Выйти</button>
        </div>
      ) : (
        ("")
      )}
    </div>
  );
};

export default AuthDetails;
