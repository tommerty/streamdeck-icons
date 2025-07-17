import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Root from "~/components/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stream Deck Icons" },
    { name: "description", content: "Build icons for your Stream Deck" },
  ];
}

export default function Home() {
  return <Root />;
}
