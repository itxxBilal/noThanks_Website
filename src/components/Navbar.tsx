import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.jpeg.asset.json';


const nav = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Guides', path: '/guides' },
  { name: 'Download', path: '/download' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container-wide flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="NoThanks logo" className="h-9 w-9 rounded-lg" />
          <span className="font-sans text-xl font-bold tracking-tight">NoThanks<span className="text-primary">.</span></span>
        </Link>


        <nav className="hidden md:flex items-center gap-7">
          {nav.map((i) => (
            <NavLink key={i.path} to={i.path} end={i.path === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {i.name}
            </NavLink>
          ))}
          <Link to="/download" className="btn-primary">Get App</Link>
        </nav>

        <button className="md:hidden p-2" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-border overflow-hidden">
            <div className="container-wide py-4 flex flex-col gap-3">
              {nav.map((i) => (
                <NavLink key={i.path} to={i.path} onClick={() => setOpen(false)}
                  className="py-2 text-foreground">{i.name}</NavLink>
              ))}
              <Link to="/download" className="btn-primary w-fit" onClick={() => setOpen(false)}>Get App</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
