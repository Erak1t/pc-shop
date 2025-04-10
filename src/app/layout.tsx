import { Montserrat } from "next/font/google";
import "./globals.scss";
import ClientWrapper from "../components/ClientWrapper";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--Montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ClientWrapper>{children}</ClientWrapper>
        <footer className="info-footer">
          <p className="info-copyright">
            © 2025 Erik Sodel. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
