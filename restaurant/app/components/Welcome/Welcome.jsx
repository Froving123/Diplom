"use client";

import Styles from "./Welcome.module.css";
import { useEffect, useState } from "react";
import { Overlay } from "../Overlay/Overlay";
import { Popup } from "../Popup/Popup";
import { AuthForm } from "../AuthForm/AuthForm";
import { ReservForm } from "@/app/components/ReservForm/ReservForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase";

export const Welcome = () => {
  const [popupIsOpened, setPopupIsOpened] = useState(false);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
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

  const openPopup = () => {
    setPopupIsOpened(true);
  };

  const closePopup = () => {
    setPopupIsOpened(false);
  };

  const openedPopup = () => {
    setPopupIsOpen(true);
  };

  const closedPopup = () => {
    setPopupIsOpen(false);
  };

  return (
    <div className={Styles.main_div}>
      <div className={Styles.main_p}>
        <h1 className={Styles.h1}>
          Добро пожаловать <br /> в наш ресторан{" "}
        </h1>
        <div className={Styles.name_restaurant}>
          <hr className={Styles.hr_name} />
          <p>Best Rest</p>
          <hr className={Styles.hr_name} />
        </div>
        {authUser ? (
          <button className={Styles.button_reserv} onClick={openedPopup}>
            Забронировать
          </button>
        ) : (
          <button className={Styles.button_reserv} onClick={openPopup}>
            Забронировать
          </button>
        )}
      </div>
      <Overlay isOpened={popupIsOpened} close={closePopup} />
      <Popup isOpened={popupIsOpened} close={closePopup}>
        <AuthForm close={closePopup} />
      </Popup>
      <Overlay isOpened={popupIsOpen} close={closedPopup} />
      <Popup isOpened={popupIsOpen} close={closedPopup}>
        <ReservForm close={closedPopup} />
      </Popup>
    </div>
  );
};
