import React, { useRef } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import LazyImage from "./LazyImage";

gsap.registerPlugin(ScrollTrigger);

const MainBanner = () => {
  const { t } = useTranslation();
  const bannerRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".banner-img",
        {
          scale: 1.25,
          x: 80,
        },
        {
          scale: 1,
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.from(".banner-title", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".banner-buttons", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top 75%",
        },
      });

      ScrollTrigger.refresh();
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={bannerRef} className="relative overflow-hidden min-h-screen">
      {/* Desktop */}
      <LazyImage
        src={assets.main_banner_bg}
        alt="banner"
        className="banner-img hidden md:block w-full h-screen object-cover"
      />

      {/* Mobile */}
      <LazyImage
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="banner-img md:hidden w-full h-screen object-cover"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
        <h1 className="banner-title relative text-4xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15">
          {t("freshTrustSavings")}
        </h1>

        <div className="banner-buttons flex items-center mt-6 font-medium">
          <Link
            to="/products"
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white"
          >
            {t("shopNow")}
            <LazyImage
              className="md:hidden transition group-hover:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          <Link
            to="/products"
            className="group hidden md:flex items-center gap-2 px-9 py-3"
          >
            {t("exploreDeals")}
            <LazyImage
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
