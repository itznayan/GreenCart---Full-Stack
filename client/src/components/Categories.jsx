import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import LazyImage from "./LazyImage";

const Categories = () => {
  const { t } = useTranslation();

  const { navigate } = useAppContext();

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">{t("categories")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center text-center"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <LazyImage
              src={category.image}
              alt={t(category.translationKey, category.text)}
              className="group-hover:scale-108 transition max-w-28"
            />
            <p className="text-sm font-medium">
              {t(category.translationKey, category.text)}
            </p>
            <p className="text-xs text-gray-600 leading-4">
              {t(category.descriptionKey, "")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
