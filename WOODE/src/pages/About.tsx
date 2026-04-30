import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiTool, FiHeart, FiStar, FiFeather } from "react-icons/fi";
import aboutWoode from "../assets/woode.png";

function About() {
  const navigate = useNavigate();

  const highlights = [
    {
      icon: <FiTool size={20} />,
      title: "Chế tác tỉ mỉ",
      description:
        "Mỗi sản phẩm được tạo từ nguyên liệu gỗ cao cấp, qua quy trình chế tác khéo léo với sự chú ý tuyệt đối đến từng chi tiết.",
    },
    {
      icon: <FiHeart size={20} />,
      title: "Thiết kế tâm huyết",
      description:
        "WOODÉ mong muốn mỗi sản phẩm là một tuyên bố về lối sống, mang đến sự thoải mái, thẩm mỹ và bền vững cho gia đình bạn.",
    },
    {
      icon: <FiStar size={20} />,
      title: "Phong cách vượt thời gian",
      description:
        "Chúng tôi kết hợp truyền thống chế tác gỗ với thiết kế hiện đại để tạo nên những đồ nội thất thanh lịch, bền bỉ và đẹp mắt.",
    },
  ];

  const values = [
    {
      title: "Chất lượng trong từng chi tiết",
      description:
        "Từ lựa chọn gỗ, quy trình sản xuất đến hoàn thiện cuối cùng, WOODE theo đuổi sự tuyệt hảo để tạo nên sản phẩm vượt thời gian.",
    },
    {
      title: "Bền vững và có trách nhiệm",
      description:
        "Chúng tôi cam kết sử dụng nguyên liệu bền vững, thiết kế đa chức năng và sản xuất đạo đức để giảm tác động đến môi trường.",
    },
    {
      title: "Thiết kế cho cuộc sống thực",
      description:
        "WOODÉ tạo ra đồ nội thất không chỉ đẹp mà còn thực tế, dễ chăm sóc và phù hợp với những gia đình hiện đại năng động.",
    },
  ];

 return (
  <div className="mx-auto mt-20 w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
    <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#FFFDF8] via-[#F7EBDD] to-[#d8c6b0] px-6 py-10 shadow-[0_24px_70px_rgba(92,62,38,0.16)] md:px-10 md:py-14 lg:px-14">
      <div className="absolute -right-8 top-0 h-40 w-40 rounded-full bg-[#d6d3cf]/25 blur-3xl" />
      <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-[#cfc6bc]/10 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B88746]">
            Câu chuyện của WOODÉ
          </p>

          <h1 className="max-w-2xl font-['Noto_Serif'] text-[clamp(32px,4vw,60px)] font-black leading-[1.15] text-[#2B2118]">
            Tạo nên những đồ nội thất đẹp và bền vững.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#6F6257] md:text-lg">
            WOODÉ được xây dựng với niềm đam mê về chế tác gỗ và thiết kế hiện đại,
            nơi chất lượng gặp gỡ sáng tạo. Chúng tôi tin rằng ngôi nhà của bạn
            xứng đáng được trang trí bằng những đồ vật không chỉ đẹp mà còn bền lâu.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/products")}
              className="rounded-full bg-gradient-to-r from-[#5A3E2B] to-[#9A6A3E] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(90,62,43,0.28)] transition-all duration-300 hover:-translate-y-[2px] hover:from-[#6B4A32] hover:to-[#B88746] hover:shadow-[0_16px_34px_rgba(90,62,43,0.34)]"
            >
              Khám phá bộ sưu tập
            </button>

            <button
              onClick={() => navigate("/")}
              className="rounded-full border border-[#D7C3AB] bg-[#f1d6b5]/80 px-6 py-3 text-sm font-semibold text-[#5A3E2B] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-[2px] hover:border-[#B88746] hover:bg-[#FFF8EF] hover:shadow-md"
            >
              Về trang chủ
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[32px] shadow-[0_22px_55px_rgba(43,33,24,0.22)]">
            <img
              src={aboutWoode}
              alt="About WOODÉ"
              className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-[1.03] md:h-[420px]"
            />
          </div>

          <div className="absolute -bottom-5 left-4 rounded-[24px] border border-[#E7D7C4] bg-[#faeddd]/95 px-5 py-4 shadow-[0_14px_34px_rgba(43,33,24,0.16)] backdrop-blur md:left-6">
            <p className="text-sm font-semibold text-[#2B2118]">Từ năm 2025</p>
            <p className="mt-1 text-sm text-[#7A6A5B]">
              Chế tác nội thất gỗ chất lượng cao với thiết kế hiện đại
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[32px] border border-[#E8D8C3] bg-[#dad6d0] p-8 shadow-[0_16px_42px_rgba(92,62,38,0.10)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_22px_52px_rgba(92,62,38,0.14)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B88746]">
          Câu chuyện
        </p>

        <h2 className="mt-3 text-3xl font-black text-[#2B2118]">
          Câu chuyện của WOODÉ
        </h2>

        <div className="mt-6 space-y-4 leading-8 text-[#6F6257]">
          <p>
            WOODÉ ra đời từ đam mê với những sản phẩm gỗ handcrafted, nơi truyền thống
            chế tác gỗ gặp gỡ thiết kế hiện đại. Chúng tôi tin rằng mỗi mảnh nội thất
            là một lựa chọn cộng tính trong không gian sống của bạn.
          </p>

          <p>
            Mỗi sản phẩm WOODÉ được thiết kế tỉ mỉ, tận tâm với việc lựa chọn gỗ
            nguyên khối chất lượng cao, kết hợp kỹ thuật chế tác truyền thống
            với công nghệ hiện đại để đảm bảo độ bền và tính thẩm mỹ.
          </p>

          <p>
            Với WOODÉ, chúng tôi mong muốn mang đến không chỉ là đồ nội thất,
            mà là những sáng tạo bền vững, vượt thời gian, trở thành những ký ức
            đẹp trong mỗi căn nhà.
          </p>
        </div>
      </div>

      <div className="rounded-[32px] border border-[#E8D8C3] bg-gradient-to-br from-[#dad6d0] to-white p-8 shadow-[0_16px_42px_rgba(92,62,38,0.10)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_22px_52px_rgba(92,62,38,0.14)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B88746]">
          Điều khác biệt
        </p>

        <h2 className="mt-3 text-3xl font-black text-[#2B2118]">
          Tại sao chọn WOODÉ
        </h2>

        <div className="mt-8 grid gap-5">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="group rounded-[24px] border border-[#E5D1B8] bg-[#fffdfb]/85 p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-[#C6A15B] hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fffdfb] text-[#9A6A3E] transition-all duration-300 group-hover:bg-[#5A3E2B] group-hover:text-[#F8E7C7]">
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2B2118]">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-7 text-[#6F6257]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mt-14">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3E3CD] text-[#9A6A3E]">
          <FiFeather size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B88746]">
            Giá trị cốt lõi
          </p>
          <h2 className="font-['Noto_Serif'] text-3xl font-black text-[#d6861c]">
            Những giá trị của WOODE
          </h2>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {values.map((item, index) => (
          <div
            key={index}
            className="rounded-[30px] border border-[#E8D8C3] bg-[#FFFDF8] p-7 shadow-[0_14px_36px_rgba(92,62,38,0.10)] transition-all duration-300 hover:-translate-y-[2px] hover:border-[#C6A15B] hover:shadow-[0_20px_46px_rgba(92,62,38,0.14)]"
          >
            <div className="mb-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#5A3E2B] to-[#C6A15B]" />
            <h3 className="text-2xl font-black text-[#2B2118]">
              {item.title}
            </h3>
            <p className="mt-4 leading-8 text-[#6F6257]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="mt-14 overflow-hidden rounded-[36px] bg-gradient-to-r from-[#695339] via-[#8d7151] to-[#8d765c] px-8 py-12 text-white shadow-[0_24px_70px_rgba(58,42,30,0.28)] md:px-12">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F8E7C7]">
          Khám phá ngay
        </p>

        <h2 className="mt-3 font-['Noto_Serif'] text-3xl font-black md:text-4xl">
          Tìm hiểu bộ sưu tập nội thất WOODÉ
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-8 text-[#F7EBDD] md:text-lg">
          Thưởng thức những sản phẩm nội thất được chế tác kỹ lưỡng,
          kết hợp giữa chất lượng, thiết kế và bền vững cho không gian sống của bạn.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FFFDF8] px-7 py-3 text-sm font-bold text-[#5A3E2B] shadow-md transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#F8E7C7] hover:shadow-lg"
        >
          Xem sản phẩm
          <FiArrowRight size={16} />
        </button>
      </div>
    </section>
  </div>
)
};
export default About;