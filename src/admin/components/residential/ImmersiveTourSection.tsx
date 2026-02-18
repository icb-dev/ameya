import { uploadSingleImage, getImageUrl } from "../../../services/upload";
import type { ImmersiveTourSectionData } from "../../types/project.types";

interface Props {
  data: ImmersiveTourSectionData;
  onChange: (data: ImmersiveTourSectionData) => void;
}

export default function ImmersiveTourSection({ data, onChange }: Props) {
  const handleUpload = async (file: File) => {
    const url = await uploadSingleImage("immersive-tour", file);
    onChange({ ...data, image: url });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-900">Immersive Tour</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* URLs */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL 1
            </label>
            <input
              type="url"
              placeholder="Primary tour URL (e.g. 360° walkthrough)"
              value={data.url1}
              onChange={(e) => onChange({ ...data, url1: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL 2
            </label>
            <input
              type="url"
              placeholder="Secondary tour / video URL"
              value={data.url}
              onChange={(e) => onChange({ ...data, url: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
            />
          </div>

          <p className="text-xs text-gray-400">
            Add links to 360° tours, walkthroughs, or hosted experience pages. These will be displayed with the preview image on the website.
          </p>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tour Preview Image
          </label>
          {data.image ? (
            <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50 group">
              <div className="aspect-video">
                <img
                  src={getImageUrl(data.image)}
                  alt="Immersive tour preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load immersive tour image:", data.image);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <input
                  type="file"
                  accept="image/*"
                  id="immersive-tour-upload"
                  onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="immersive-tour-upload"
                  className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg cursor-pointer text-xs font-medium shadow-lg transition-all"
                >
                  Change Image
                </label>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                id="immersive-tour-upload"
                onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="immersive-tour-upload"
                className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group/upload"
              >
                <div className="flex flex-col items-center gap-2 text-gray-400 group-hover/upload:text-blue-600 transition-colors">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Click to upload preview image</span>
                  <span className="text-xs">PNG, JPG up to 10MB</span>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
