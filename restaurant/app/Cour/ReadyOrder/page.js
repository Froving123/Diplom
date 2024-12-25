import { ReadyOrder } from "../../components/ReadyOrder/ReadyOrder";
import Styles from "./ReadyOrder.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <ReadyOrder />
    </main>
  );
}