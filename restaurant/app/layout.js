"use client";

import { usePathname } from "next/navigation";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AdminHeader } from "./components/Header/AdminHeader";
import { AdminFooter } from "./components/Footer/AdminFooter";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/Admin");

  return (
    <html lang="ru">
      <body>
        {isAdminPage ? <AdminHeader /> : <Header />}
        {children}
        {isAdminPage ? <AdminFooter /> : <Footer />}
      </body>
    </html>
  );
}