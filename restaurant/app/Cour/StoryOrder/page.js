import { StoryOrder } from "../../components/StoryOrder/StoryOrder";
import Styles from "./StoryOrder.module.css";

export default function Home() {
  return (
    <main className={Styles.back}>
      <StoryOrder />
    </main>
  );
}
