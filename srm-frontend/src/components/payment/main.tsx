"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SelectPaymentMethod } from "./select-payment-method"
import { EnterCardDetails } from "./enter-card-details"
import { BankTransfer } from "./bank-transfer"
import { ProcessingPayment } from "./processing-payment"
import { PaymentSuccess } from "./payment-success"
import { PaymentFailed } from "./payment-failed"
import PayHereCheckout from "./PayHereCheckout"
import { useSearchParams } from "next/navigation"

type PaymentScreen =
  | "select-method"
  | "card-details"
  | "bank-transfer"
  | "payhere"
  | "processing"
  | "success"
  | "failed"

export default function PaymentPage() {
  const [screen, setScreen] = useState<PaymentScreen>("select-method")
  const [selectedMethod, setSelectedMethod] = useState("")
  const searchParams = useSearchParams()
  const requestId = searchParams.get('id') || ''
  const router = useRouter()

  const handleMethodSelected = (method: string) => {
    setSelectedMethod(method)
    if (method === "bank-transfer") {
      setScreen("bank-transfer")
    } else if (method === "payhere") {
      setScreen("payhere")
    } else {
      setScreen("card-details")
    }
  }

  const handlePay = () => {
    setScreen("processing")
  }

  const handleProcessingComplete = (success: boolean) => {
    setScreen(success ? "success" : "failed")
  }

  const handleBankTransferComplete = () => {
    setScreen("success")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <>
      {screen === "select-method" && (
        <SelectPaymentMethod onContinue={handleMethodSelected} />
      )}

      {screen === "card-details" && (
        <EnterCardDetails
          onBack={() => setScreen("select-method")}
          onPay={handlePay}
        />
      )}

      {screen === "bank-transfer" && (
        <BankTransfer
          onBack={() => setScreen("select-method")}
          onComplete={handleBankTransferComplete}
          onCancel={() => setScreen("select-method")}
        />
      )}

      {screen === "payhere" && (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg mt-20">
          <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
          <p className="text-muted-foreground text-center mb-8">
            You will be redirected to PayHere secure gateway to complete your subscription.
          </p>
          <PayHereCheckout requestId={requestId} />
          <button 
            onClick={() => setScreen("select-method")}
            className="mt-4 text-sm text-muted-foreground underline"
          >
            Go Back
          </button>
        </div>
      )}

      {screen === "processing" && (
        <ProcessingPayment onComplete={handleProcessingComplete} />
      )}

      {screen === "success" && (
        <PaymentSuccess onGoToDashboard={handleLogin} />
      )}

      {screen === "failed" && (
        <PaymentFailed
          onTryAgain={() => setScreen("card-details")}
          onUseDifferentMethod={() => setScreen("select-method")}
        />
      )}
    </>
  )
}