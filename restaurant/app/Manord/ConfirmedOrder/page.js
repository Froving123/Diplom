import { ConfirmedOrder } from "../../components/ConfirmedOrder/ConfirmedOrder";
import Styles from "./ConfirmedOrder.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <ConfirmedOrder />
    </main>
  );
}
