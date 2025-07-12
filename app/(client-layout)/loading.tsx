import Image from "next/image";
import logoImageSrc from '@/public/logo-symbol.png'
export default function loading() {
  return (
    <div className="h-screen   w-full flex items-center justify-center ">
      <Image src={logoImageSrc} alt="loading" height={150} width={150} className="logo-loading"/>
    </div>
  )
}
