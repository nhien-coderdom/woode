import { FiCheck } from "react-icons/fi";
import type { CheckoutFormData } from "../types/checkout.types";
import {
  getFullAddress,
  getPaymentMethodLabel,
} from "../utils/checkout.utils";

interface ConfirmationSectionProps {
  formData: CheckoutFormData;
}

export default function ConfirmationSection({
  formData,
}: ConfirmationSectionProps) {
  return (
    <div className="rounded-2xl border border-[#eadcae] bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-[#3f2f0b] mb-6">
        Xác nhận đơn hàng
      </h2>

      <div className="space-y-4 border-b border-[#eadcae] pb-6">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#7a6a3a]">Tên:</span>
          <span className="font-semibold text-[#2f2308]">
            {formData.fullName}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#7a6a3a]">Email:</span>
          <span className="font-semibold text-[#2f2308]">
            {formData.email}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#7a6a3a]">Điện thoại:</span>
          <span className="font-semibold text-[#2f2308]">
            {formData.phone}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#7a6a3a]">Địa chỉ:</span>
          <span className="font-semibold text-[#2f2308] text-right max-w-xs">
            {getFullAddress(formData)}
          </span>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#7a6a3a]">Phương thức:</span>
          <span className="font-semibold text-[#2f2308]">
            {getPaymentMethodLabel(formData.paymentMethod)}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-[#f7efd6] border border-[#bd992d]/30 p-4">
        <p className="text-sm text-[#6f5411] flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#bd992d] text-white flex-shrink-0">
            <FiCheck size={16} />
          </span>
          Tất cả thông tin đã được xác nhận. Hãy bấm "Đặt hàng" để hoàn tất.
        </p>
      </div>
    </div>
  );
}