"use client";

import { Button } from "@/components/ui/Button";
import { Download, Play, Calendar, Clock, AlertCircle } from "lucide-react";

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

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Play className="h-4 w-4 text-green-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Ready";
      case "processing":
        return "Processing";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="aspect-video bg-gray-100 rounded-t-lg relative overflow-hidden">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : video.status === "completed" ? (
          <div className="w-full h-full flex items-center justify-center">
            <video
              src={video.url}
              className="w-full h-full object-cover"
              muted
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              {getStatusIcon(video.status)}
              <p className="text-sm text-gray-500 mt-2">
                {video.status === "processing"
                  ? "Generating..."
                  : video.status === "failed"
                  ? "Generation Failed"
                  : "No Preview"}
              </p>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              video.status
            )}`}
          >
            {getStatusIcon(video.status)}
            <span className="ml-1">{getStatusText(video.status)}</span>
          </span>
        </div>

        {video.duration && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {Math.floor(video.duration / 60)}:
            {(video.duration % 60).toString().padStart(2, "0")}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {video.title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(video.createdAt)}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{video.preset}</span>
        </div>

        <div className="flex items-center justify-between">
          {video.status === "completed" ? (
            <>
              <Button size="sm" variant="outline" asChild>
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <Play className="mr-1 h-4 w-4" />
                  View
                </a>
              </Button>
              <Button size="sm" asChild>
                <a href={video.url} download>
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </a>
              </Button>
            </>
          ) : video.status === "processing" ? (
            <div className="flex items-center text-sm text-yellow-600">
              <Clock className="h-4 w-4 mr-1 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <Button size="sm" variant="outline" disabled>
              <AlertCircle className="mr-1 h-4 w-4" />
              Generation Failed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
