import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-primary focus:shadow-lg">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content" className="min-w-0 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
