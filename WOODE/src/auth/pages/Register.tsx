import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { auth } from "../../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../lib/api";

function Register() {
  const navigate = useNavigate();
  const { fetchMe } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef<any>(null);
  const confirmationRef = useRef<any>(null);

  // Init Recaptcha
  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Basic validation
      if (!formData.fullName || !formData.phone) {
        throw new Error("Vui lòng nhập Họ tên và Số điện thoại!");
      }
      if (!/^0\d{9}$/.test(formData.phone)) {
        throw new Error("Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0)");
      }

      // 2. Check if phone exists
      const { data } = await axios.get(`${API_BASE_URL}/auth/check-phone/${formData.phone}`);
      if (data.exists) {
        throw new Error("SĐT ĐÃ_TỒN_TẠI");
      }

      // 3. Send OTP
      const phoneNumber = "+84" + formData.phone.slice(1);
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaRef.current
      );
      confirmationRef.current = confirmation;
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      if (err.message === "SĐT ĐÃ_TỒN_TẠI") {
        setError("Số điện thoại này đã được đăng ký. Vui lòng đăng nhập!");
      } else {
        setError(err.message || "Không thể gửi OTP. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Verify OTP
      const result = await confirmationRef.current.confirm(otp);
      const idToken = await result.user.getIdToken();

      // 2. Server Register/Login
      const res = await axios.post(`${API_BASE_URL}/auth/firebase-login`, {
        idToken,
        profile: {
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address,
        },
      });

      // 3. Complete authentication workflow
      const accessToken = res.data.access_token;
      
      // Try to save token to localStorage
      try {
        localStorage.setItem("access_token", accessToken);
        console.log("✅ Token saved to localStorage");
      } catch (storageErr: any) {
        console.warn("⚠️ localStorage blocked, using token from response:", storageErr.message);
        // Token is still in memory, pass it to fetchMe
      }

      // fetchMe will get token from localStorage first, or use provided token
      await fetchMe(accessToken);

      // Navigate home
      navigate("/");
    } catch (err: any) {
      console.error("❌ Login error:", err);
      const serverMsg = err.response?.data?.message;
      const firebaseMsg = err.message;
      setError(serverMsg || firebaseMsg || "Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#15110D] py-6 px-2">
  {/* Background Decor */}
  <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#D8A94A] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
  <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#E0B84F] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>

  <div className="relative w-full max-w-md px-4 mt-20">
    <div className="bg-[#2A261F]/80 backdrop-blur-xl border border-[#4A4035] rounded-[32px] p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl  font-['Noto_Serif'] font-black tracking-widest text-[#F5EFE6]">
            WOOD<span className="text-[#D8A94A]">É</span>
          </h2>
          <p className="text-sm font-medium text-[#C9A86A] mt-4">Nghệ thuật không gian sống</p>
          <p className="text-sm font-semibold text-[#FFD700] mt-1">Tạo tài khoản mới</p>
        </div>

          {error && (
            <div className="mb-6 rounded-xl border border-[#8B6F47]/50 bg-[#8B6F47]/10 px-4 py-3 text-sm text-[#D4AF37] animate-slideDown">
              {error}
            </div>
          )}

          {step === "form" ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#E0B84F] mb-2">Họ và tên *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-[#6A6A6A] group-focus-within:text-[#D8A94A] transition-colors" size={18} />
                  </div>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-[#1F1C18] border border-[#4A4035] text-[#F5F0EB] text-sm rounded-xl focus:ring-1 focus:ring-[#D8A94A] focus:border-[#D8A94A] block pl-11 p-4 transition-all placeholder:text-[#6A6A6A] outline-none"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#E0B84F] mb-2">Số điện thoại *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="text-[#6A6A6A] group-focus-within:text-[#D8A94A] transition-colors" size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912345678"
                    className="w-full bg-[#1F1C18] border border-[#4A4035] text-[#F5F0EB] text-sm rounded-xl focus:ring-1 focus:ring-[#D8A94A] focus:border-[#D8A94A] block pl-11 p-4 transition-all placeholder:text-[#6A6A6A] outline-none"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#E0B84F] mb-2">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-[#6A6A6A] group-focus-within:text-[#D8A94A] transition-colors" size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-[#1F1C18] border border-[#4A4035] text-[#F5F0EB] text-sm rounded-xl focus:ring-1 focus:ring-[#D8A94A] focus:border-[#D8A94A] block pl-11 p-4 transition-all placeholder:text-[#6A6A6A] outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#E0B84F] mb-2">Địa chỉ giao hàng</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMapPin className="text-[#6A6A6A] group-focus-within:text-[#D8A94A] transition-colors" size={18} />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Lê Lợi, Quận 1..."
                    className="w-full bg-[#1F1C18] border border-[#4A4035] text-[#F5F0EB] text-sm rounded-xl focus:ring-1 focus:ring-[#D8A94A] focus:border-[#D8A94A] block pl-11 p-4 transition-all placeholder:text-[#6A6A6A] outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.fullName || !formData.phone}
                className="w-full mt-4 bg-gradient-to-r from-[#b69122] to-[#ffd452] hover:scale-[1.02] text-[#2b2101] font-bold rounded-xl text-sm px-5 py-4 text-center shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Nhận mã OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fadeIn">
              <div className="text-center mb-4">
                <p className="text-sm text-[#E0B84F]">
                  Mã xác nhận đã gửi đến{" "}
                  <span className="font-bold text-[#E0B84F]">{formData.phone}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#E0B84F] mb-2 text-center">
                Nhập mã OTP
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiCheckCircle className="text-[#6A6A6A] group-focus-within:text-[#D8A94A] transition-colors" size={18} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#1F1C18] border border-[#4A4035] text-center text-xl tracking-[0.5em] font-bold text-[#F7F1E8] rounded-xl focus:ring-1 focus:ring-[#D8A94A] focus:border-[#D8A94A] block py-4 transition-all placeholder:text-[#6A6A6A] outline-none"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-to-r from-[#C89432] to-[#F0C66A] hover:scale-[1.02] text-[#1A1208] font-bold rounded-xl text-sm px-5 py-4 text-center shadow-lg transform transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Đang xác thực..." : "Xác nhận đăng ký"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-center text-sm font-semibold text-[#C89432] hover:text-[#F0C66A] transition-colors mt-2"
              >
                Quay lại để sửa thông tin
              </button>
            </form>
          )}

          <div id="recaptcha-container"></div>

          <div className="mt-8 text-center border-t border-[#4A4035] pt-6">
            <p className="text-sm font-medium text-[#9f8d14]">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-[#E0B84F] hover:text-[#F5F0EB] font-bold transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;