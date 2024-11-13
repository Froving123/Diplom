import { Welcome } from "./components/Welcome/Welcome";
import { Advantages } from "./components/Advantages/Advantages";
import { Discount } from "./components/Discount/Discount";
import { Gallery } from "./components/Gallery/Gallery";
import { Feedback } from "./components/Feedback/Feedback";
import { Forma_feedback } from "./components/Forma_feedback/Forma_feedback";

export default function Home() {
  return (
    <main>
      <Welcome />
      <Advantages />
      <Discount />
      <Gallery />
      <Feedback />
      <Forma_feedback />
    </main>
  );
}