import "./globals.scss";
import "./page.scss";
import type { Metadata } from "next";
import { montserrat } from "./fonts";

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
      <body className={montserrat.className}>
        <div className={"main"}>{children}</div>
      </body>
    </html>
  );
}
