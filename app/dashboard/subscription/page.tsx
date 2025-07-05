"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store";
import { differenceInDays } from "date-fns";

export default function SubscriptionPage() {
  const { isTrialActive, isSubscribed, trialEnd, subscriptionEndDate } = useAuthStore();
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
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Subscription</h1>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 space-y-4">
        <div className="font-semibold">Status</div>
        <div>{status}</div>
        <div className="pt-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded" disabled>Subscribe (Coming Soon)</button>
        </div>
        <div className="pt-2 text-sm text-muted-foreground">Payment and subscription management coming soon...</div>
      </div>
    </div>
  );
}
