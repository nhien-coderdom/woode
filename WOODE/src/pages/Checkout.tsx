import CheckoutSteps from "../checkout/components/CheckoutSteps";
import ShippingForm from "../checkout/components/ShippingForm";
import PaymentSection from "../checkout/components/PaymentSection";
import LoyaltyPointsSection from "../checkout/components/LoyaltyPointsSection";
import ConfirmationSection from "../checkout/components/ConfirmationSection";
import OrderSummary from "../checkout/components/OrderSummary";
import { useCheckout } from "../checkout/hooks/useCheckout";

function Checkout() {
  const {
    cart,
    user,
    step,
    setStep,
    formData,
    handleInputChange,
    savedAddresses,
    selectedAddressId,
    isAddingNewAddress,
    setAsDefaultAddress,
    editingAddressId,
    onSelectAddress,
    onEditAddress,
    onDeleteAddress,
    onStartAddNew,
    onCancelAddOrEdit,
    onSaveAddress,
    onToggleDefault,
    usePointsAmount,
    setUsePointsAmount,
    maxPointsCanUse,
    subtotal,
    discountFromPoints,
    discountFromTier,
    discountPercentage,
    finalAmount,
    isSubmitting,
    handleBackStep,
    handleSubmit,
    goHome,
  } = useCheckout();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#100C08] pt-28 text-[#F4EBDD]">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
          <h1 className="mb-6 font-['Noto_Serif'] text-3xl font-bold text-[#F4EBDD]">
            Giỏ hàng trống
          </h1>

          <button
            onClick={goHome}
            className="rounded-full bg-gradient-to-r from-[#A87822] via-[#bd992d] to-[#E3C16F] px-8 py-3 text-sm font-bold text-[#100C08] shadow-lg shadow-black/30 transition hover:scale-105"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2A261F] pt-24 pb-16 text-[#F4EBDD]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <CheckoutSteps step={step} onStepChange={setStep} />

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <ShippingForm
                  userName={user?.name}
                  userPhone={user?.phone}
                  userEmail={user?.email}
                  userAddress={user?.address}
                  formData={formData}
                  savedAddresses={savedAddresses}
                  selectedAddressId={selectedAddressId}
                  isAddingNewAddress={isAddingNewAddress}
                  setAsDefaultAddress={setAsDefaultAddress}
                  editingAddressId={editingAddressId}
                  onInputChange={handleInputChange}
                  onSelectAddress={onSelectAddress}
                  onEditAddress={onEditAddress}
                  onDeleteAddress={onDeleteAddress}
                  onStartAddNew={onStartAddNew}
                  onCancelAddOrEdit={onCancelAddOrEdit}
                  onSaveAddress={onSaveAddress}
                  onToggleDefault={onToggleDefault}
                />
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <PaymentSection
                    paymentMethod={formData.paymentMethod}
                    onChange={handleInputChange}
                  />

                  {user && (user.loyaltyPoint || 0) > 0 && (
                    <LoyaltyPointsSection
                      loyaltyPoints={user.loyaltyPoint || 0}
                      usePointsAmount={usePointsAmount}
                      maxPointsCanUse={maxPointsCanUse}
                      onChange={setUsePointsAmount}
                    />
                  )}
                </div>
              )}

              {step === 3 && <ConfirmationSection formData={formData} />}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="flex-1 rounded-full border border-[#bd992d]/50 bg-[#1A130D] py-4 text-sm font-semibold text-[#E3C16F] transition hover:bg-[#2A2118] hover:text-[#F4EBDD]"
                  >
                    Quay lại
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-gradient-to-r from-[#A87822] via-[#bd992d] to-[#E3C16F] py-4 text-sm font-bold text-[#100C08] shadow-lg shadow-black/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : step === 3
                    ? "Xác nhận đặt hàng"
                    : "Tiếp tục"}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              usePointsAmount={usePointsAmount}
              discountFromPoints={discountFromPoints}
              discountFromTier={discountFromTier}
              discountPercentage={discountPercentage}
              finalAmount={finalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;