import React, { useRef } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

const MainBanner = () => {
  const { t } = useTranslation();
  const bannerRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Image zoom effect on scroll
      gsap.fromTo(
        ".banner-img",
        {
          scale: 1.45,
          marginLeft: "90px", // starting state
          marginRight: "90px",
        },
        {
          scale: 1.3, // ending state
          marginLeft: "0px",
          marginRight: "0px",
          ease: "none",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: true, // 🔥 PIN ADDED HERE
            anticipatePin: 1, // smoother pin behavior (recommended)
          },
        },
      );

      // Heading animation
      gsap.from(".banner-title", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top 100%",
        },
      });

      // Buttons animation
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
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={bannerRef}
      className="relative scale-[1.15] py-14  overflow-hidden"
    >
      {/* Desktop Image */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="banner-img w-full h-fit overflow-hidden md:block"
      />

      {/* Mobile Image */}
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="banner-img w-full md:hidden"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
        <h1 className="banner-title text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15">
          {t("freshTrustSavings")}
        </h1>

        <div className="banner-buttons flex items-center mt-6 font-medium">
          <Link
            to={"/products"}
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer"
          >
            {t("shopNow")}
            <img
              className="md:hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          <Link
            to={"/products"}
            className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer"
          >
            {t("exploreDeals")}
            <img
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
