import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { MotionSystem } from '@/components/motion';
import { Header, Footer } from '@/components/site';
import { siteUrl } from '@/lib/site-url';

const vazir = localFont({
  src: [
    { path: './fonts/vazir-regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/vazir-bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-vazir',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ماهلند | زندگی مدرن، نزدیک‌تر به طبیعت',
    template: '%s | ماهلند',
  },
  description: 'شهرک ویلایی ماهلند در ماهدشت کرج؛ پروژه‌ای در گستره ۱۵ هکتار با چشم‌انداز حدود ۶۰ ویلای اختصاصی. آشنایی با معماری و درخواست بازدید.',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    locale: 'fa_IR',
    type: 'website',
    url: '/',
    title: 'شهرک ویلایی ماهلند',
    description: 'زندگی مدرن، نزدیک‌تر به طبیعت',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
        <a className="skip" href="#main">رفتن به محتوای اصلی</a>
        <Header />
        {children}
        <Footer />
        <MotionSystem />
      </body>
    </html>
  );
}
