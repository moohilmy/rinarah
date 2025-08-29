import { Landing, Products, Contact } from "@/Sections";

export default function Home() {
  const turnOffDomain = true 
  if(turnOffDomain) {
    return(
      <div className="flex  flex-col justify-center items-center h-screen w-full">
        <h1 className="text-6xl">Domain name for sale</h1>
        <p>
          Please contact us at <a href="mailto:info@rinarah.com">info@rinarah.com</a>
        </p>
      </div>
    )
  }
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
