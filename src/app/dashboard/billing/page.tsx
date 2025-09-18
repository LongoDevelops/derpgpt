"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Check, X, CreditCard, Calendar, Download } from "lucide-react";

interface BillingInfo {
  plan: string;
  stripeId?: string;
  subscriptionStatus?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    plan: "free",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    try {
      const response = await fetch("/api/billing/info");
      if (response.ok) {
        const data = await response.json();
        setBillingInfo(data);
      }
    } catch (error) {
      console.error("Failed to fetch billing info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error upgrading:", error);
      alert("Failed to start upgrade process. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing period."
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/billing/cancel-subscription", {
        method: "POST",
      });

      if (response.ok) {
        await fetchBillingInfo();
        alert(
          "Subscription cancelled successfully. You will retain Pro access until the end of your billing period."
        );
      } else {
        throw new Error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const isPro = billingInfo.plan === "pro";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Billing & Subscription
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Current Plan
            </h2>
            <p className="text-gray-600">
              {isPro ? "Pro Plan - $29/month" : "Free Plan - $0/month"}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              isPro
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {isPro ? "Active" : "Free"}
          </div>
        </div>

        {isPro && billingInfo.currentPeriodEnd && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">
                {billingInfo.cancelAtPeriodEnd
                  ? `Subscription ends on ${new Date(
                      billingInfo.currentPeriodEnd
                    ).toLocaleDateString()}`
                  : `Next billing date: ${new Date(
                      billingInfo.currentPeriodEnd
                    ).toLocaleDateString()}`}
              </span>
            </div>
          </div>
        )}

        {!isPro && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-yellow-800">Upgrade to Pro</h3>
                <p className="text-sm text-yellow-700">
                  Unlock unlimited videos, HD quality, and premium features
                </p>
              </div>
              <Button onClick={handleUpgrade} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Upgrade to Pro"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Plan Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Free Plan</h3>
            <ul className="space-y-3">
              {[
                "3 videos per month",
                "Watermarked videos",
                "Standard quality (720p)",
                "30 seconds max duration",
                "Basic templates",
                "Community support",
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  {feature.startsWith("3 videos") ? (
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-3" />
                  )}
                  <span
                    className={
                      feature.startsWith("3 videos")
                        ? "text-green-700"
                        : "text-gray-500"
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Pro Plan</h3>
            <ul className="space-y-3">
              {[
                "Unlimited videos",
                "No watermark",
                "HD quality (1080p)",
                "Up to 5 minutes duration",
                "All templates",
                "Premium templates",
                "Priority processing",
                "Email support",
                "Custom branding",
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-green-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Billing Actions */}
      {isPro && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Manage Subscription
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">
                  Update Payment Method
                </h3>
                <p className="text-sm text-gray-600">
                  Manage your payment information and billing address
                </p>
              </div>
              <Button variant="outline" disabled>
                <CreditCard className="mr-2 h-4 w-4" />
                Update
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Download Invoices</h3>
                <p className="text-sm text-gray-600">
                  Access your billing history and download invoices
                </p>
              </div>
              <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
              <div>
                <h3 className="font-medium text-red-900">
                  Cancel Subscription
                </h3>
                <p className="text-sm text-red-700">
                  Cancel your subscription and return to the free plan
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                disabled={isProcessing}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {isProcessing ? "Processing..." : "Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Usage This Month
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <div className="text-sm text-gray-600">Videos Generated</div>
            <div className="text-xs text-gray-500">
              {isPro ? "Unlimited" : "3 videos limit"}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <div className="text-sm text-gray-600">Minutes Used</div>
            <div className="text-xs text-gray-500">
              {isPro ? "Unlimited" : "90 minutes limit"}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <div className="text-sm text-gray-600">Storage Used</div>
            <div className="text-xs text-gray-500">
              {isPro ? "Unlimited" : "1 GB limit"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
