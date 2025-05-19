import { Hide_Offers } from "../../components/Hide_Offers/Hide_Offers";
import Styles from "./HideOffers.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <Hide_Offers />
    </main>
  );
}
