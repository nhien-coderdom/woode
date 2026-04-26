import { Link } from "react-router-dom";
import { FaFacebook, FaTiktok, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-[#151515] text-[#F5F0EB] border-t border-[#2A2A2A]">

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* TOP CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">

          {/* LEFT: LOGO */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="font-serif text-4xl font-black tracking-widest text-[#F5F0EB]">
              WOOD<span className="text-[#8B6914]">É</span>
            </Link>
            <p className="text-[#A09890] text-sm text-center md:text-left mt-2 max-w-xs">
              Nội thất đương đại mang phong cách Bắc Âu, kiến tạo không gian sống đẳng cấp và tinh tế.
            </p>
          </div>

          {/* CENTER: MAP MINI */}
          <div className="w-full h-40 rounded-xl overflow-hidden border border-[#3A3A3A] shadow-lg">
            <iframe
              title="map"
              width="100%"
              height="100%"
              src="https://www.google.com/maps?q=10.760596,106.681948&z=15&output=embed"
              style={{ filter: "invert(90%) hue-rotate(180deg)" }}
            />
          </div>

          {/* RIGHT: CONTACT */}
          <div className="flex flex-col gap-4 text-sm text-[#A09890] items-center md:items-end">
            <h4 className="font-serif font-bold text-lg text-[#D4A574]">Liên hệ</h4>
            <div className="flex items-center gap-3">
              <span>273 An Dương Vương, TP.HCM</span>
            </div>

            <div className="flex items-center gap-3">
              <span>Hotline: 1900 1234</span>
            </div>

            <div className="flex items-center gap-6 mt-4 text-xl text-[#F5F0EB]">
              <FaFacebook className="cursor-pointer hover:text-[#8B6914] hover:scale-110 transition-all" />
              <FaTiktok className="cursor-pointer hover:text-[#8B6914] hover:scale-110 transition-all" />
              <FaEnvelope className="cursor-pointer hover:text-[#8B6914] hover:scale-110 transition-all" />
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-[#2A2A2A] my-10"></div>

        {/* BOTTOM MENU */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#A09890]">

          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/loyalty" className="hover:text-[#D4A574] transition-colors">Thành viên & Điểm thưởng</Link>
            <Link to="/contact" className="hover:text-[#D4A574] transition-colors">Liên hệ</Link>
            <Link to="/purchase-policy" className="hover:text-[#D4A574] transition-colors">Chính sách mua hàng</Link>
            <Link to="/privacy-policy" className="hover:text-[#D4A574] transition-colors">Bảo mật</Link>
            <Link to="/terms" className="hover:text-[#D4A574] transition-colors">Điều khoản</Link>
          </div>

          <div className="text-[#6A6A6A] font-serif">
            © 2026 WOODÉ. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;