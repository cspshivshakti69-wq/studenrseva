import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Kannada Seva | AI-Powered Education Analytics & Interventions",
  description: "Bilingual (English / ಕನ್ನಡ) predictive analytics, dropout forecasting, and student risk intervention portal for Kannada-medium government schools in Karnataka.",
  keywords: "Kannada Seva, Kannada Medium, Karnataka School Analytics, Education Intervention, Government Schools, Dropout Prediction",
  authors: [{ name: "Karnataka Education Department" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground cyber-grid">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

