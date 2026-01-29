'use client';
import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function StripeForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't yet loaded.
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Where to redirect after successful payment
        return_url: `${window.location.origin}/dashboard`, 
      },
    });

    // This is reached only if there is an error (e.g. card declined)
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      {/* This single component renders the Card/UPI/Netbanking inputs automatically */}
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit" 
        className="btn-neon w-full flex justify-center items-center py-4 text-lg"
      >
        <span id="button-text">
          {isLoading ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}
        </span>
      </button>
      
      {/* Error Message Display */}
      {message && <div id="payment-message" className="text-red-500 text-sm font-bold text-center mt-2">{message}</div>}
    </form>
  );
}