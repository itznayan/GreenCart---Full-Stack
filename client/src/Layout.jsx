import React, { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

const Layout = ({ children }) => {
  const scrollRef = useRef(null);
  const scrollInstance = useRef(null);
  const location = useLocation();
  const { showUserLogin } = useAppContext();
  const isSellerPath = location.pathname.includes("seller");

  useEffect(() => {
    scrollInstance.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1,
    });

    return () => {
      if (scrollInstance.current) scrollInstance.current.destroy();
    };
  }, []);

  // refresh on route change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const instance = scrollInstance.current;
      if (!instance) return;

      // Locomotive versions expose different refresh methods.
      if (typeof instance.update === "function") {
        instance.update();
      } else if (typeof instance.resize === "function") {
        instance.resize();
      } else if (instance.scroll && typeof instance.scroll.update === "function") {
        instance.scroll.update();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <div className="relative pt-2" data-scroll-container ref={scrollRef}>
      {/* Navbar ONLY ONCE */}
      {!isSellerPath && <Navbar />}

      {/* Login overlay */}
      {showUserLogin && null}

      {/* Page content */}
      <div className="pt-[80px] text-default min-h-screen text-gray-700 bg-white">
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
