import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'es'}, {locale: 'zh'}, {locale: 'ar'}];
}

export const metadata = {
  title: "Hello-World | Crypto Idea-Sharing Platform",
  description:
    "A decentralized, community-driven platform for crypto ideas sharing and insights built on Stellar",
  generator: "Divineifed1",
};

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function RootLayout({ children, params: {locale} }) {
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
