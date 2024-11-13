import "./globals.scss";
import "@hover-design/react/dist/style.css";
import "./page.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Piano",
  description: "Piano for web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={"main"}>{children}</div>
      </body>
    </html>
  );
}
