import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Hypertension Risk Predictor",
  description:
    "Predict your hypertension risk using lifestyle data. An AI-powered decision-support tool for Nigerian adults.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css"
        />
      </head>
      <body>
        <Navbar />
        <main className="min-vh-100 py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
