import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import Layer from "../utils/Layer";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";
import LazyImage from "../components/LazyImage";

const ProductDetails = () => {
  const { t } = useTranslation();
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);

  // ✅ Carousel states
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const product = products.find((item) => item._id === id);

  // 🔁 Related products
  useEffect(() => {
    if (products.length > 0 && product) {
      let productsCopy = products.filter(
        (item) => product.category === item.category,
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, product]);

  // ✅ Reset index when product changes
  useEffect(() => {
    setIndex(0);
  }, [product]);

  // ✅ Navigation functions
  const paginate = (dir) => {
    setDirection(dir);
    setIndex((prev) => {
      const newIndex = prev + dir;
      if (newIndex < 0) return product.image.length - 1;
      if (newIndex >= product.image.length) return 0;
      return newIndex;
    });
  };

  // ✅ Animation variants
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    product && (
      <div className="overflow-hidden">
        <div className="mt-5">
          {/* 🔗 Breadcrumb */}
          <p>
            <Link to={"/"}>{t("home")}</Link> /
            <Link to={"/products"}> {t("products")}</Link>{" "}
            /
            <Link to={`/products/${product.category.toLowerCase()}`}>
              {product.category}
            </Link>{" "}
            /<span className="text-primary"> {product.name}</span>
          </p>

          {/* 🧱 Main Section */}
          <div className="flex flex-col md:flex-row gap-16 mt-2">
            <div className="flex gap-10">
              {/* 🖼️ Thumbnails */}
              <div className="flex flex-col gap-3">
                {product.image.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className={`border max-w-24 rounded overflow-hidden cursor-pointer 
                      ${i === index ? "border-primary" : "border-gray-400/30"}`}
                  >
                    <LazyImage src={img} alt="" />
                  </div>
                ))}
              </div>

              {/* 🔥 CAROUSEL */}
              <div className="relative flex items-center justify-center">
                {/* ⬅️ Button */}
                <button
                  onClick={() => paginate(-1)}
                  className="relative left-0 z-20  p-2 rounded-full shadow"
                >
                  <IoMdArrowDropleftCircle size={30} />
                </button>

                {/* Image */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.8}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = offset.x + velocity.x * 100;

                      if (swipe < -100) paginate(1);
                      else if (swipe > 100) paginate(-1);
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                    }}
                    className="flex w-fit h-fit items-center justify-center rounded overflow-hidden z-10"
                  >
                    <LazyImage
                      src={product.image[index]}
                      alt="product"
                      className="max-w-[400px]"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* ➡️ Button */}
                <button
                  onClick={() => paginate(1)}
                  className="relative right-0 z-20  p-2 rounded-full shadow"
                >
                  <IoMdArrowDroprightCircle size={30} />
                </button>
              </div>
            </div>

            {/* 📄 Product Info */}
            <div className="text-sm w-full md:w-1/2">
              <h1 className="text-3xl font-medium">{product.name}</h1>

              {/* ⭐ Rating */}
              <div className="flex items-center gap-0.5 mt-1">
                {Array(5)
                  .fill("")
                  .map((_, i) => (
                    <LazyImage
                      key={i}
                      src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                      className="md:w-4 w-3.5"
                    />
                  ))}
                <p className="text-base ml-2">(4)</p>
              </div>

              {/* 💰 Price */}
              <div className="mt-6">
                <p className="text-gray-500/70 line-through">
                  MRP: {currency}
                  {product.price}
                </p>
                <p className="text-2xl font-medium">
                  MRP: {currency}
                  {product.offerPrice}
                </p>
              </div>
              <p className="text-base font-medium mt-6">{t("aboutProduct")}</p>
              <ul className="list-disc ml-4 text-gray-500/70">
                {product.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>

              {/* 🛒 Buttons */}
              <div className="flex items-center mt-10 gap-4 text-base">
                <button
                  onClick={() => addToCart(product._id)}
                  className="w-full py-3.5 bg-gray-100 hover:bg-gray-200"
                >
                  {t("addToCart")}
                </button>

                <button
                  onClick={() => {
                    addToCart(product._id);
                    navigate("/cart");
                  }}
                  className="w-full py-3.5 bg-primary text-white"
                >
                  {t("buyNow")}
                </button>
              </div>
            </div>
          </div>

          {/* 🔗 Related Products */}
          <div className="flex flex-col items-center mt-20">
            <p className="text-3xl font-medium">{t("relatedProducts")}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 w-full">
              {relatedProducts
                .filter((p) => p.inStock)
                .map((p, i) => (
                  <ProductCard key={i} product={p} />
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Layer(ProductDetails);
