import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LazyImage from "./LazyImage";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loginType, setLoginType] = useState("customer");
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  // 🔹 Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex relative items-center justify-between px-6 py-6">
        {/* LOGO */}
        <NavLink to="/" onClick={() => setOpen(false)}>
          <LazyImage className="h-14" src={assets.logo} alt="logo" />
        </NavLink>

        {/* DESKTOP */}
        <div className="hidden sm:flex items-center gap-4 text-lg">
          <NavLink className={""} to="/">
            {t("home")}
          </NavLink>
          <NavLink to="/products">{t("allProduct")}</NavLink>

          <div className="flex items-center gap-2 text-sm border px-3 py-1 rounded-full">
            <span className="text-gray-500">{t("language")}:</span>
            <button
              onClick={() => changeLanguage("hi")}
              className={`px-2 py-1 rounded ${
                i18n.resolvedLanguage === "hi"
                  ? "bg-primary text-white"
                  : "bg-gray-100"
              }`}
            >
              हि
            </button>
            <button
              onClick={() => changeLanguage("gu")}
              className={`px-2 py-1 rounded ${
                i18n.resolvedLanguage === "gu"
                  ? "bg-primary text-white"
                  : "bg-gray-100"
              }`}
            >
              ગુ
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={`px-2 py-1 rounded ${
                i18n.resolvedLanguage === "en"
                  ? "bg-primary text-white"
                  : "bg-gray-100"
              }`}
            >
              EN
            </button>
          </div>

          {/* SWITCH + LOGIN */}
          {!user && (
            <div className="flex items-center gap-4">
              {/* SWITCH */}
              <div className="relative w-[220px] h-[44px] rounded-full bg-zinc-900 p-[4px]">
                <motion.div
                  layout
                  transition={{ type: "tween", stiffness: 400, damping: 30 }}
                  className="absolute top-[4px] left-[4px] h-[36px] w-[106px] rounded-full bg-gray-800 z-0"
                  animate={{
                    x: loginType === "customer" ? 0 : 106,
                  }}
                />

                <div className="relative z-10 flex w-full h-full">
                  <button
                    onClick={() => setLoginType("customer")}
                    className={`w-1/2 h-full text-sm font-medium rounded-full ${
                      loginType === "customer" ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {t("customer")}
                  </button>

                  <button
                    onClick={() => setLoginType("seller")}
                    className={`w-1/2 h-full text-sm font-medium rounded-full ${
                      loginType === "seller" ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {t("seller")}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                onClick={() =>
                  loginType === "customer"
                    ? setShowUserLogin(true)
                    : navigate("/seller")
                }
                className="px-6 py-2.5 bg-primary hover:bg-[#2ca86e] text-white rounded-full text-sm"
              >
                {t("login")}
              </button>
            </div>
          )}

          {/* SEARCH */}
          <div className="hidden lg:flex items-center text-sm gap-2 border px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1 w-full bg-transparent outline-none"
              type="text"
              placeholder={t("search")}
            />
            <LazyImage src={assets.search_icon} className="w-4" />
          </div>

          {/* CART */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <LazyImage src={assets.nav_cart_icon} className="w-6" />
            <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>

          {/* PROFILE */}
          {user && (
            <div className="relative group">
              <LazyImage src={assets.profile_icon} className="w-10" />
              <ul className="hidden group-hover:block absolute right-0 top-10 bg-white border py-2 w-32 rounded-md text-sm">
                {user.role === "customer" && (
                  <li
                    onClick={() => navigate("my-orders")}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {t("myOrders")}
                  </li>
                )}

                {user.role === "seller" && (
                  <li
                    onClick={() => navigate("/seller/dashboard")}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {t("dashboard")}
                  </li>
                )}

                <li
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {t("logout")}
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex sm:hidden items-center gap-5">
          <div onClick={() => navigate("/cart")} className="relative">
            <LazyImage src={assets.nav_cart_icon} className="w-6" />
            <span className="absolute -top-2 -right-3 text-xs bg-primary text-white w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>

          <button onClick={() => setOpen(!open)}>
            <LazyImage src={assets.menu_icon} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="absolute top-[60px] left-0 w-full bg-white py-4 px-5 flex flex-col gap-3 sm:hidden">
            <NavLink to="/" onClick={() => setOpen(false)}>
              {t("home")}
            </NavLink>
            <NavLink to="/products" onClick={() => setOpen(false)}>
              {t("allProduct")}
            </NavLink>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">{t("language")}:</span>
              <button onClick={() => changeLanguage("hi")}>हि</button>
              <button onClick={() => changeLanguage("gu")}>ગુ</button>
              <button onClick={() => changeLanguage("en")}>EN</button>
            </div>

            {!user && (
              <>
                <div className="flex gap-2">
                  <button onClick={() => setLoginType("customer")}>
                    {t("customer")}
                  </button>
                  <button onClick={() => setLoginType("seller")}>
                    {t("seller")}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    loginType === "customer"
                      ? setShowUserLogin(true)
                      : navigate("/seller");
                  }}
                  className="py-2 bg-primary text-white rounded-full"
                >
                  {t("login")}
                </button>
              </>
            )}

            {user && (
              <>
                {user.role === "customer" && (
                  <button onClick={() => navigate("my-orders")}>
                    {t("myOrders")}
                  </button>
                )}
                {user.role === "seller" && (
                  <button onClick={() => navigate("/seller/dashboard")}>
                    {t("dashboard")}
                  </button>
                )}
                <button onClick={logout}>{t("logout")}</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
