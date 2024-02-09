import { Welcome } from "./components/Welcome/Welcome";
import { Advantages } from "./components/Advantages/Advantages";
import { Our_story } from "./components/Our_story/Our_story";
import { Discount } from "./components/Discount/Discount";
import { Our_menu } from "./components/Our_menu/Our_menu";
import { Delivery_menu } from "./components/Delivery_menu/Delivery_menu";
import { Feedback } from "./components/Feedback/Feedback";
import { Gallery } from "./components/Gallery/Gallery";
import { Forma_feedback } from "./components/Forma_feedback/Forma_feedback";

export default function Home() {
  return (
    <main>
      <Welcome />
      <Advantages />
      <Our_story />
      <Discount />
      <Our_menu />
      <Delivery_menu />
      <Feedback />
      <Gallery />
      <Forma_feedback />
    </main>
  );
}
