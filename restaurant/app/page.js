import { Welcome } from "./components/Welcome/Welcome";
import { Advantages } from "./components/Advantages/Advantages";
import { Discount } from "./components/Discount/Discount";
import { Gallery } from "./components/Gallery/Gallery";
import { Feedback } from "./components/Feedback/Feedback";
import { Forma_feedback } from "./components/Forma_feedback/Forma_feedback";
import SignUp from "./components/auth/SingUp";

export default function Home() {
  return (
    <main>
      <SignUp></SignUp>
    </main>
  );
}
