import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useCart } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import SearchOverlay from "./components/SearchOverlay";
import Home from "./pages/Home";
import { initSmoothScroll, scrollToTop, setupReveals, ScrollTrigger } from "./lib/motion";
import "./styles/layout.css";
import "./styles/sections.css";
import "./styles/pages.css";

// Inner pages are code-split; the home page (and its hero) loads immediately.
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Story = lazy(() => import("./pages/Story"));
const HowTo = lazy(() => import("./pages/HowTo"));
const Bars = lazy(() => import("./pages/Bars"));
const Wholesale = lazy(() => import("./pages/Wholesale"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const Contact = lazy(() => import("./pages/Contact"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// /cart (as on the live site) opens the cart drawer over the home page.
function CartRoute() {
  const { setOpen } = useCart();
  useEffect(() => { setOpen(true); }, [setOpen]);
  return <Navigate to="/" replace />;
}

function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollToTop(true);
    let kill = () => {};
    // wait a frame so the (lazy) page has mounted before reveals are registered
    const t = setTimeout(() => {
      kill = setupReveals(document.getElementById("main"));
      ScrollTrigger.refresh();
    }, 60);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1400);
    return () => { clearTimeout(t); clearTimeout(t2); kill(); };
  }, [pathname]);
  return null;
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    initSmoothScroll();
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <Header onSearch={() => setSearchOpen(true)} />
      <main id="main" className="page-main">
        <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections/shop" element={<Shop />} />
            <Route path="/collections/*" element={<Shop />} />
            <Route path="/products/:handle" element={<Product />} />
            <Route path="/pages/about-us" element={<Story />} />
            <Route path="/pages/learn-more" element={<HowTo />} />
            <Route path="/pages/bars-and-restaurants" element={<Bars />} />
            <Route path="/pages/bars-and-restaurants-2" element={<Bars />} />
            <Route path="/pages/wholesale" element={<Wholesale />} />
            <Route path="/pages/affiliate" element={<Affiliate />} />
            <Route path="/pages/contact-us" element={<Contact />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <RouteEffects />
    </>
  );
}
