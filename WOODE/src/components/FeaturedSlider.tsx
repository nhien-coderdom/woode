import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FurnitureCard from "./FurnitureCard";
import { useProducts } from "../hooks/useProducts";
import { useBestSellingProducts } from "../hooks/useBestSellingProducts";

function FeaturedSlider() {
  const [activeIndex, setActiveIndex] = useState(1);
  const navigate = useNavigate();

  const { products, loading, error } = useProducts();
  const { bestSellingProducts } = useBestSellingProducts();

  const bestSellerSet = new Set(bestSellingProducts.map((p) => p.id));

  const items = (products || [])
    .filter((p) => bestSellerSet.has(p.id))
    .slice(0, 8);

  const canSlide = items.length > 1;

  const handlePrev = () => {
    if (!canSlide) return;
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!canSlide) return;
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center py-10 text-[#A09890]">
        Đang tải...
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center py-10 text-[#A09890]">
        <p>Không thể tải slider sản phẩm.</p>
        <p className="text-xs mt-1">{error}</p>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="w-full h-full flex items-center justify-center py-10 text-[#A09890]">
        Không có sản phẩm nổi bật để hiển thị.
      </section>
    );
  }

  const safeIndex = activeIndex % items.length;

  const prevIndex = safeIndex === 0 ? items.length - 1 : safeIndex - 1;
  const nextIndex = safeIndex === items.length - 1 ? 0 : safeIndex + 1;

  const displayItems = canSlide
    ? [items[prevIndex], items[safeIndex], items[nextIndex]]
    : [items[0]];

  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col justify-center mt-24 mb-10 px-4">
      <div className="mb-10 text-center">
        <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-black text-[#F5F0EB]">
          Sản phẩm nổi bật
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#A09890]">
          Bộ sưu tập nội thất WOODÉ được yêu thích nhất
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4">
        <div className="relative w-full max-w-5xl">
          <button
            onClick={handlePrev}
            className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#2A2A2A] text-xl transition-all hover:scale-110 text-[#D4A574] hover:bg-[#8B6914] hover:text-[#1A1A1A] z-20 border border-[#3A3A3A]"
          >
            <FiChevronLeft size={24} />
          </button>

          <div className="flex items-end justify-center gap-4 sm:gap-6">
            {displayItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={`cursor-pointer transition-all duration-500 ease-out ${
                  canSlide && index === 1
                    ? "z-10 translate-y-0 scale-100 opacity-100 w-full max-w-sm"
                    : "translate-y-4 scale-[0.85] opacity-50 w-full max-w-sm hidden sm:block"
                }`}
                onClick={() => {
                  if (!item.id) return;
                  navigate(`/product/${item.id}`);
                }}
              >
                <FurnitureCard
                  name={item.name}
                  description={item.description}
                  categoryName={item.category?.name}
                  image={item.imageUrl || ""}
                  price={item.price}
                  isActive={canSlide ? index === 1 : true}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#2A2A2A] text-xl transition-all hover:scale-110 text-[#D4A574] hover:bg-[#8B6914] hover:text-[#1A1A1A] border border-[#3A3A3A]"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`rounded-full transition-all duration-300 ${
              index === safeIndex
                ? "h-2 w-8 bg-[#D4A574]"
                : "h-2 w-2 bg-[#3A3A3A] hover:bg-[#6A6A6A]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedSlider;
