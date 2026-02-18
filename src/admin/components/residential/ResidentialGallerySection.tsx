import { useState } from "react";
import { uploadSingleImage, getImageUrl } from "../../../services/upload";
import type { ResidentialGallerySectionData } from "../../types/project.types";

interface Props {
  data: ResidentialGallerySectionData;
  onChange: (data: ResidentialGallerySectionData) => void;
}

export default function ResidentialGallerySection({ data, onChange }: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addImageField = () => {
    onChange({
      ...data,
      images: [...data.images, ""]
    });
  };

  const addYoutubeField = () => {
    onChange({
      ...data,
      youtube_links: [...data.youtube_links, ""]
    });
  };

  const uploadImage = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const url = await uploadSingleImage("gallery", file);
      const updated = [...data.images];
      updated[index] = url;
      onChange({ ...data, images: updated });
    } catch (error) {
      console.error("Residential gallery upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeImage = (index: number) => {
    if (window.confirm("Remove this image from the gallery?")) {
      onChange({
        ...data,
        images: data.images.filter((_, i) => i !== index)
      });
    }
  };

  const updateYoutubeLink = (index: number, value: string) => {
    const updated = [...data.youtube_links];
    updated[index] = value;
    onChange({ ...data, youtube_links: updated });
  };

  const removeYoutubeLink = (index: number) => {
    if (window.confirm("Remove this YouTube link?")) {
      onChange({
        ...data,
        youtube_links: data.youtube_links.filter((_, i) => i !== index)
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
        <div className="flex gap-3">
          <button
            type="button"
            onClick={addImageField}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Image
          </button>
          <button
            type="button"
            onClick={addYoutubeField}
            className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-all border border-blue-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Add YouTube Link
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Images</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.images.map((img, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50/60 hover:shadow-lg transition-all duration-200 relative group"
            >
              {/* Remove Button */}
              <button
                type="button"
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
                      console.error("Failed to load residential gallery image:", img);
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
                      id={`res-gallery-upload-${index}`}
                      onChange={(e) => e.target.files && uploadImage(index, e.target.files[0])}
                      className="hidden"
                      disabled={uploadingIndex === index}
                    />
                    <label
                      htmlFor={`res-gallery-upload-${index}`}
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
                    id={`res-gallery-upload-${index}`}
                    onChange={(e) => e.target.files && uploadImage(index, e.target.files[0])}
                    className="hidden"
                    disabled={uploadingIndex === index}
                  />
                  <label
                    htmlFor={`res-gallery-upload-${index}`}
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
            <div className="col-span-full text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100/60 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-medium text-lg mb-1">No images in gallery yet</p>
              <p className="text-gray-400 text-sm">Use &quot;Add Image&quot; to start building the residential gallery.</p>
            </div>
          )}
        </div>
      </div>

      {/* YouTube Links */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3">YouTube Video Links</h4>
        <div className="space-y-3">
          {data.youtube_links.map((link, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-white to-gray-50/60 hover:shadow-md transition-all duration-200 relative group"
            >
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeYoutubeLink(index)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Remove link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-2 pr-8">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  YouTube URL #{index + 1}
                </label>
                <input
                  type="url"
                  placeholder="Paste YouTube video URL"
                  value={link}
                  onChange={(e) => updateYoutubeLink(index, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          ))}

          {data.youtube_links.length === 0 && (
            <p className="text-xs text-gray-400">
              No YouTube video links added yet. Use &quot;Add YouTube Link&quot; to showcase walkthroughs or promo videos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

