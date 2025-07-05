"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/lib/auth-store";
import { differenceInDays } from "date-fns";

export default function SubscriptionPage() {
  const { isTrialActive, isSubscribed, trialEnd, subscriptionEndDate, user } = useAuthStore();
  const [form, setForm] = useState({
    amount: "",
    transactionId: "",
    screenshot: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const now = new Date();
  let status = "";
  let daysLeft = 0;
  if (isSubscribed && subscriptionEndDate) {
    daysLeft = differenceInDays(new Date(subscriptionEndDate), now);
    status = daysLeft >= 0 ? `Subscribed (${daysLeft} days left)` : "Subscription expired";
  } else if (isTrialActive && trialEnd) {
    daysLeft = differenceInDays(new Date(trialEnd), now);
    status = daysLeft >= 0 ? `Free Trial (${daysLeft} days left)` : "Trial expired";
  } else {
    status = "No active subscription or trial.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      let screenshotUrl = null;
      if (form.screenshot) {
        const { data, error: uploadError } = await supabase.storage.from("payment-screenshots").upload(`screenshots/${Date.now()}-${form.screenshot.name}`, form.screenshot);
        if (uploadError) throw uploadError;
        screenshotUrl = data?.path || null;
      }
      const { error: insertError } = await supabase.from("payments").insert({
        user_id: user?.id,
        amount: form.amount,
        transaction_id: form.transactionId,
        screenshot: screenshotUrl,
        method: "M-Pesa",
        status: "pending",
        date: new Date().toISOString(),
      });
      if (insertError) throw insertError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 space-y-4">
        <div className="font-semibold">Status</div>
        <div>{status}</div>
        <div className="pt-4">
          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">How to Pay</h2>
            <ul className="list-disc pl-6 text-sm">
              <li>Open your M-Pesa app or dial *150*00#</li>
              <li>Choose "Send Money"</li>
              <li>Enter number: <b>+255 712 815 726</b></li>
              <li>Recipient: <b>Ibrahim Msambwe</b></li>
              <li>Enter the amount for your subscription</li>
              <li>Complete the payment and save the confirmation message</li>
            </ul>
          </div>
          <hr className="my-4" />
          <h2 className="font-bold text-lg mb-2">Submit Payment Confirmation</h2>
          {success ? (
            <div className="text-green-600 font-semibold">Thank you! Your payment is pending verification.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Amount (TZS)</label>
                <input type="number" className="input input-bordered w-full" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <label className="block font-medium">Transaction/Reference Number</label>
                <input type="text" className="input input-bordered w-full" required value={form.transactionId} onChange={e => setForm(f => ({ ...f, transactionId: e.target.value }))} />
              </div>
              <div>
                <label className="block font-medium">Screenshot (optional)</label>
                <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, screenshot: e.target.files?.[0] || null }))} />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? "Submitting..." : "Submit Payment"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
