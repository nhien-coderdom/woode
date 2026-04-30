import { useNavigate } from "react-router-dom";
import FeaturedSlider from "../components/FeaturedSlider";
import FurnitureGrid from "../components/FurnitureGrid";
import { FeaturedProduct3D } from "../components/3d/FeaturedProduct3D";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#100C08] text-[#F4EBDD] font-sans">
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-88px)] overflow-x-hidden overflow-y-hidden bg-[#6b5c4d] pt-12 pb-10">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6b5c4d] via-[#1A130D] to-[#090705]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_72%_36%,_var(--tw-gradient-stops))] from-[#C99A3A] via-transparent to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-start gap-10 lg:gap-14">
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1 pt-10 lg:pt-14 xl:pt-16">
              <h1 className="font-['Noto_Serif'] font-black tracking-tight text-[#F4EBDD] drop-shadow-lg leading-[1.12]">
                <span className="block text-[clamp(3rem,5.2vw,5.8rem)]">
                  Nghệ thuật
                </span>

                <span className="block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#E3C16F] via-[#C99A3A] to-[#8F6418] text-[clamp(2rem,3.6vw,4rem)] leading-[1.2]">
                  Nội thất đương đại
                </span>
              </h1>

              <p className="font-['Noto_Serif'] mt-8 text-base sm:text-lg lg:text-xl leading-8 text-[#E3C16F] max-w-xl mx-auto lg:mx-0">
                Khám phá bộ sưu tập nội thất cao cấp WOODÉ, nơi thiết kế tinh tế
                hòa quyện cùng chất liệu thượng hạng, kiến tạo không gian sống
                đẳng cấp.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/products")}
                  className="px-8 py-4 bg-gradient-to-r from-[#A87822] via-[#C99A3A] to-[#E3C16F] text-[#100C08] font-bold rounded-full shadow-lg shadow-black/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Khám phá ngay
                </button>

                <button
                  onClick={() => navigate("/about")}
                  className="px-8 py-4 bg-[#130E09]/70 border border-[#8F6418]/80 text-[#E3C16F] font-bold rounded-full hover:bg-[#C99A3A] hover:text-[#100C08] transition-all duration-300"
                >
                  Về chúng tôi
                </button>
              </div>
            </div>

            {/* 3D Model Display */}
            <div className="relative order-1 lg:order-2 w-full h-[320px] sm:h-[420px] lg:h-[560px] xl:h-[620px] overflow-visible pt-4">
              <div className="absolute inset-0 scale-[0.82] sm:scale-[0.9] lg:scale-[0.95] origin-center">
                <FeaturedProduct3D
                  modelUrl="/side_table_01_2k.gltf"
                  className="w-full h-full"
                />
              </div>

              <div
                className="absolute top-6 right-4 sm:right-10 bg-[#130E09]/80 backdrop-blur-md border border-[#8F6418]/50 px-4 py-2 rounded-2xl animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <p className="text-[#E3C16F] font-bold text-sm">
                  Thiết kế Bắc Âu
                </p>
              </div>

              <div
                className="absolute bottom-8 left-4 sm:left-10 bg-[#130E09]/80 backdrop-blur-md border border-[#8F6418]/50 px-4 py-2 rounded-2xl animate-bounce"
                style={{ animationDuration: "4s", animationDelay: "1s" }}
              >
                <p className="text-[#E3C16F] font-bold text-sm">
                  Gỗ sồi nguyên khối
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="relative z-20 bg-[#3b342a] rounded-t-[3rem] shadow-2xl pt-6 pb-12">
        <FeaturedSlider />
      </section>

      {/* Grid Products */}
      <section className="bg-[#39332b] pb-16">
        <FurnitureGrid />
      </section>
    </div>
  );
}

export default Home;