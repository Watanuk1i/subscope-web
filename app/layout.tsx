import type { Metadata, Viewport } from "next";
import { Onest, Unbounded, JetBrains_Mono } from "next/font/google";
import { AppStoreProvider } from "@/components/AppStore";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "800", "900"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://subscope-app.vercel.app"),
  title: {
    default: "SUBSCOPE — контроль подписок и экономия",
    template: "%s — SUBSCOPE",
  },
  description:
    "SUBSCOPE показывает, сколько вы реально тратите на подписки: расходы за месяц и год, календарь списаний и рекомендации, где сэкономить.",
  keywords: ["подписки", "расходы", "экономия", "бюджет", "финансы", "трекер подписок"],
  openGraph: {
    title: "SUBSCOPE — контроль подписок и экономия",
    description:
      "Соберите все подписки в одном месте и узнайте, сколько можно сохранить за год.",
    type: "website",
    locale: "ru_RU",
    url: "https://subscope-app.vercel.app",
    siteName: "SUBSCOPE",
    images: [
      {
        url: "/og.png",
        width: 1792,
        height: 1024,
        alt: "SUBSCOPE — чек ваших подписок и сумма, которую можно сохранить",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SUBSCOPE — контроль подписок и экономия",
    description: "Сколько вы тратите на подписки и где можно сэкономить.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f1f2f7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${onest.variable} ${unbounded.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <AppStoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppStoreProvider>
      </body>
    </html>
  );
}
