import { Home } from '@/components/site';
import { siteUrl } from '@/lib/site-url';

export default function Page() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: 'شهرک ویلایی ماهلند',
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'ماهدشت، کرج',
      addressCountry: 'IR',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Home />
    </>
  );
}
