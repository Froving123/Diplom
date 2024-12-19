"use client";

import { usePathname } from "next/navigation";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AdminHeader } from "./components/Header/AdminHeader";
import { ContmanHeader } from "./components/Header/ContmanHeader";
import { ContmanFooter } from "./components/Footer/ContmanFooter";
//import { ManordHeader } from "./components/Header/ManordHeader";
//import { ManordFooter } from "./components/Header/ManordFooter";
//import { DeliverHeader } from "./components/Header/DeliverHeader";
//import { DeliverFooter } from "./components/Header/DeliverFooter";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Логика определения шапки
  const isAdminPage = pathname.startsWith("/Admin");
  const isContmanPage = pathname.startsWith("/Contman");
  const isManordPage = pathname.startsWith("/Manord");
  const isDeliverPage = pathname.startsWith("/Cour");

  let header;
  if (isAdminPage) {
    header = <AdminHeader />;
  } else if (isContmanPage) {
    header = <ContmanHeader />;
  } else if (isManordPage) {
    header = <ManordHeader />;
  } else if (isDeliverPage) {
    header = <DeliverHeader />;
  } else {
    header = <Header />;
  }

  let footer;
  if (isContmanPage) {
    footer = <ContmanFooter />;
  } else if (isManordPage) {
    footer = <ManordFooter />;
  } else if (isDeliverPage) {
    footer = <DeliverFooter />;
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