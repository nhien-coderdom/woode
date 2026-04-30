import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiUser, FiLogOut } from "react-icons/fi";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isProductActive = location.pathname.startsWith("/products") || location.pathname.startsWith("/product");

  return (
    <header className="w-full px-6 py-4 bg-[#151515] border-b border-[#1F1C18] absolute top-0 left-0 z-50">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <NavLink to="/" className=" font-['Noto_Serif'] text-3xl font-black tracking-widest text-[#F5F0EB]">
            WOOD<span className="text-[#D8A94A]">É</span>
          </NavLink>
        </div>

        {/* NAV */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 shadow-lg border border-[#4A4035]">

            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#D8A94A] px-5 py-2 text-[#1A1A1A] font-bold transition-all duration-300"
                  : "px-5 py-2 text-[#E0B84F] hover:text-[#F5F0EB] hover:bg-[#1F1C18] rounded-full transition-all duration-300"
              }
            >
              Trang chủ
            </NavLink>

            {/* Product */}
            <NavLink
              to="/products"
              className={
                isProductActive
                  ? "rounded-full bg-[#D8A94A] px-5 py-2 text-[#1A1A1A] font-bold transition-all duration-300"
                  : "px-5 py-2 text-[#E0B84F] hover:text-[#F5F0EB] hover:bg-[#1F1C18] rounded-full transition-all duration-300"
              }
            >
              Sản phẩm
            </NavLink>

            {/* About */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#D8A94A] px-5 py-2 text-[#1A1A1A] font-bold transition-all duration-300"
                  : "px-5 py-2 text-[#E0B84F] hover:text-[#F5F0EB] hover:bg-[#1F1C18] rounded-full transition-all duration-300"
              }
            >
              Về WOODÉ
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#D8A94A] px-5 py-2 text-[#1A1A1A] font-bold transition-all duration-300"
                  : "px-5 py-2 text-[#E0B84F] hover:text-[#F5F0EB] hover:bg-[#1F1C18] rounded-full transition-all duration-300"
              }
            >
              Giỏ hàng
            </NavLink>

          </div>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NavLink
                to="/profile"
                className="flex items-center gap-2 rounded-full bg-[#1F1C18] border border-[#4A4035] px-5 py-2.5 text-sm font-semibold text-[#F5F0EB] hover:bg-[#4A4035] transition-all"
              >
                <FiUser size={16} className="text-[#E0B84F]" />
                <span className="hidden sm:inline">
                  {user.name?.split(" ").pop() || "Profile"}
                </span>
              </NavLink>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full bg-[#8B6F47]/20 border border-[#8B6F47]/50 px-5 py-2.5 text-sm font-semibold text-[#D4AF37] hover:bg-[#8B6F47]/40 transition-all"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-gradient-to-r from-[#D8A94A] to-[#E0B84F] px-6 py-2.5 text-sm font-bold text-[#1A1A1A] shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Đăng nhập
            </NavLink>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;