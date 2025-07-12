import localFont from "next/font/local";

export const mainFont = localFont({
  src: [
    {
      path: "../public/fonts/Degular/DegularVariable.ttf",
      style: "normal",
    },
  ],
  variable: "--font-degular",
  display: "swap",
});

export const textFont = localFont({
  src: [
    {
      path: "../public/fonts/Degular/text/DegularText-Regular.otf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../public/fonts/Degular/text/DegularText-Medium.otf",
      style: "normal",
      weight: "500",
    },
    {
      path: "../public/fonts/Degular/text/DegularText-Bold.otf",
      style: "normal",
      weight: "700",
    },
    {
      path: "../public/fonts/Degular/text/DegularText-Semibold.otf",
      style: "normal",
      weight: "600",
    },
    {
      path: "../public/fonts/Degular/text/DegularText-Black.otf",
      style: "normal",
      weight: "800",
    },
  ],
  variable: "--font-degular-text",
  display: "swap",
});
export const logoFont = localFont({
  src: [
    {
      path: "../public/fonts/Daragie-Regular/Daragie-Regular.otf",
      style: "normal",
    },
  ],
  variable: "--font-logo",
  display: "swap",
});
