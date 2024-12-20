"use client"

import { Overlay } from "../components/Overlay/Overlay";
import { Popup } from "../components/Popup/Popup";
import { AdminAuthForm } from "../components/AdminAuthForm/AdminAuthForm";
import Styles from "./Admin.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <Overlay isOpened={true} close={() => {}} />
      <Popup isOpened={true} close={() => {}} >
        <AdminAuthForm close={() => {}} updateAuthAdmin={() => {}} />
      </Popup>
    </main>
  );
}
