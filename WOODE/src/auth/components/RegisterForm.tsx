interface RegisterFormProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RegisterForm = ({
  formData,
  errors,
  isLoading,
  onSubmit,
  onChange,
}: RegisterFormProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className="space-y-4"
    >
      {/* NAME */}
      <input
        name="fullName"
        value={formData.fullName}
        onChange={onChange}
        placeholder="Họ tên"
        className="w-full border p-2"
      />
      {errors.fullName && <p className="text-[#D4AF37]">{errors.fullName}</p>}

      {/* EMAIL */}
      <input
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Email"
        className="w-full border p-2"
      />

      {/* PHONE */}
      <input
        name="phone"
        value={formData.phone}
        onChange={onChange}
        placeholder="SĐT"
        className="w-full border p-2"
      />
      {errors.phone && <p className="text-[#D4AF37]">{errors.phone}</p>}

      {/* ADDRESS */}
      <input
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Địa chỉ"
        className="w-full border p-2"
      />

      {/* BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#8B6F47] text-white py-2 hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-all"
      >
        {isLoading ? 'Đang gửi OTP...' : 'Gửi OTP'}
      </button>
    </form>
  );
};