import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FurnitureCard from "./FurnitureCard";
import { useProducts } from "../hooks/useProducts";
import { useBestSellingProducts } from "../hooks/useBestSellingProducts";

const PAGE_SIZE = 4;

function FurnitureGrid() {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { bestSellingProducts } = useBestSellingProducts();

  const [visibleCount] = useState(PAGE_SIZE);

  const bestSellerSet = new Set(bestSellingProducts.map((p) => p.id));

  if (loading) {
    return (
      <section className="w-full flex justify-center py-10 text-[#A09890]">
        Đang tải sản phẩm...
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full flex flex-col items-center py-10 text-[#A09890]">
        <p>Không thể tải sản phẩm</p>
        <p className="text-sm">{error}</p>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="w-full flex justify-center py-10 text-[#A09890]">
        Không có sản phẩm nào
      </section>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-black text-[#F5F0EB]">
          Khám phá bộ sưu tập
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#A09890]">
          Thiết kế tinh tế, chất liệu cao cấp
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer"
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
              isActive={false}
              isBestSeller={bestSellerSet.has(item.id)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/products")}
          className="rounded-full border border-[#8B6914] bg-transparent px-8 py-3 text-sm font-semibold text-[#D4A574] transition hover:bg-[#8B6914] hover:text-[#1A1A1A]"
        >
          Xem tất cả sản phẩm
        </button>
      </div>
    </section>
  );
}

export default FurnitureGrid;
