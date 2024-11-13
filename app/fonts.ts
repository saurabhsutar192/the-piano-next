import { Montserrat, Montserrat_Subrayada } from "next/font/google";

export const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });

export const montserratSub = Montserrat_Subrayada({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});
