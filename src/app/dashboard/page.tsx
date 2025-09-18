"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Play, Video, Clock, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalVideos: number;
  videosThisMonth: number;
  totalMinutes: number;
  trendingVideo?: {
    id: string;
    title: string;
    views: number;
  };
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    videosThisMonth: 0,
    totalMinutes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your videos today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="flex items-center">
            <Link href="/dashboard/generate">
              <Play className="mr-2 h-5 w-5" />
              Generate New Video
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/dashboard/videos">
              <Video className="mr-2 h-5 w-5" />
              View All Videos
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalVideos}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.videosThisMonth}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Minutes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalMinutes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-8">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Start creating your first video to see activity here
          </p>
        </div>
      </div>

      {/* Plan Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Plan</p>
            <p className="text-xl font-bold text-gray-900">Free Plan</p>
            <p className="text-sm text-gray-500">
              {3 - stats.totalVideos} videos remaining this month
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/billing">Upgrade to Pro</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
