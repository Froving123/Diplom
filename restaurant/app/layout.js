import {Header} from '';
import {Footer} from '';
import "./globals.css";

export const metadata = {
  title: "Best Rest",
  description: "Ресторан вкусной еды",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
