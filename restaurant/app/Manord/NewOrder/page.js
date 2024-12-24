import { NewOrder } from "../../components/NewOrder/NewOrder";
import Styles from "./NewOrder.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <NewOrder />
    </main>
  );
}
