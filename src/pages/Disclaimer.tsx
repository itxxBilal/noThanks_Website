import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import logo from '@/assets/logo.jpeg';

export default function Disclaimer() {
  return (
    <>
      <SEO title="Disclaimer | NoThanks" canonical="/disclaimer" />
      <div className="container-narrow py-14 prose prose-lg max-w-none">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Disclaimer' }]} />
        <img src={logo} alt="NoThanks logo" className="h-14 w-14 rounded-xl not-prose mt-4" />
        <h1>Disclaimer</h1>

        <p>Content on NoThanks is published for general informational and educational purposes only. It is not intended as legal, financial, medical, or professional advice.</p>
        <p>We make reasonable efforts to keep information accurate and up to date, but we make no warranties as to completeness, accuracy, or reliability. Use of the content is at your own risk.</p>
        <p>Product references, comparisons, and brand mentions are for informational purposes and do not constitute endorsements unless clearly labeled.</p>
        <p>Some links may be affiliate links. When they are, we disclose the relationship. Affiliate arrangements do not influence editorial judgement.</p>
      </div>
    </>
  );
}
