import { Zap, Palette, Clock, Download, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate professional videos in under 60 seconds with our advanced AI technology.",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description:
      "Choose from dozens of professionally designed templates for every use case.",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Create videos anytime, anywhere. Our platform never sleeps.",
  },
  {
    icon: Download,
    title: "Easy Export",
    description:
      "Download your videos in multiple formats and resolutions for any platform.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your content is encrypted and secure. We never share your data.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share projects with your team and collaborate in real-time.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to create amazing videos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with
            intuitive design to make video creation accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
