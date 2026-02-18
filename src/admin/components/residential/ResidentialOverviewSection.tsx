import { useState } from "react";
import { uploadSingleImage, getImageUrl } from "../../../services/upload";
import type { ResidentialOverviewSectionData } from "../../types/project.types";

interface Props {
  data: ResidentialOverviewSectionData;
  onChange: (data: ResidentialOverviewSectionData) => void;
}

export default function ResidentialOverviewSection({ data, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const addKeyFeature = () => {
    onChange({
      ...data,
      key_features: [...data.key_features, ""]
    });
  };

  const updateKeyFeature = (index: number, value: string) => {
    const updated = [...data.key_features];
    updated[index] = value;
    onChange({ ...data, key_features: updated });
  };

  const removeKeyFeature = (index: number) => {
    onChange({
      ...data,
      key_features: data.key_features.filter((_, i) => i !== index)
    });
  };

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadSingleImage("overview", file);
      onChange({ ...data, image: url });
    } catch (error) {
      console.error("Residential overview image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-900">Overview</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Content */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Heading</label>
            <input
              type="text"
              placeholder="e.g. Luxury Residences in the Heart of the City"
              value={data.heading}
              onChange={(e) => onChange({ ...data, heading: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Write a short overview about the residential project..."
              value={data.description}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">Key Features</label>
              <button
                type="button"
                onClick={addKeyFeature}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 font-medium"
              >
                + Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {data.key_features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Gated community with 3-tier security"
                    value={feature}
                    onChange={(e) => updateKeyFeature(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeKeyFeature(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {data.key_features.length === 0 && (
                <p className="text-xs text-gray-400">
                  No key features added yet. Use &quot;Add Feature&quot; to list important highlights.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Overview Image</label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-60"
            />

            {data.image && (
              <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <div className="aspect-video">
                  <img
                    src={getImageUrl(data.image)}
                    alt="Residential overview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Failed to load residential overview image:", data.image);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
