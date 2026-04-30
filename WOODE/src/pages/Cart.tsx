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
    <div className="min-h-screen bg-[#2A261F] pt-24 pb-16 text-[#2A1E13]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mb-10">
          <h1 className="font-['Noto_Serif'] text-4xl font-black text-[#F4EBDD] sm:text-5xl">
            Giỏ hàng của bạn
          </h1>

          <p className="mt-3 text-sm font-medium text-[#E3C16F]">
            {cart.length} sản phẩm trong giỏ
          </p>
        </section>

        {cart.length === 0 ? (
          <div className="rounded-[32px] border border-[#bd992d]/30 bg-[#F8F2E7] p-10 text-center shadow-xl shadow-black/25 sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#bd992d]/40 bg-[#FFF8E6] text-[#bd992d]">
              <FiShoppingBag size={32} />
            </div>

            <h2 className="mt-6 font-['Noto_Serif'] text-2xl font-bold text-[#2A1E13]">
              Giỏ hàng của bạn đang trống
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-[#6F5A3A]">
              Hãy khám phá các bộ sưu tập nội thất cao cấp của WOODÉ và thêm
              những sản phẩm bạn yêu thích vào giỏ hàng.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-8 rounded-full bg-gradient-to-r from-[#A87822] via-[#bd992d] to-[#E3C16F] px-8 py-4 text-sm font-bold text-[#100C08] shadow-lg shadow-black/25 transition hover:scale-105"
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
                  className="rounded-[28px] border border-[#bd992d]/30 bg-[#F8F2E7] p-5 shadow-xl shadow-black/20 transition hover:border-[#bd992d]/70"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-32 w-32 rounded-2xl border border-[#D8C79A] bg-white object-cover"
                    />

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-['Noto_Serif'] text-lg font-bold text-[#2A1E13]">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm font-semibold text-[#7A5C12]">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C79A] bg-white text-[#7A5C12] transition hover:border-[#bd992d] hover:bg-[#FFF8E6]"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                        <div className="flex items-center gap-2 rounded-full border border-[#D8C79A] bg-white px-4 py-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item, item.quantity - 1)
                            }
                            className="flex h-6 w-6 items-center justify-center text-[#7A5C12] transition hover:text-[#2A1E13]"
                          >
                            <FiMinus size={16} />
                          </button>

                          <span className="w-6 text-center text-sm font-semibold text-[#2A1E13]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item, item.quantity + 1)
                            }
                            className="flex h-6 w-6 items-center justify-center text-[#7A5C12] transition hover:text-[#2A1E13]"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>

                        <p className="text-xl font-black text-[#5A3A12]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-[32px] border border-[#bd992d]/30 bg-[#F8F2E7] p-8 shadow-xl shadow-black/20 lg:sticky lg:top-32">
              <h2 className="font-['Noto_Serif'] text-2xl font-bold text-[#2A1E13]">
                Tóm tắt đơn hàng
              </h2>

              <div className="mt-8 space-y-4 border-b border-[#D8C79A] pb-6 text-sm">
                <div className="flex items-center justify-between text-[#6F5A3A]">
                  <span>Tạm tính</span>

                  <span className="font-semibold text-[#2A1E13]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-semibold text-[#2A1E13]">
                  Tổng cộng
                </span>

                <span className="text-3xl font-black text-[#5A3A12]">
                  {formatPrice(total)}
                </span>
              </div>

              <p className="mt-4 text-xs leading-6 text-[#6F5A3A]">
                Mức giá đã bao gồm thuế VAT. Phí vận chuyển sẽ được tính ở bước
                thanh toán.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    navigate("/login", { state: { from: "/cart" } });
                  } else {
                    navigate("/checkout");
                  }
                }}
                className="mt-8 w-full rounded-full bg-gradient-to-r from-[#A87822] via-[#bd992d] to-[#E3C16F] py-4 text-sm font-bold text-[#100C08] shadow-lg shadow-black/25 transition hover:scale-[1.02]"
              >
                {user ? "Tiến hành thanh toán" : "Đăng nhập để thanh toán"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-4 w-full rounded-full border border-[#bd992d]/50 bg-white py-4 text-sm font-semibold text-[#6F5411] transition hover:bg-[#FFF8E6] hover:text-[#2A1E13]"
              >
                Tiếp tục mua sắm
              </button>
            </aside>
          </div>
        )}

        {user && <PersonalizedProducts />}
      </div>
    </div>
  );
}

export default Cart;