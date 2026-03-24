"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SelectPaymentMethod } from "./select-payment-method"
import { EnterCardDetails } from "./enter-card-details"
import { BankTransfer } from "./bank-transfer"
import { ProcessingPayment } from "./processing-payment"
import { PaymentSuccess } from "./payment-success"
import { PaymentFailed } from "./payment-failed"

type PaymentScreen =
  | "select-method"
  | "card-details"
  | "bank-transfer"
  | "processing"
  | "success"
  | "failed"

export default function PaymentPage() {
  const [screen, setScreen] = useState<PaymentScreen>("select-method")
  const [selectedMethod, setSelectedMethod] = useState("")
  const router = useRouter()

  const handleMethodSelected = (method: string) => {
    setSelectedMethod(method)
    if (method === "bank-transfer") {
      setScreen("bank-transfer")
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