type FurnitureCardProps = {
  name: string;
  description?: string;
  categoryName?: string;
  image: string;
  price: number;
  isActive: boolean;
  isBestSeller?: boolean;
};

function FurnitureCard({
  name,
  description,
  categoryName,
  image,
  price,
  isActive,
  isBestSeller,
}: FurnitureCardProps) {
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price) + "đ";

  return (
    <div
      className={`relative h-full flex flex-col w-full rounded-2xl overflow-hidden transition-all duration-500 border ${
        isActive
          ? "bg-[#1F1C18] shadow-2xl shadow-[#D8A94A]/20 border-[#D8A94A] transform scale-[1.02]"
          : "bg-[#1A1A1A] border-[#4A4035] opacity-90 hover:opacity-100 hover:border-[#6A6A6A]"
      }`}
    >
      <div className="relative overflow-hidden shrink-0 h-48 sm:h-56">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
        />

        {categoryName && (
          <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold bg-[#1A1A1A]/80 backdrop-blur-sm text-[#E0B84F] border border-[#4A4035]">
            {categoryName}
          </span>
        )}

        {isBestSeller && (
          <span className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold bg-[#D8A94A] text-[#1A1A1A] shadow-md">
            Best Seller
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col grow">
        <h3 className=" font-['Noto_Serif'] font-bold text-base sm:text-lg text-[#F5F0EB] tracking-wide truncate">
          {name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#E0B84F] flex-grow line-clamp-2">
          {description || "Sản phẩm nội thất cao cấp từ WOODÉ, mang lại sự sang trọng cho không gian sống của bạn."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-[#E0B84F]">
            {formattedPrice}
          </p>
        </div>

        <div className="mt-4 shrink-0">
          <button className="w-full rounded-full bg-transparent border border-[#D8A94A] px-5 py-2 text-sm font-semibold text-[#E0B84F] hover:bg-[#D8A94A] hover:text-[#1A1A1A] transition-colors duration-300">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

export default FurnitureCard;
