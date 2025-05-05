import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import splashDarkImg from "images/swiss-knife-learning-3d.png";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ELearnKit - AI-driven platform" },
    { name: "description", content: " Smart, personalized learning powered by semantic technology." },
    {
      property: "og:image",
      content: splashDarkImg,
    },
    {
      property: "og:title",
      content: "ELearnKit - AI-driven platform",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
