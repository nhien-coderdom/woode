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
      <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center mt-24">
        <h1 className="text-3xl font-serif font-bold text-[#F5F0EB] mb-6">
          Giỏ hàng trống
        </h1>
        <button
          onClick={goHome}
          className="rounded-full bg-gradient-to-r from-[#8B6914] to-[#D4A574] px-8 py-3 text-sm font-bold text-[#1A1A1A] transition hover:scale-105"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl py-8 sm:py-12 px-4 sm:px-0 mt-20 text-[#F5F0EB]">
      <CheckoutSteps step={step} onStepChange={setStep} />

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="bg-[#1A1A1A] rounded-[32px] p-6 sm:p-8 border border-[#2A2A2A] shadow-xl">
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-[#1A1A1A] rounded-[32px] p-6 sm:p-8 border border-[#2A2A2A] shadow-xl">
                  <PaymentSection
                    paymentMethod={formData.paymentMethod}
                    onChange={handleInputChange}
                  />
                </div>

                {user && (user.loyaltyPoint || 0) > 0 && (
                  <div className="bg-[#1A1A1A] rounded-[32px] p-6 sm:p-8 border border-[#2A2A2A] shadow-xl">
                    <LoyaltyPointsSection
                      loyaltyPoints={user.loyaltyPoint || 0}
                      usePointsAmount={usePointsAmount}
                      maxPointsCanUse={maxPointsCanUse}
                      onChange={setUsePointsAmount}
                    />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="bg-[#1A1A1A] rounded-[32px] p-6 sm:p-8 border border-[#2A2A2A] shadow-xl">
                <ConfirmationSection formData={formData} />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex-1 rounded-full border border-[#3A3A3A] bg-[#2A2A2A] py-4 text-sm font-semibold text-[#A09890] transition hover:bg-[#3A3A3A] hover:text-[#F5F0EB]"
                >
                  Quay lại
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-gradient-to-r from-[#8B6914] to-[#D4A574] py-4 text-sm font-bold text-[#1A1A1A] transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? "Đang xử lý..." : step === 3 ? "Xác nhận đặt hàng" : "Tiếp tục"}
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
  );
}

export default Checkout;