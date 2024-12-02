import { Shopping_cart } from "../components/Shopping_cart/Shopping_cart";
import { Shopping_cart_button } from "../components/Shopping_cart_button/Shopping_cart_button";
import { CartProvider } from "@/CartContext";
import Styles from "./Cart.module.css";

export default function Home() {
  return (
    <main className={Styles.cart}>
      <CartProvider>
        <Shopping_cart foodId={1} />
        <Shopping_cart_button />
      </CartProvider>
    </main>
  );
}
