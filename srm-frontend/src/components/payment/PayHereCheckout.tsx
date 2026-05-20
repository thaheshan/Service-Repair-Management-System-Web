'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface PayHereCheckoutProps {
  requestId: string;
}

export default function PayHereCheckout({ requestId }: PayHereCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/v1/onboarding/create-payhere-params`, {
        requestId,
      });

      if (response.data.success) {
        console.log('PAYHERE API RESPONSE:', response.data);
        const params = response.data.data;
        
        // PayHere Payment Request
        const payment = {
          sandbox: true, // Set to false in production
          merchant_id: params.merchant_id,
          return_url: params.return_url,
          cancel_url: params.cancel_url,
          notify_url: params.notify_url,
          order_id: params.order_id,
          items: params.items,
          amount: params.amount,
          currency: params.currency,
          hash: params.hash,
          first_name: params.first_name,
          last_name: params.last_name,
          email: params.email,
          phone: params.phone,
          address: params.address,
          city: params.city,
          country: params.country,
        };

        // Standard way is to submit a hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payhere.lk/pay/checkout'; // Change to production URL later

        for (const key in payment) {
          if (key === 'sandbox') continue;
          if (Object.prototype.hasOwnProperty.call(payment, key)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = (payment as any)[key];
            form.appendChild(input);
          }
        }

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error: any) {
      toast.error('Failed to initialize payment');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading}
      className="w-full bg-[#ebba16] hover:bg-[#d4a814] text-black font-bold h-12"
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
      Pay with PayHere
    </Button>
  );
}
