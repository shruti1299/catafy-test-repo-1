import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ProgressProvider from "@/providers/ProgessProvider";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import { Readex_Pro } from 'next/font/google';
import { UserProvider } from "@/contexts/UserContext";
import { UIProvider } from "@/contexts/ui.context";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "Online Free Catalog Maker | Catafy.com",
  description: "Create beautiful catalogues for whatever use-case you can imagine. One catalogue per customer, one catalogue per theme, one catalogue per price range.",
};

const readex = Readex_Pro({
  subsets: ['arabic'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={readex.className}>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className="body">
        <AntdRegistry>
          <ThemeProvider>
            <ProgressProvider>
              <UIProvider>
                <UserProvider>
                  <main>{children}</main>
                </UserProvider>
              </UIProvider>
            </ProgressProvider>
          </ThemeProvider>
        </AntdRegistry>
        <GoogleAnalytics gaId="G-0ZL16XNB9W" />
      </body>
    </html>
  );
}
