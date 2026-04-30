import { FiAward, FiCheck } from "react-icons/fi";
import { formatPrice } from "../utils/checkout.utils";
import { POINTS_STEP, POINTS_TO_VND_RATE } from "../constants/checkout.constant";

interface LoyaltyPointsSectionProps {
  loyaltyPoints: number;
  usePointsAmount: number;
  maxPointsCanUse: number;
  onChange: (value: number) => void;
}

export default function LoyaltyPointsSection({
  loyaltyPoints,
  usePointsAmount,
  maxPointsCanUse,
  onChange,
}: LoyaltyPointsSectionProps) {
  const discountFromUsedPoints =
    (usePointsAmount / POINTS_STEP) * POINTS_TO_VND_RATE;

  return (
    <div className="rounded-[28px] border border-[#bd992d]/30 bg-[#F8F2E7] p-6 shadow-xl shadow-black/20 sm:p-8">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-[#2A1E13] sm:text-xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF8E6] text-[#bd992d] shadow-sm">
          <FiAward size={20} />
        </span>
        Sử dụng điểm tích lũy
      </h2>

      <div className="mb-5">
        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-sm font-semibold text-[#3A2A12]">
            Điểm sẽ dùng
          </label>

          <span className="text-sm font-medium text-[#6F5A3A]">
            Có sẵn:{" "}
            <span className="font-bold text-[#7A5C12]">
              {loyaltyPoints.toLocaleString()} điểm
            </span>
          </span>
        </div>

        <input
          type="number"
          value={usePointsAmount === 0 ? "" : usePointsAmount}
          onChange={(e) => {
            if (e.target.value === "") {
              onChange(0);
              return;
            }

            const parsedValue = parseInt(e.target.value, 10) || 0;
            const normalizedValue = Math.max(
              0,
              Math.min(parsedValue, maxPointsCanUse)
            );

            onChange(normalizedValue);
          }}
          min={0}
          max={maxPointsCanUse}
          step={POINTS_STEP}
          className="w-full rounded-xl border border-[#D8C79A] bg-white px-4 py-3 text-sm font-medium text-[#2F2308] placeholder:text-[#9A8B65] outline-none transition focus:border-[#bd992d] focus:ring-2 focus:ring-[#bd992d]/25"
          placeholder="Nhập số điểm muốn dùng"
        />

        <p className="mt-2 text-xs font-medium text-[#6F5A3A]">
          Tối đa có thể dùng:{" "}
          <span className="font-bold text-[#7A5C12]">
            {maxPointsCanUse.toLocaleString()} điểm
          </span>
        </p>
      </div>

      {usePointsAmount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[#bd992d]/30 bg-[#FFF8E6] p-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#bd992d] text-white">
            <FiCheck size={17} />
          </span>

          <span className="text-sm font-semibold text-[#6F5411]">
            Đã áp dụng giảm{" "}
            <span className="font-bold text-[#2A1E13]">
              {formatPrice(discountFromUsedPoints)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}