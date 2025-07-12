import Image from "next/image";
import logoImageSrc from '@/public/logo-symbol.png'
export default function LoadingPage() {
  return (
    <div className="h-[calc(100vh-5rem)] md:h-[calc(100vh-110px) w-full flex items-center justify-center ">
      <Image fetchPriority="high"  src={logoImageSrc} alt="loading" height={150} width={150} className="logo-loading"/>
    </div>
  )
}
