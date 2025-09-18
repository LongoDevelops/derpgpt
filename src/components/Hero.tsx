import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Play, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                AI-Powered Video Creation
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate stunning
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              AI videos{" "}
            </span>
            in seconds
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your ideas into professional videos with our AI-powered
            platform. Choose from preset templates or create custom videos with
            just a few clicks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link href="/auth/signup">
                Start Creating Free
                <Play className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 3 free videos • Cancel anytime
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Video Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
