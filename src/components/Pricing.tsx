import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our platform",
    features: [
      "3 free videos per month",
      "Watermarked videos",
      "Standard quality (720p)",
      "30 seconds max duration",
      "Basic templates",
      "Community support",
    ],
    limitations: [
      "Limited to 3 videos",
      "Watermark on all videos",
      "Standard quality only",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For creators and businesses who need more",
    features: [
      "Unlimited videos",
      "No watermark",
      "HD quality (1080p)",
      "Up to 5 minutes duration",
      "All templates",
      "Premium templates",
      "Priority processing",
      "Email support",
      "Custom branding",
    ],
    limitations: [],
    buttonText: "Start Pro Trial",
    buttonVariant: "default" as const,
    popular: true,
  },
];

export function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for you. You can always upgrade or
            downgrade later.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-900">
                  What's included:
                </h4>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}

                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900 mt-6">
                      Limitations:
                    </h4>
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-center">
                        <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{limitation}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <Button
                asChild
                variant={plan.buttonVariant}
                className="w-full text-lg py-4"
              >
                <Link
                  href={
                    plan.name === "Free" ? "/auth/signup" : "/dashboard/billing"
                  }
                >
                  {plan.buttonText}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom plan for your team?
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
