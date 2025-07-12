import { Footer, Header } from "@/components";

const links: { href: string ; name: string }[] = [
  { name: "shop now", href: "/products" },
];
export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   
  return (
    <main>
      <Header links={links}  />
      {children}
      <Footer />
    </main>
  );
}
