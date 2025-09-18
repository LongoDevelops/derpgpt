"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Play, Loader2, CheckCircle } from "lucide-react";
import { PresetCard } from "@/components/PresetCard";
import presets from "@/data/presets.json";

interface Preset {
  id: string;
  name: string;
  description: string;
  fields: string[];
  orientation: string;
  duration: number;
  style: string;
}

interface FormData {
  [key: string]: string;
}

export default function GenerateVideo() {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [step, setStep] = useState<
    "select" | "configure" | "generating" | "complete"
  >("select");

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    setStep("configure");

    // Initialize form data with empty values
    const initialData: FormData = {};
    preset.fields.forEach((field) => {
      initialData[field] = "";
    });
    setFormData(initialData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!selectedPreset) return;

    setIsGenerating(true);
    setStep("generating");

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preset: selectedPreset.id,
          fields: formData,
          title:
            formData["Product Name"] ||
            formData["Topic"] ||
            formData["Message"] ||
            "Untitled Video",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedVideo(data.videoUrl);
        setStep("complete");
      } else {
        throw new Error("Failed to generate video");
      }
    } catch (error) {
      console.error("Error generating video:", error);
      alert("Failed to generate video. Please try again.");
      setStep("configure");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewVideo = () => {
    setSelectedPreset(null);
    setFormData({});
    setGeneratedVideo(null);
    setStep("select");
  };

  const isFormValid =
    selectedPreset?.fields.every((field) => formData[field]?.trim()) || false;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate New Video</h1>
        <p className="text-gray-600 mt-2">
          Choose a preset template and customize it to create your perfect video
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-8">
        {[
          { key: "select", label: "Select Template", icon: "📝" },
          { key: "configure", label: "Configure", icon: "⚙️" },
          { key: "generating", label: "Generating", icon: "🎬" },
          { key: "complete", label: "Complete", icon: "✅" },
        ].map((stepItem, index) => {
          const isActive = step === stepItem.key;
          const isCompleted =
            ["select", "configure", "generating", "complete"].indexOf(step) >
            index;

          return (
            <div key={stepItem.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted && step !== stepItem.key ? "✓" : stepItem.icon}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {stepItem.label}
              </span>
              {index < 3 && (
                <div
                  className={`ml-4 w-16 h-0.5 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {step === "select" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Choose a Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onSelect={() => handlePresetSelect(preset)}
              />
            ))}
          </div>
        </div>
      )}

      {step === "configure" && selectedPreset && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Configure Your Video
            </h2>
            <Button variant="outline" onClick={() => setStep("select")}>
              Back to Templates
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedPreset.name}
              </h3>
              <p className="text-gray-600">{selectedPreset.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>Duration: {selectedPreset.duration}s</span>
                <span>•</span>
                <span>Orientation: {selectedPreset.orientation}</span>
              </div>
            </div>

            <div className="space-y-4">
              {selectedPreset.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field}
                  </label>
                  {field.toLowerCase().includes("description") ||
                  field.toLowerCase().includes("script") ||
                  field.toLowerCase().includes("points") ? (
                    <textarea
                      value={formData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      rows={4}
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder={`Enter ${field.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleGenerate}
                disabled={!isFormValid}
                size="lg"
                className="flex items-center"
              >
                <Play className="mr-2 h-5 w-5" />
                Generate Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Generating Your Video
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Our AI is working hard to create your video. This usually takes 1-2
            minutes. Please don't close this page.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Processing video...</p>
          </div>
        </div>
      )}

      {step === "complete" && generatedVideo && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-6">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Video Generated Successfully!
          </h2>
          <p className="text-gray-600 mb-8">
            Your video has been created and is ready to download.
          </p>

          <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mb-8">
            <div className="aspect-video bg-gray-100 rounded-lg mb-4">
              <video
                src={generatedVideo}
                controls
                className="w-full h-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <a href={generatedVideo} download>
                  Download Video
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard/videos">View in Library</a>
              </Button>
            </div>
          </div>

          <Button onClick={handleNewVideo} size="lg">
            Create Another Video
          </Button>
        </div>
      )}
    </div>
  );
}
