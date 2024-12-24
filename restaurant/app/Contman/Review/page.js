import { Review } from "../../components/Review/Review";
import Styles from "./Review.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <Review />
    </main>
  );
}
