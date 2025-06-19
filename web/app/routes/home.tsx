import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import splashDarkImg from "images/swiss-knife-learning-3d.png";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ELearnKit - AI-driven platform" },
    {
      name: "description",
      content: " Smart, personalized learning powered by semantic technology.",
    },
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

// export async function clientLoader({ request }) {
//   let title =  localStorage.getItem("title") || "Welcome to ELearnKit";
//   console.log("Client Loader: ", title);
//   return { title };
// }

// export async function clientAction({ request }) {
//   await new Promise((res) => setTimeout(res, 1000));
//   let data = await request.formData();
//   console.log("Client Action: ", data.get("title"));
//   localStorage.setItem("title", data.get("title"));
//   return { ok: true };
// }

// export async function clientLoader({ params }: Route.ClientLoaderArgs) {
//   if(params.q) {
//     const res = await fetch(`http://localhost:3001/api/courses?q=${params.pid}`);
//     const courses = await res.json();
//     return { courses };
//   }
//   return { courses: [] };
// }
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const topics = url.searchParams.get("topics") || "";
  console.log({topics, q});
  if (q.length < 3) {
    return { resources: [] }; 
  }
  const res = await fetch(
    `http://localhost:3001/api/courses/search?q=${encodeURIComponent(q)}&topics=${encodeURIComponent(topics)}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const resources = await res.json();
  return { resources, q };
}

export default function Home() {
  return <Welcome />;
}
