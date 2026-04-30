import { useState } from "react";
import type { CheckoutFormData, SavedAddress } from "../types/checkout.types";

type Props = {
  userName?: string | null;
  userPhone?: string | null;
  userEmail?: string | null;
  userAddress?: string | null;
  formData: CheckoutFormData;
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  isAddingNewAddress: boolean;
  setAsDefaultAddress: boolean;
  editingAddressId: string | null;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSelectAddress: (addressId: string) => void;
  onEditAddress: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => void;
  onStartAddNew: () => void;
  onCancelAddOrEdit: () => void;
  onSaveAddress: () => void;
  onToggleDefault: (checked: boolean) => void;
};

export default function ShippingForm({
  formData,
  savedAddresses,
  selectedAddressId,
  isAddingNewAddress,
  setAsDefaultAddress,
  editingAddressId,
  onInputChange,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  onStartAddNew,
  onCancelAddOrEdit,
  onSaveAddress,
  onToggleDefault,
}: Props) {
  const [pendingDeleteAddressId, setPendingDeleteAddressId] = useState<
    string | null
  >(null);

  const inputClass =
    "w-full rounded-xl border border-[#D8C79A] bg-white px-4 py-3 text-sm text-[#2F2308] placeholder:text-[#9A8B65] outline-none transition focus:border-[#bd992d] focus:ring-2 focus:ring-[#bd992d]/25";

  return (
    <>
      <div className="rounded-[28px] border border-[#bd992d]/30 bg-[#F8F2E7] p-6 shadow-xl shadow-black/20 sm:p-8">
        <h2 className="mb-6 text-xl font-bold text-[#2A1E13]">
          Địa chỉ nhận hàng
        </h2>

        {savedAddresses.length > 0 && (
          <div className="mb-5 space-y-3">
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectAddress(address.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectAddress(address.id);
                  }
                }}
                className={`w-full rounded-2xl border p-5 text-left shadow-sm transition ${
                  selectedAddressId === address.id
                    ? "border-[#bd992d] bg-[#FFF8E6] ring-2 ring-[#bd992d]/20"
                    : "border-[#D8C79A] bg-white/80 hover:border-[#bd992d]/70 hover:bg-[#FFF8E6]"
                }`}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-base font-bold text-[#1F1609]">
                    {address.fullName}
                  </p>

                  <span className="text-sm text-[#5F5238]">
                    {address.email}
                  </span>

                  <span className="text-sm text-[#5F5238]">
                    {address.phone}
                  </span>
                </div>

                <p className="mt-2 text-sm text-[#4A3A1F]">
                  {[address.address].filter(Boolean).join(", ")}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(address.id);
                    }}
                    className="rounded-lg border border-[#D8C79A] bg-white px-4 py-2 text-xs font-semibold text-[#3A2A12] transition hover:border-[#bd992d] hover:bg-[#F6EDD4]"
                  >
                    Chỉnh sửa
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteAddressId(address.id);
                    }}
                    className="rounded-lg border border-[#bd992d] bg-[#F8F2E7] px-4 py-2 text-xs font-semibold text-[#7A5C12] transition hover:bg-[#bd992d] hover:text-white"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStartAddNew}
            className="rounded-xl border border-[#bd992d] bg-[#F8F2E7] px-5 py-3 text-sm font-bold text-[#6F5411] transition hover:bg-[#bd992d] hover:text-white"
          >
            + Thêm địa chỉ mới
          </button>

          {savedAddresses.length > 0 && isAddingNewAddress && (
            <button
              type="button"
              onClick={onCancelAddOrEdit}
              className="rounded-xl border border-[#D8C79A] bg-white px-5 py-3 text-sm font-semibold text-[#6F5A3A] transition hover:border-[#bd992d] hover:bg-[#FFF8E6]"
            >
              Hủy thêm mới
            </button>
          )}
        </div>

        {isAddingNewAddress && (
          <>
            <div className="mb-4 flex items-center gap-2">
              <input
                id="default-address"
                type="checkbox"
                checked={setAsDefaultAddress}
                onChange={(e) => onToggleDefault(e.target.checked)}
                className="h-4 w-4 accent-[#bd992d]"
              />

              <label
                htmlFor="default-address"
                className="text-sm font-medium text-[#5F5238]"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={onInputChange}
                required
                className={inputClass}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={onInputChange}
                required
                className={inputClass}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={onInputChange}
              required
              className={`mt-4 ${inputClass}`}
            />

            <textarea
              name="address"
              placeholder="Địa chỉ chi tiết"
              value={formData.address}
              onChange={onInputChange}
              required
              rows={3}
              className={`mt-4 resize-none ${inputClass}`}
            />

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onSaveAddress}
                className="rounded-xl bg-gradient-to-r from-[#A87822] via-[#bd992d] to-[#E3C16F] px-6 py-3 text-sm font-bold text-[#100C08] shadow-md shadow-black/15 transition hover:scale-[1.02]"
              >
                {editingAddressId ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
              </button>
            </div>
          </>
        )}

        {!isAddingNewAddress && selectedAddressId && (
          <p className="rounded-xl bg-[#FFF8E6] px-4 py-3 text-sm font-medium text-[#6F5411]">
            Đang sử dụng địa chỉ đã chọn để giao hàng.
          </p>
        )}
      </div>

      {pendingDeleteAddressId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#bd992d]/30 bg-[#F8F2E7] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#2F2308]">
              Xóa địa chỉ?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#6F5A3A]">
              Bạn có chắc muốn xóa địa chỉ này không?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteAddressId(null)}
                className="rounded-xl border border-[#D8C79A] bg-white px-4 py-2 text-sm font-semibold text-[#3A2A12] transition hover:bg-[#FFF8E6]"
              >
                Thoát
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeleteAddress(pendingDeleteAddressId);
                  setPendingDeleteAddressId(null);
                }}
                className="rounded-xl bg-[#bd992d] px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}