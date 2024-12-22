import { Special_offers } from "../../components/Special_offers/Special_offers";
import Styles from "./Discount.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <Special_offers />
    </main>
  );
}
