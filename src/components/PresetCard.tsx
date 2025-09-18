"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Play, Clock, Smartphone, Monitor } from "lucide-react";

interface Preset {
  id: string;
  name: string;
  description: string;
  fields: string[];
  orientation: string;
  duration: number;
  style: string;
}

interface PresetCardProps {
  preset: Preset;
  onSelect: () => void;
}

export function PresetCard({ preset, onSelect }: PresetCardProps) {
  const getOrientationIcon = (orientation: string) => {
    return orientation === "vertical" ? Smartphone : Monitor;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{preset.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{preset.duration}s</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm">{preset.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {React.createElement(getOrientationIcon(preset.orientation), {
              className: "h-4 w-4",
            })}
            <span className="capitalize">{preset.orientation}</span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {preset.fields.length} fields
          </span>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-xs font-medium text-gray-700">Required fields:</p>
          <div className="flex flex-wrap gap-1">
            {preset.fields.slice(0, 3).map((field, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
              >
                {field}
              </span>
            ))}
            {preset.fields.length > 3 && (
              <span className="text-xs text-gray-500">
                +{preset.fields.length - 3} more
              </span>
            )}
          </div>
        </div>

        <Button onClick={onSelect} className="w-full" size="sm">
          <Play className="mr-2 h-4 w-4" />
          Use Template
        </Button>
      </div>
    </div>
  );
}
