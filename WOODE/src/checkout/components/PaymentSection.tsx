import type { CheckoutFormData } from "../types/checkout.types";
import { PAYMENT_METHODS } from "../constants/checkout.constant";

interface PaymentSectionProps {
  paymentMethod: CheckoutFormData["paymentMethod"];
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export default function PaymentSection({
  paymentMethod,
  onChange,
}: PaymentSectionProps) {
  return (
    <div className="rounded-[28px] border border-[#bd992d]/30 bg-[#F8F2E7] p-6 shadow-xl shadow-black/20 sm:p-8">
      <h2 className="mb-6 text-lg font-bold text-[#2A1E13] sm:text-xl">
        Phương thức thanh toán
      </h2>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = paymentMethod === method.id;

          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 shadow-sm transition ${
                isSelected
                  ? "border-[#bd992d] bg-[#FFF8E6] ring-2 ring-[#bd992d]/20"
                  : "border-[#D8C79A] bg-white/80 hover:border-[#bd992d]/70 hover:bg-[#FFF8E6]"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={isSelected}
                onChange={onChange}
                className="h-5 w-5 cursor-pointer accent-[#bd992d]"
              />

              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  isSelected
                    ? "bg-[#bd992d] text-white"
                    : "bg-[#F8F2E7] text-[#7A5C12]"
                }`}
              >
                <Icon size={20} />
              </span>

              <span
                className={`text-sm font-bold transition ${
                  isSelected ? "text-[#2A1E13]" : "text-[#5F5238]"
                }`}
              >
                {method.name}
              </span>
            </label>
          );
        })}
      </div>

      {paymentMethod === "vnpay" && (
        <div className="mt-6 rounded-xl border border-[#bd992d]/30 bg-[#FFF8E6] p-4">
          <p className="text-sm font-medium leading-6 text-[#6F5411]">
            💳 Bạn sẽ được chuyển hướng đến cổng thanh toán VNPay để hoàn tất
            giao dịch.
          </p>
        </div>
      )}
    </div>
  );
}