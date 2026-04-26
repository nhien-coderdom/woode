import { useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import PersonalizedProducts from "../components/PersonalizedProducts";


function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  const subtotal = getTotalPrice();
  const total = subtotal;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-24 text-[#F5F0EB]">
      <section className="mb-10">
        <h1 className="mt-2 font-serif text-4xl font-black text-[#F5F0EB] sm:text-5xl">
          Giỏ hàng của bạn
        </h1>
        <p className="mt-2 text-[#A09890]">
          {cart.length} sản phẩm trong giỏ
        </p>
      </section>

      {cart.length === 0 ? (
        <div className="rounded-[32px] border border-[#2A2A2A] bg-[#1A1A1A] p-12 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2A2A2A] text-[#8B6914] border border-[#3A3A3A]">
            <FiShoppingBag size={32} />
          </div>

          <h2 className="mt-6 text-2xl font-serif font-bold text-[#F5F0EB]">
            Giỏ hàng của bạn đang trống
          </h2>

          <p className="mx-auto mt-3 max-w-md leading-7 text-[#A09890]">
            Hãy khám phá các bộ sưu tập nội thất cao cấp của WOODÉ và thêm những sản phẩm bạn yêu thích vào giỏ hàng.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-8 rounded-full bg-gradient-to-r from-[#8B6914] to-[#D4A574] px-8 py-4 text-sm font-bold text-[#1A1A1A] transition hover:scale-105 shadow-lg"
          >
            Tiếp tục mua sắm
          </button>

        </div>

      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-xl transition hover:border-[#3A3A3A]"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-32 w-32 rounded-2xl object-cover border border-[#2A2A2A]"
                  />

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-[#F5F0EB]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-[#D4A574]">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-red-400 border border-[#2A2A2A] bg-[#151515] hover:bg-red-950/30 hover:border-red-900/50 transition-all"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 rounded-full border border-[#3A3A3A] bg-[#2A2A2A] px-4 py-2">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center text-[#A09890] hover:text-[#D4A574] transition"
                        >
                          <FiMinus size={16} />
                        </button>

                        <span className="w-6 text-center text-sm font-semibold text-[#F5F0EB]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center text-[#A09890] hover:text-[#D4A574] transition"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      <p className="text-xl font-bold text-[#D4A574]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-[32px] border border-[#2A2A2A] bg-[#1A1A1A] p-8 shadow-xl lg:sticky lg:top-32">
            <h2 className="text-2xl font-serif font-bold text-[#F5F0EB]">
              Tóm tắt đơn hàng
            </h2>

            <div className="mt-8 space-y-4 border-b border-[#3A3A3A] pb-6 text-sm">
              <div className="flex items-center justify-between text-[#A09890]">
                <span>Tạm tính</span>
                <span className="text-[#F5F0EB] font-semibold">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-[#F5F0EB]">
                Tổng cộng
              </span>
              <span className="text-3xl font-bold text-[#8B6914]">
                {formatPrice(total)}
              </span>
            </div>

            <p className="mt-4 text-xs leading-6 text-[#A09890]">
              Mức giá đã bao gồm thuế VAT. Phí vận chuyển sẽ được tính ở bước thanh toán.
            </p>

            <button
              onClick={() => {
                if (!user) {
                  navigate("/login", { state: { from: "/cart" } });
                } else {
                  navigate("/checkout");
                }
              }}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-[#8B6914] to-[#D4A574] py-4 text-sm font-bold text-[#1A1A1A] transition hover:scale-[1.02] shadow-lg"
            >
              {user ? "Tiến hành thanh toán" : "Đăng nhập để thanh toán"}
            </button>

            <button
              onClick={() => navigate("/products")}
              className="mt-4 w-full rounded-full border border-[#3A3A3A] bg-[#2A2A2A] py-4 text-sm font-semibold text-[#A09890] transition hover:bg-[#3A3A3A] hover:text-[#F5F0EB]"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}
      {user && <PersonalizedProducts />}
    </div>
  );
}

export default Cart;