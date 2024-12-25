import { CourOrder } from "../../components/CourOrder/CourOrder";
import Styles from "./CourOrder.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <CourOrder />
    </main>
  );
}