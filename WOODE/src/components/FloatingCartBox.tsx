import { FiShoppingCart } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function FloatingCartBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, getTotalPrice } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalPrice();

  const isProductPage =
    location.pathname.startsWith("/products") ||
    location.pathname.startsWith("/product/");

  if (!isProductPage) return null;
  if (cart.length === 0) return null;

  return (
    <button
      onClick={() => navigate("/cart")}
      className="
        fixed bottom-5 right-5 z-50
        flex items-center gap-3
        rounded-2xl bg-[#6B3F24] px-5 py-4
        text-white shadow-xl shadow-black/20
        transition-all duration-300
        hover:-translate-y-1 hover:bg-[#5A331D]
        active:scale-95
      "
    >
      <div className="relative">
        <FiShoppingCart size={24} />

        <span
          className="
            absolute -right-3 -top-3
            flex h-5 min-w-5 items-center justify-center
            rounded-full bg-[#D4A574] px-1
            text-xs font-bold text-[#2A1A12]
          "
        >
          {totalItems}
        </span>
      </div>

      <div className="text-left leading-tight">
        <p className="text-xs text-white/80">Giỏ hàng</p>
        <p className="text-sm font-bold">
          {totalPrice.toLocaleString("vi-VN")}đ
        </p>
      </div>
    </button>
  );
}