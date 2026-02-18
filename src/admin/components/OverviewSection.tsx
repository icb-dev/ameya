import { useState } from "react";
import { uploadSingleImage, getImageUrl } from "../../services/upload";
import type { OverviewSectionData } from "../types/project.types";

interface Props {
  data: OverviewSectionData;
  onChange: (data: OverviewSectionData) => void;
}

export default function OverviewSection({ data, onChange }: Props) {
  // Use images array if available, otherwise fall back to single image for backward compatibility
  const images = data.images || (data.image ? [data.image] : []);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadSingleImage("misc", file);

    if (typeof index === "number") {
      // Replace image at specific index
      const newImages = [...images];
      newImages[index] = url;
      onChange({
        ...data,
        images: newImages,
        image: newImages[0] || "", // Keep backward compatibility
      });
    } else {
      // Add new image
      const newImages = [...images, url];
      onChange({
        ...data,
        images: newImages,
        image: newImages[0] || "", // Keep backward compatibility
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange({
      ...data,
      images: newImages,
      image: newImages[0] || "", // Keep backward compatibility
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview Section</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
          <input
            type="text"
            placeholder="Heading"
            value={data.heading}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            placeholder="Description"
            rows={4}
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Overview Images</label>
            <label className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
              + Add Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadSingleImage("misc", file);
                  const newImages = [...images, url];
                  onChange({
                    ...data,
                    images: newImages,
                    image: newImages[0] || "",
                  });
                  e.target.value = ""; // Reset input
                }}
              />
            </label>
          </div>

          {images.length === 0 ? (
            <div className="text-sm text-gray-500 py-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              No images added. Click "Add Image" to upload.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(img)}
                      alt={`Overview ${index + 1}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        console.error("Failed to load overview image:", img);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      title="Remove image"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      Replace Image {index + 1}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
