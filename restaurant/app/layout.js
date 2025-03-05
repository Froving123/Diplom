"use client";

import { usePathname } from "next/navigation";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AdminHeader } from "./components/Header/AdminHeader";
import { ContmanHeader } from "./components/Header/ContmanHeader";
import { ContmanFooter } from "./components/Footer/ContmanFooter";
import { ManordHeader } from "./components/Header/ManordHeader";
import { ManordFooter } from "./components/Footer/ManordFooter";
import { CourHeader } from "./components/Header/CourHeader";
import { CourFooter } from "./components/Footer/CourFooter";
import { ReservmanHeader } from "./components/Header/ReservmanHeader";
import { ReservmanFooter } from "./components/Footer/ReservmanFooter";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/Admin");
  const isContmanPage = pathname.startsWith("/Contman");
  const isManordPage = pathname.startsWith("/Manord");
  const isDeliverPage = pathname.startsWith("/Cour");
  const isReservmanPage = pathname.startsWith("/Reservman");

  let header;
  if (isAdminPage) {
    header = <AdminHeader />;
  } else if (isContmanPage) {
    header = <ContmanHeader />;
  } else if (isManordPage) {
    header = <ManordHeader />;
  } else if (isDeliverPage) {
    header = <CourHeader />;
  } else if (isReservmanPage) {
    header = <ReservmanHeader />;
  } else {
    header = <Header />;
  }

  let footer;
  if (isContmanPage) {
    footer = <ContmanFooter />;
  } else if (isManordPage) {
    footer = <ManordFooter />;
  } else if (isDeliverPage) {
    footer = <CourFooter />;
  } else if (isReservmanPage) {
    footer = <ReservmanFooter />;
  } else {
    footer = <Footer />;
  }

  return (
    <html lang="ru">
      <body>
        {header}
        {children}
        {footer}
      </body>
    </html>
  );
}
