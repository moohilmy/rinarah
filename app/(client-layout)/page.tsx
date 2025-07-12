import { Landing, Products, Contact } from "@/Sections";

export default function Home() {
  return (
    <section>
      <Landing />
      <section>
        <Products />
        <Contact />
      </section>
    </section>
  );
}
