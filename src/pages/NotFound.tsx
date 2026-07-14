import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found | NoThanks" noindex />
      <div className="container-narrow py-32 text-center">
        <p className="font-serif text-7xl mb-4">404</p>
        <h1 className="text-3xl mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">The page you’re looking for doesn’t exist or has moved.</p>
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    </>
  );
}
