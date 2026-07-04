import { Metadata } from 'next';
import './globals.css';
import { Noto_Sans_Bengali } from 'next/font/google';

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-bengali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ই-ঘটক',
  description: 'ই-ঘটক — বাংলাদেশের একমাত্র বিস্বস্ত ও সর্ববৃহৎ বিবাহ সহায়তা প্রদানকারী প্ল্যাটফর্ম। সহজ ও নিরাপদে বিয়ের পাত্র-পাত্রী খুঁজুন।'

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${notoSansBengali.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
