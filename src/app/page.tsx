import {redirect} from "next/navigation";

export default function Home() {
  redirect("/authors"); // redirect a authors directamente, pues no se pide un homepage o algo por el estilo
}
