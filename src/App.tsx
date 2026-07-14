import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { Suspense, lazy } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const BlogIndex = lazy(() => import('@/pages/BlogIndex'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const TagPage = lazy(() => import('@/pages/TagPage'));
const Guides = lazy(() => import('@/pages/Guides'));
const Download = lazy(() => import('@/pages/Download'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Contact = lazy(() => import('@/pages/Contact'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Disclaimer = lazy(() => import('@/pages/Disclaimer'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Login = lazy(() => import('@/pages/Login'));

const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminPosts = lazy(() => import('@/pages/admin/AdminPosts'));
const AdminPostEditor = lazy(() => import('@/pages/admin/AdminPostEditor'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminTags = lazy(() => import('@/pages/admin/AdminTags'));
const AdminAuthors = lazy(() => import('@/pages/admin/AdminAuthors'));
const AdminComments = lazy(() => import('@/pages/admin/AdminComments'));
const AdminFAQ = lazy(() => import('@/pages/admin/AdminFAQ'));
const AdminNewsletter = lazy(() => import('@/pages/admin/AdminNewsletter'));
const AdminInbox = lazy(() => import('@/pages/admin/AdminInbox'));

const Loading = () => (
  <div className="min-h-[60vh] grid place-items-center text-muted-foreground text-sm">Loading…</div>
);

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/admin" element={<ProtectedRoute requireEditor><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="posts" element={<AdminPosts />} />
                <Route path="posts/new" element={<AdminPostEditor />} />
                <Route path="posts/:id" element={<AdminPostEditor />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="tags" element={<AdminTags />} />
                <Route path="authors" element={<AdminAuthors />} />
                <Route path="comments" element={<AdminComments />} />
                <Route path="faqs" element={<AdminFAQ />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="inbox" element={<AdminInbox />} />
              </Route>
              <Route path="*" element={<PublicShell />} />
            </Routes>
          </Suspense>
          <ToastContainer position="top-right" autoClose={2600} theme="light" />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

function PublicShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/tag/:slug" element={<TagPage />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/download" element={<Download />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
