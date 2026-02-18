import { useState } from "react";
import { uploadSingleImage, getImageUrl } from "../../services/upload";
import type { GallerySectionData } from "../types/project.types";

interface Props {
  data: GallerySectionData;
  onChange: (data: GallerySectionData) => void;
}

export default function GallerySection({ data, onChange }: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Add empty image field
  const addImageField = () => {
    onChange({
      images: [...data.images, ""]
    });
  };

  // Upload image for specific index
  const uploadImage = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const url = await uploadSingleImage("gallery", file);
      const updated = [...data.images];
      updated[index] = url;
      onChange({ images: updated });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  };

  // Remove image field
  const removeImage = (index: number) => {
    if (window.confirm("Are you sure you want to remove this image from the gallery?")) {
      onChange({
        images: data.images.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">Gallery</h3>
        </div>
        <button
          onClick={addImageField}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Image
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.images.map((img, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50/50 hover:shadow-lg transition-all duration-200 relative group"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {img ? (
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={getImageUrl(img)}
                  alt={`Gallery image ${index + 1}`}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.error("Failed to load gallery image:", img);
                    e.currentTarget.style.display = "none";
                  }}
                />
                {uploadingIndex === index && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <input
                    type="file"
                    accept="image/*"
                    id={`gallery-upload-${index}`}
                    onChange={(e) => e.target.files && uploadImage(index, e.target.files[0])}
                    className="hidden"
                    disabled={uploadingIndex === index}
                  />
                  <label
                    htmlFor={`gallery-upload-${index}`}
                    className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg cursor-pointer text-sm font-medium shadow-lg transition-all"
                  >
                    Change Image
                  </label>
                </div>
              </div>
            ) : (
              <div className="relative aspect-square">
                <input
                  type="file"
                  accept="image/*"
                  id={`gallery-upload-${index}`}
                  onChange={(e) => e.target.files && uploadImage(index, e.target.files[0])}
                  className="hidden"
                  disabled={uploadingIndex === index}
                />
                <label
                  htmlFor={`gallery-upload-${index}`}
                  className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group/upload"
                >
                  {uploadingIndex === index ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600 font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover/upload:text-blue-600 transition-colors">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Click to upload</span>
                      <span className="text-xs">PNG, JPG</span>
                    </div>
                  )}
                </label>
              </div>
            )}

            {/* Image Index Badge */}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-md">
              #{index + 1}
            </div>
          </div>
        ))}

        {data.images.length === 0 && (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 font-medium text-lg mb-2">No images in gallery yet</p>
            <p className="text-gray-400 text-sm">Click the button above to add images to your gallery</p>
          </div>
        )}
      </div>

      {/* Info Text */}
      {data.images.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Gallery images will be displayed in the order shown. You can reorder by removing and re-adding images.</span>
          </p>
        </div>
      )}
    </div>
  );
}
