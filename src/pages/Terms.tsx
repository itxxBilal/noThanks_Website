import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import logo from '@/assets/logo.jpeg.asset.json';

export default function Terms() {
  return (
    <>
      <SEO title="Terms of Service | NoThanks" canonical="/terms" />
      <div className="container-narrow py-14 prose prose-lg max-w-none">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms' }]} />
        <img src={logo.url} alt="NoThanks logo" className="h-14 w-14 rounded-xl not-prose mt-4" />
        <h1>Terms of Service</h1>

        <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
        <p>By accessing NoThanks you agree to these terms. If you do not agree, please do not use the site.</p>
        <h2>Use of the site</h2>
        <p>Content is provided for informational purposes only. You agree not to misuse the site, attempt to disrupt service, or scrape content in bulk without permission.</p>
        <h2>Intellectual property</h2>
        <p>All content is © NoThanks unless otherwise noted. You may share links and brief excerpts with attribution.</p>
        <h2>Disclaimer</h2>
        <p>See our <a href="/disclaimer">Disclaimer</a>. We provide no warranties as to accuracy, completeness, or fitness for any particular purpose.</p>
        <h2>Changes</h2>
        <p>We may update these terms. Continued use of the site constitutes acceptance of any changes.</p>
      </div>
    </>
  );
}
