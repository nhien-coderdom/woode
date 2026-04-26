import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiPhone, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef<any>(null);
  const confirmationRef = useRef<any>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchMe } = useAuth();
  const from = (location.state as { from?: string } | null)?.from || "/";

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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Validate simple phone
      if (!/^0\d{9}$/.test(phone)) {
        throw new Error("Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 0)");
      }

      // 2. Check if phone exists
      const { data } = await axios.get(`${API_BASE_URL}/auth/check-phone/${phone}`);
      if (!data.exists) {
        throw new Error("SĐT CHƯA_TỒN_TẠI");
      }

      // 3. Send OTP
      const phoneNumber = "+84" + phone.slice(1);
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaRef.current
      );
      confirmationRef.current = confirmation;
      setStep("otp");
    } catch (err: any) {
      if (err.message === "SĐT CHƯA_TỒN_TẠI") {
        setError("Số điện thoại chưa đăng ký. Hãy tạo tài khoản mới!");
      } else {
        setError(err.message || "Lỗi khi kiểm tra SĐT hoặc gửi OTP");
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

      // 2. Server Login
      const res = await axios.post(`${API_BASE_URL}/auth/firebase-login`, {
        idToken,
      });

      // 3. Update Auth Context
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

      // Navigate
      navigate(from, { replace: true });
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#151515]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8B6914] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#D4A574] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative w-full max-w-md px-4 mt-20">
        {/* Glassmorphism Form Card */}
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#3A3A3A] rounded-[32px] p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif font-black tracking-widest text-[#F5F0EB]">
              WOOD<span className="text-[#8B6914]">É</span>
            </h2>
            <p className="text-sm font-medium text-[#A09890] mt-4">Nghệ thuật không gian sống</p>
            <p className="text-sm font-semibold text-[#D4A574] mt-1">Đăng nhập</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400 animate-slideDown">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#A09890] mb-2">
                  Số điện thoại
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="text-[#6A6A6A] group-focus-within:text-[#8B6914] transition-colors" size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] text-[#F5F0EB] text-sm rounded-xl focus:ring-1 focus:ring-[#8B6914] focus:border-[#8B6914] block pl-11 p-4 transition-all placeholder:text-[#6A6A6A] outline-none"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-gradient-to-r from-[#8B6914] to-[#D4A574] hover:scale-[1.02] text-[#1A1A1A] font-bold rounded-xl text-sm px-5 py-4 text-center shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Tiếp tục"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fadeIn">
              <div className="text-center mb-6">
                <p className="text-sm text-[#A09890]">
                  Mã xác nhận đã gửi đến <br/>
                  <span className="font-bold text-[#D4A574] text-lg">{phone}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#A09890] mb-2 text-center">
                  Nhập mã OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiCheckCircle className="text-[#6A6A6A]" size={18} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] text-center text-xl tracking-[0.5em] font-bold text-[#F5F0EB] rounded-xl focus:ring-1 focus:ring-[#8B6914] focus:border-[#8B6914] block py-4 transition-all placeholder:text-[#6A6A6A] outline-none"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-to-r from-[#8B6914] to-[#D4A574] hover:scale-[1.02] text-[#1A1A1A] font-bold rounded-xl text-sm px-5 py-4 text-center shadow-lg transform transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Đang xác thực..." : "Đăng nhập"}
              </button>
              
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-center text-sm font-semibold text-[#A09890] hover:text-[#D4A574] transition-colors mt-2"
              >
                Quay lại
              </button>
            </form>
          )}

          <div id="recaptcha-container"></div>

          <div className="mt-8 text-center border-t border-[#3A3A3A] pt-6">
            <p className="text-sm font-medium text-[#A09890]">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-[#D4A574] hover:text-[#F5F0EB] font-bold transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;