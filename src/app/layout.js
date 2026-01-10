import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Umutulo App - Church Contribution Tracker",
  description: "Track Tithe, Offering and Partnership Easily",
  icons: {
    icon: [
      { url: '/umutulo_favicon_32.png', sizes: '32x32', type: 'image/png' },
      { url: '/umutulo_app_icon_512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/umutulo_mobile_icon_180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/umutulo_favicon_32.png' },
    ],
  },
  openGraph: {
    images: ['/umutulo_app_icon_512.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
