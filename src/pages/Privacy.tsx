import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import logo from '@/assets/logo.jpeg.asset.json';

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy Policy | NoThanks" canonical="/privacy" />
      <div className="container-narrow py-14 prose prose-lg max-w-none">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]} />
        <img src={logo.url} alt="NoThanks logo" className="h-14 w-14 rounded-xl not-prose mt-4" />
        <h1>Privacy Policy</h1>

        <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
        <p>NoThanks (“we”, “us”) respects your privacy. This policy explains what information we collect, how we use it, and the choices you have.</p>
        <h2>Information we collect</h2>
        <ul>
          <li>Contact form submissions (name, email, message).</li>
          <li>Newsletter subscriptions (email address).</li>
          <li>Basic analytics (page views, referrer) to improve the site.</li>
        </ul>
        <h2>How we use information</h2>
        <p>To respond to inquiries, deliver newsletters you subscribe to, and understand how visitors use the site.</p>
        <h2>Cookies</h2>
        <p>We use essential cookies for site functionality. Analytics cookies are used to understand aggregate usage.</p>
        <h2>Third-party services</h2>
        <p>We may use Google AdSense to serve ads. Google may use cookies to serve ads based on prior visits. You may opt out via Google’s Ads Settings.</p>
        <h2>Your rights</h2>
        <p>You may request access, correction, or deletion of your data by emailing us via the Contact page.</p>
        <h2>Contact</h2>
        <p>For privacy questions, use the <a href="/contact">Contact page</a>.</p>
      </div>
    </>
  );
}
