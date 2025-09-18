"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { VideoCard } from "@/components/VideoCard";
import {
  Download,
  Play,
  Calendar,
  Clock,
  Video,
  CheckCircle,
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  duration?: number;
  preset: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "completed" | "processing" | "failed"
  >("all");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/get-videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter((video) => {
    if (filter === "all") return true;
    return video.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
          <p className="text-gray-600 mt-2">
            Manage and download your generated videos
          </p>
        </div>
        <Button asChild>
          <a href="/dashboard/generate">
            <Play className="mr-2 h-4 w-4" />
            Create New Video
          </a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {videos.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {videos.filter((v) => v.status === "completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">
                {videos.filter((v) => v.status === "processing").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  videos.filter((v) => {
                    const videoDate = new Date(v.createdAt);
                    const now = new Date();
                    return (
                      videoDate.getMonth() === now.getMonth() &&
                      videoDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            Filter by status:
          </span>
          {[
            { key: "all", label: "All Videos" },
            { key: "completed", label: "Completed" },
            { key: "processing", label: "Processing" },
            { key: "failed", label: "Failed" },
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No videos yet
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === "all"
              ? "You haven't created any videos yet. Get started by creating your first video!"
              : `No videos with status "${filter}" found.`}
          </p>
          {filter === "all" && (
            <Button asChild>
              <a href="/dashboard/generate">Create Your First Video</a>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
