import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "@core/components/NavBar";
import Footer from "@core/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blachere CRM",
  description: "Blachere CRM by Jonathan Lauxen Romano",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen">
          <NavBar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
