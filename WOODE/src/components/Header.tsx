import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiUser, FiLogOut } from "react-icons/fi";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isProductActive = location.pathname.startsWith("/products") || location.pathname.startsWith("/product");

  return (
    <header className="w-full px-6 py-4 bg-[#151515] border-b border-[#2A2A2A] absolute top-0 left-0 z-50">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <NavLink to="/" className="font-serif text-3xl font-black tracking-widest text-[#F5F0EB]">
            WOOD<span className="text-[#8B6914]">É</span>
          </NavLink>
        </div>

        {/* NAV */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 shadow-lg border border-[#3A3A3A]">

            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#8B6914] px-5 py-2 text-[#1A1A1A] font-bold transition-all duration-300"
                  : "px-5 py-2 text-[#A09890] hover:text-[#F5F0EB] hover:bg-[#2A2A2A] rounded-full transition-all duration-300"
              }
            >
              Trang chủ
            </NavLink>

            {/* Product */}
            <NavLink
              to="/products"
              className={
                isProductActive
                  ? "rounded-full bg-[#8B6914] px-5 py-2 text-[#1A1A1A] font-bold transition-all duration-300"
                  : "px-5 py-2 text-[#A09890] hover:text-[#F5F0EB] hover:bg-[#2A2A2A] rounded-full transition-all duration-300"
              }
            >
              Sản phẩm
            </NavLink>

            {/* About */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#8B6914] px-5 py-2 text-[#1A1A1A] font-bold transition-all duration-300"
                  : "px-5 py-2 text-[#A09890] hover:text-[#F5F0EB] hover:bg-[#2A2A2A] rounded-full transition-all duration-300"
              }
            >
              Về WOODÉ
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-[#8B6914] px-5 py-2 text-[#1A1A1A] font-bold transition-all duration-300"
                  : "px-5 py-2 text-[#A09890] hover:text-[#F5F0EB] hover:bg-[#2A2A2A] rounded-full transition-all duration-300"
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
                className="flex items-center gap-2 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] px-5 py-2.5 text-sm font-semibold text-[#F5F0EB] hover:bg-[#3A3A3A] transition-all"
              >
                <FiUser size={16} className="text-[#D4A574]" />
                <span className="hidden sm:inline">
                  {user.name?.split(" ").pop() || "Profile"}
                </span>
              </NavLink>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full bg-red-950/30 border border-red-900/50 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-900/50 transition-all"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-gradient-to-r from-[#8B6914] to-[#D4A574] px-6 py-2.5 text-sm font-bold text-[#1A1A1A] shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
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