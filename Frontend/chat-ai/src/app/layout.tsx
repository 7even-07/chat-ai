/* eslint-disable @next/next/next-script-for-ga */
import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Layout, FixedPlugin } from "@/components";
import { AuthProvider } from "@/components/AuthContext";
import config from "@/includes/config";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: config.APP.NAME,
  description:
    config.APP.DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-site="YOUR_DOMAIN_HERE"
          src="https://api.nepcha.com/js/nepcha-analytics.js"
        ></script>
        <link rel="shortcut icon" href={config.APP.FAVICON} type="image/png" />
      </head>
      <body className={roboto.className}>
        <AuthProvider>
          <Layout>
            {children}
            <FixedPlugin />
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
